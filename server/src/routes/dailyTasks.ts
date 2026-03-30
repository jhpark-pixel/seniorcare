import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// 카테고리 목록
const CATEGORIES = [
  'GENERAL',       // 일반
  'HEALTH_CHECK',  // 건강체크
  'MEDICATION',    // 투약
  'CLEANING',      // 청소
  'MEAL',          // 식사
  'ACTIVITY',      // 활동
  'SAFETY',        // 안전점검
];

// 일일 업무 목록 조회 (날짜 필터 지원)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;

    // 날짜 필터: 지정하지 않으면 오늘 날짜 기준
    let targetDate: Date;
    if (date && typeof date === 'string') {
      targetDate = new Date(date);
    } else {
      targetDate = new Date();
    }

    // 해당 날짜의 시작과 끝 계산
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await prisma.dailyTask.findMany({
      where: {
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: [
        { status: 'asc' },    // PENDING이 COMPLETED보다 먼저 (알파벳 순)
        { createdAt: 'desc' },
      ],
    });

    res.json(tasks);
  } catch (error) {
    console.error('일일 업무 목록 조회 오류:', error);
    res.status(500).json({ message: '일일 업무 목록을 불러오는 중 오류가 발생했습니다.' });
  }
});

// 일일 업무 생성
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, assignedTo, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: '업무 제목은 필수입니다.' });
    }

    if (category && !CATEGORIES.includes(category)) {
      return res.status(400).json({ message: '유효하지 않은 카테고리입니다.' });
    }

    const task = await prisma.dailyTask.create({
      data: {
        title,
        description: description || null,
        category: category || 'GENERAL',
        assignedTo: assignedTo || null,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        createdBy: req.admin!.name,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('일일 업무 생성 오류:', error);
    res.status(500).json({ message: '일일 업무를 생성하는 중 오류가 발생했습니다.' });
  }
});

// 일일 업무 완료 처리
router.patch('/:id/complete', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.dailyTask.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: '해당 업무를 찾을 수 없습니다.' });
    }

    const task = await prisma.dailyTask.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        completedBy: req.admin!.name,
      },
    });

    res.json(task);
  } catch (error) {
    console.error('일일 업무 완료 처리 오류:', error);
    res.status(500).json({ message: '업무 완료 처리 중 오류가 발생했습니다.' });
  }
});

// 일일 업무 재개 (다시 열기)
router.patch('/:id/reopen', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.dailyTask.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: '해당 업무를 찾을 수 없습니다.' });
    }

    const task = await prisma.dailyTask.update({
      where: { id },
      data: {
        status: 'PENDING',
        completedAt: null,
        completedBy: null,
      },
    });

    res.json(task);
  } catch (error) {
    console.error('일일 업무 재개 오류:', error);
    res.status(500).json({ message: '업무 재개 처리 중 오류가 발생했습니다.' });
  }
});

// 일일 업무 삭제 (시설장만 가능)
router.delete('/:id', authenticate, requireRole('DIRECTOR'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.dailyTask.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: '해당 업무를 찾을 수 없습니다.' });
    }

    await prisma.dailyTask.delete({ where: { id } });

    res.json({ message: '업무가 삭제되었습니다.' });
  } catch (error) {
    console.error('일일 업무 삭제 오류:', error);
    res.status(500).json({ message: '업무 삭제 중 오류가 발생했습니다.' });
  }
});

export default router;
