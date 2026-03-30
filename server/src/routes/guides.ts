import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { generateDietGuide, generateExerciseGuide, generateLifestyleGuide } from '../services/guideEngine';

const router = Router();
const prisma = new PrismaClient();

// 건강 가이드 생성
router.post('/generate/:residentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { residentId } = req.params;
    const { type } = req.body; // DIET, EXERCISE, LIFESTYLE, ALL

    const resident = await prisma.resident.findUnique({
      where: { id: residentId },
      include: {
        diseases: { include: { disease: true } },
        medications: { where: { isActive: true } },
        allergies: true,
        dietaryRestrictions: true,
        healthRecords: { orderBy: { recordedAt: 'desc' }, take: 7 },
      },
    });

    if (!resident) return res.status(404).json({ message: '입주자를 찾을 수 없습니다.' });

    const guides: any[] = [];
    const types = type === 'ALL' ? ['DIET', 'EXERCISE', 'LIFESTYLE'] : [type];

    for (const t of types) {
      let content: any;
      if (t === 'DIET') {
        content = generateDietGuide(resident as any);
      } else if (t === 'EXERCISE') {
        content = generateExerciseGuide(resident as any);
      } else if (t === 'LIFESTYLE') {
        content = generateLifestyleGuide(resident as any);
      }

      if (content) {
        const guide = await prisma.healthGuide.create({
          data: {
            residentId,
            type: t,
            content: JSON.stringify(content),
          },
        });
        guides.push({ ...guide, parsedContent: content });
      }
    }

    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'GUIDE_GENERATE',
        targetType: 'Resident',
        targetId: residentId,
        details: `건강 가이드 생성: ${types.join(', ')}`,
      },
    });

    return res.json(guides);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 건강 가이드 목록
router.get('/resident/:residentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const guides = await prisma.healthGuide.findMany({
      where: { residentId: req.params.residentId },
      orderBy: { generatedAt: 'desc' },
    });

    const parsed = guides.map(g => {
      try {
        return { ...g, parsedContent: JSON.parse(g.content) };
      } catch {
        return { ...g, parsedContent: null };
      }
    });

    return res.json(parsed);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 가이드 삭제
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.healthGuide.delete({ where: { id: req.params.id } });
    return res.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
