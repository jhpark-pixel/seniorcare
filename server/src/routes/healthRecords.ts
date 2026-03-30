import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateHealthScore, analyzeHealthTrend } from '../services/healthScore';

const router = Router();
const prisma = new PrismaClient();

// 건강 기록 목록 (입주자별)
router.get('/resident/:residentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { residentId } = req.params;
    const { days = '30' } = req.query;
    const daysNum = parseInt(days as string);
    const since = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000);

    const records = await prisma.healthRecord.findMany({
      where: {
        residentId,
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: 'desc' },
    });

    const trend = analyzeHealthTrend(records);
    const healthScore = calculateHealthScore(records);

    return res.json({ records, trend, healthScore });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 건강 기록 입력
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      residentId, recordedAt,
      systolicBP, diastolicBP, bloodSugarFasting, bloodSugarPostMeal,
      cholesterolTotal, cholesterolHDL, cholesterolLDL,
      heartRate, temperature, weight,
      sleepHours, waterIntake, mealAmount, bowelMovement, moodScore, notes,
    } = req.body;

    const record = await prisma.healthRecord.create({
      data: {
        residentId,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
        recordedBy: req.admin!.name,
        systolicBP, diastolicBP, bloodSugarFasting, bloodSugarPostMeal,
        cholesterolTotal, cholesterolHDL, cholesterolLDL,
        heartRate, temperature, weight,
        sleepHours, waterIntake, mealAmount, bowelMovement, moodScore, notes,
      },
    });

    // 이상 수치 감지
    const alerts: string[] = [];
    if (systolicBP && systolicBP > 160) alerts.push(`수축기 혈압 고위험: ${systolicBP}mmHg`);
    if (diastolicBP && diastolicBP > 100) alerts.push(`이완기 혈압 고위험: ${diastolicBP}mmHg`);
    if (bloodSugarFasting && bloodSugarFasting > 200) alerts.push(`공복 혈당 고위험: ${bloodSugarFasting}mg/dL`);
    if (bloodSugarFasting && bloodSugarFasting < 70) alerts.push(`저혈당 위험: ${bloodSugarFasting}mg/dL`);
    if (temperature && temperature > 37.5) alerts.push(`발열: ${temperature}°C`);

    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'HEALTH_RECORD_CREATE',
        targetType: 'HealthRecord',
        targetId: record.id,
        details: `건강 기록 입력 (입주자 ID: ${residentId})`,
      },
    });

    return res.status(201).json({ record, alerts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 건강 기록 수정
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const record = await prisma.healthRecord.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return res.json(record);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 건강 기록 삭제
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.healthRecord.delete({ where: { id: req.params.id } });
    return res.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 전체 입주자 최근 건강 데이터 요약
router.get('/summary/all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const residents = await prisma.resident.findMany({
      where: { status: 'ACTIVE' },
      include: {
        healthRecords: {
          orderBy: { recordedAt: 'desc' },
          take: 7,
        },
      },
    });

    const summary = residents.map(r => {
      const score = calculateHealthScore(r.healthRecords);
      const latest = r.healthRecords[0];
      return {
        id: r.id,
        name: r.name,
        roomNumber: r.roomNumber,
        healthScore: score,
        lastRecordedAt: latest?.recordedAt,
        systolicBP: latest?.systolicBP,
        diastolicBP: latest?.diastolicBP,
        bloodSugarFasting: latest?.bloodSugarFasting,
        heartRate: latest?.heartRate,
        temperature: latest?.temperature,
      };
    });

    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
