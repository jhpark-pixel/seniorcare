import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// GET / - 모든 관리자 목록 조회 (비밀번호 제외)
router.get('/', authenticate, requireRole('DIRECTOR'), async (req: AuthRequest, res: Response) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(admins);
  } catch (error) {
    console.error('관리자 목록 조회 오류:', error);
    res.status(500).json({ message: '관리자 목록을 불러오는데 실패했습니다.' });
  }
});

// POST / - 새 관리자 생성
router.post('/', authenticate, requireRole('DIRECTOR'), async (req: AuthRequest, res: Response) => {
  try {
    const { username, password, name, role, email, phone } = req.body;

    const trimmedUsername = username?.trim();
    const trimmedName = name?.trim();

    if (!trimmedUsername || !password || !trimmedName || !role) {
      return res.status(400).json({ message: '필수 항목을 모두 입력해주세요.' });
    }

    const validRoles = ['DIRECTOR', 'NURSE', 'SOCIAL_WORKER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: '유효하지 않은 역할입니다.' });
    }

    // 아이디 중복 확인
    const existing = await prisma.admin.findUnique({ where: { username: trimmedUsername } });
    if (existing) {
      return res.status(409).json({ message: '이미 사용 중인 아이디입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        username: trimmedUsername,
        password: hashedPassword,
        name: trimmedName,
        role,
        email: email || null,
        phone: phone || null,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.status(201).json(admin);
  } catch (error) {
    console.error('관리자 생성 오류:', error);
    res.status(500).json({ message: '관리자 계정 생성에 실패했습니다.' });
  }
});

// PATCH /:id - 관리자 정보 수정
router.patch('/:id', authenticate, requireRole('DIRECTOR'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, email, phone, isActive } = req.body;

    // 자기 자신의 역할은 변경 불가
    if (req.admin?.id === id && role && role !== req.admin.role) {
      return res.status(400).json({ message: '자신의 역할은 변경할 수 없습니다.' });
    }

    if (role) {
      const validRoles = ['DIRECTOR', 'NURSE', 'SOCIAL_WORKER'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: '유효하지 않은 역할입니다.' });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (isActive !== undefined) updateData.isActive = isActive;

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        email: true,
        phone: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.json(admin);
  } catch (error) {
    console.error('관리자 수정 오류:', error);
    res.status(500).json({ message: '관리자 정보 수정에 실패했습니다.' });
  }
});

// PATCH /:id/reset-password - 비밀번호 초기화
router.patch('/:id/reset-password', authenticate, requireRole('DIRECTOR'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: '새 비밀번호를 입력해주세요.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.json({ message: '비밀번호가 초기화되었습니다.' });
  } catch (error) {
    console.error('비밀번호 초기화 오류:', error);
    res.status(500).json({ message: '비밀번호 초기화에 실패했습니다.' });
  }
});

// DELETE /:id - 관리자 비활성화 (소프트 삭제)
router.delete('/:id', authenticate, requireRole('DIRECTOR'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // 자기 자신은 삭제 불가
    if (req.admin?.id === id) {
      return res.status(400).json({ message: '자기 자신의 계정은 비활성화할 수 없습니다.' });
    }

    await prisma.admin.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: '계정이 비활성화되었습니다.' });
  } catch (error) {
    console.error('관리자 비활성화 오류:', error);
    res.status(500).json({ message: '계정 비활성화에 실패했습니다.' });
  }
});

export default router;
