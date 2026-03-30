import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateRecommendations } from '../services/recommendationEngine';

const router = Router();
const prisma = new PrismaClient();

// 프로그램 목록
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { category, status } = req.query;
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const programs = await prisma.program.findMany({
      where,
      include: {
        enrollments: { where: { status: 'ACTIVE' }, include: { resident: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(programs);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 프로그램 상세
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const program = await prisma.program.findUnique({
      where: { id: req.params.id },
      include: {
        enrollments: {
          include: { resident: { select: { id: true, name: true, roomNumber: true } } },
        },
        attendances: { orderBy: { attendedAt: 'desc' }, take: 50 },
      },
    });
    if (!program) return res.status(404).json({ message: '프로그램을 찾을 수 없습니다.' });
    return res.json(program);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 프로그램 생성
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const program = await prisma.program.create({ data: req.body });
    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'PROGRAM_CREATE',
        targetType: 'Program',
        targetId: program.id,
        details: `${program.name} 프로그램 생성`,
      },
    });
    return res.status(201).json(program);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 프로그램 수정
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const program = await prisma.program.update({ where: { id: req.params.id }, data: req.body });
    return res.json(program);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 프로그램 등록
router.post('/:id/enroll', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { residentId } = req.body;
    const program = await prisma.program.findUnique({ where: { id: req.params.id } });
    if (!program) return res.status(404).json({ message: '프로그램을 찾을 수 없습니다.' });

    if (program.capacity && program.enrolledCount >= program.capacity) {
      return res.status(400).json({ message: '정원이 초과되었습니다.' });
    }

    const enrollment = await prisma.programEnrollment.create({
      data: { residentId, programId: req.params.id },
      include: { resident: { select: { id: true, name: true } }, program: true },
    });

    await prisma.program.update({
      where: { id: req.params.id },
      data: { enrolledCount: { increment: 1 } },
    });

    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'PROGRAM_ENROLL',
        targetType: 'Program',
        targetId: req.params.id,
        details: `${enrollment.resident.name} ${program.name} 등록`,
      },
    });

    return res.status(201).json(enrollment);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: '이미 등록된 입주자입니다.' });
    }
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 프로그램 등록 취소
router.delete('/:id/enroll/:enrollmentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.programEnrollment.update({
      where: { id: req.params.enrollmentId },
      data: { status: 'WITHDRAWN' },
    });
    await prisma.program.update({
      where: { id: req.params.id },
      data: { enrolledCount: { decrement: 1 } },
    });
    return res.json({ message: '등록이 취소되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 출석 기록
router.post('/:id/attendance', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { enrollmentId, isPresent, notes } = req.body;
    const attendance = await prisma.programAttendance.create({
      data: {
        enrollmentId,
        programId: req.params.id,
        isPresent: isPresent !== false,
        notes,
      },
    });
    return res.status(201).json(attendance);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 입주자별 프로그램 추천
router.get('/recommend/:residentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const resident = await prisma.resident.findUnique({
      where: { id: req.params.residentId },
      include: {
        diseases: { include: { disease: true } },
        programEnrollments: { where: { status: 'ACTIVE' } },
      },
    });

    if (!resident) return res.status(404).json({ message: '입주자를 찾을 수 없습니다.' });

    const programs = await prisma.program.findMany({
      where: { status: { not: 'ENDED' } },
    });

    const recommendations = generateRecommendations(resident, programs);

    // DB에 저장
    for (const rec of recommendations) {
      await prisma.programRecommendation.upsert({
        where: {
          id: `${resident.id}_${rec.programId}`,
        },
        update: { score: rec.score, reason: rec.reason },
        create: {
          id: `${resident.id}_${rec.programId}`,
          residentId: resident.id,
          programId: rec.programId,
          score: rec.score,
          reason: rec.reason,
        },
      }).catch(() => {
        // 중복시 무시
      });
    }

    // 프로그램 상세 포함
    const enriched = await Promise.all(
      recommendations.map(async rec => {
        const program = programs.find(p => p.id === rec.programId);
        return { ...rec, program };
      })
    );

    return res.json(enriched);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
