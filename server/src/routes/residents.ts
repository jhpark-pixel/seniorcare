import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateHealthScore, getHealthStatus } from '../services/healthScore';

const router = Router();
const prisma = new PrismaClient();

// 전체 입주자 목록
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { roomNumber: { contains: search as string } },
      ];
    }

    const [residents, total] = await Promise.all([
      prisma.resident.findMany({
        where,
        include: {
          diseases: { include: { disease: true } },
          medications: { where: { isActive: true } },
          healthRecords: { orderBy: { recordedAt: 'desc' }, take: 1 },
          fallEvents: { where: { status: 'UNHANDLED' } },
          iotDevices: true,
        },
        orderBy: { roomNumber: 'asc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.resident.count({ where }),
    ]);

    const enriched = residents.map(r => ({
      ...r,
      healthScore: calculateHealthScore(r.healthRecords),
      healthStatus: getHealthStatus(calculateHealthScore(r.healthRecords)),
      unhandledFallCount: r.fallEvents.length,
    }));

    return res.json({ data: enriched, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 입주자 상세 조회
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const resident = await prisma.resident.findUnique({
      where: { id: req.params.id },
      include: {
        emergencyContacts: true,
        diseases: { include: { disease: true } },
        medications: true,
        allergies: true,
        dietaryRestrictions: true,
        healthRecords: { orderBy: { recordedAt: 'desc' }, take: 30 },
        fallEvents: {
          include: { responses: true, device: true },
          orderBy: { occurredAt: 'desc' },
        },
        iotDevices: true,
        programEnrollments: {
          include: { program: true },
          where: { status: 'ACTIVE' },
        },
        healthGuides: { orderBy: { generatedAt: 'desc' } },
      },
    });

    if (!resident) return res.status(404).json({ message: '입주자를 찾을 수 없습니다.' });

    const healthScore = calculateHealthScore(resident.healthRecords);
    const healthStatus = getHealthStatus(healthScore);

    return res.json({ ...resident, healthScore, healthStatus });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 입주자 등록
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name, birthDate, gender, roomNumber, admissionDate,
      height, weight, mobilityLevel, cognitiveLevel,
      emergencyContacts, diseases, medications, allergies, dietaryRestrictions,
    } = req.body;

    const resident = await prisma.resident.create({
      data: {
        name, birthDate: new Date(birthDate), gender, roomNumber,
        admissionDate: new Date(admissionDate), height, weight,
        mobilityLevel: mobilityLevel || 1, cognitiveLevel: cognitiveLevel || 'NORMAL',
        emergencyContacts: emergencyContacts ? { create: emergencyContacts } : undefined,
        allergies: allergies ? { create: allergies } : undefined,
        dietaryRestrictions: dietaryRestrictions ? { create: dietaryRestrictions } : undefined,
      },
    });

    if (diseases && diseases.length > 0) {
      for (const d of diseases) {
        let disease = await prisma.disease.findUnique({ where: { name: d.name } });
        if (!disease) {
          disease = await prisma.disease.create({ data: { name: d.name, code: d.code } });
        }
        await prisma.residentDisease.create({
          data: {
            residentId: resident.id,
            diseaseId: disease.id,
            diagnosedAt: d.diagnosedAt ? new Date(d.diagnosedAt) : undefined,
            notes: d.notes,
          },
        });
      }
    }

    if (medications && medications.length > 0) {
      await prisma.medication.createMany({
        data: medications.map((m: any) => ({ ...m, residentId: resident.id })),
      });
    }

    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'RESIDENT_CREATE',
        targetType: 'Resident',
        targetId: resident.id,
        details: `${name} 입주자 등록`,
      },
    });

    return res.status(201).json(resident);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 입주자 수정
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name, birthDate, gender, roomNumber, admissionDate, status,
      height, weight, mobilityLevel, cognitiveLevel,
    } = req.body;

    const resident = await prisma.resident.update({
      where: { id },
      data: {
        name, birthDate: birthDate ? new Date(birthDate) : undefined,
        gender, roomNumber, admissionDate: admissionDate ? new Date(admissionDate) : undefined,
        status, height, weight, mobilityLevel, cognitiveLevel,
      },
    });

    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'RESIDENT_UPDATE',
        targetType: 'Resident',
        targetId: id,
        details: `${name} 입주자 정보 수정`,
      },
    });

    return res.json(resident);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 입주자 질병 추가
router.post('/:id/diseases', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, diagnosedAt, notes } = req.body;
    let disease = await prisma.disease.findUnique({ where: { name } });
    if (!disease) {
      disease = await prisma.disease.create({ data: { name, code } });
    }

    const residentDisease = await prisma.residentDisease.create({
      data: {
        residentId: req.params.id,
        diseaseId: disease.id,
        diagnosedAt: diagnosedAt ? new Date(diagnosedAt) : undefined,
        notes,
      },
      include: { disease: true },
    });

    return res.status(201).json(residentDisease);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 입주자 질병 삭제
router.delete('/:id/diseases/:diseaseId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.residentDisease.delete({
      where: { id: req.params.diseaseId },
    });
    return res.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 약물 추가
router.post('/:id/medications', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const med = await prisma.medication.create({
      data: { ...req.body, residentId: req.params.id },
    });
    return res.status(201).json(med);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 약물 수정
router.put('/:id/medications/:medId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const med = await prisma.medication.update({
      where: { id: req.params.medId },
      data: req.body,
    });
    return res.json(med);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 통계용 요약
router.get('/stats/summary', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const [total, active, out, hospitalized] = await Promise.all([
      prisma.resident.count(),
      prisma.resident.count({ where: { status: 'ACTIVE' } }),
      prisma.resident.count({ where: { status: 'OUT' } }),
      prisma.resident.count({ where: { status: 'HOSPITALIZED' } }),
    ]);
    return res.json({ total, active, out, hospitalized });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
