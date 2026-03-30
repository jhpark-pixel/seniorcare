import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { calculateHealthScore, getHealthStatus } from '../services/healthScore';

const router = Router();
const prisma = new PrismaClient();

// 대시보드 통계
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalResidents,
      activeResidents,
      hospitalized,
      unhandledFalls,
      unreadFalls,
      lowBatteryDevices,
      totalPrograms,
      activePrograms,
    ] = await Promise.all([
      prisma.resident.count(),
      prisma.resident.count({ where: { status: 'ACTIVE' } }),
      prisma.resident.count({ where: { status: 'HOSPITALIZED' } }),
      prisma.fallEvent.count({ where: { status: 'UNHANDLED' } }),
      prisma.fallEvent.count({ where: { isRead: false } }),
      prisma.iotDevice.count({ where: { status: { in: ['LOW_BATTERY', 'DISCONNECTED'] } } }),
      prisma.program.count(),
      prisma.program.count({ where: { status: 'ONGOING' } }),
    ]);

    return res.json({
      residents: { total: totalResidents, active: activeResidents, hospitalized },
      falls: { unhandled: unhandledFalls, unread: unreadFalls },
      devices: { lowBattery: lowBatteryDevices },
      programs: { total: totalPrograms, active: activePrograms },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 건강 위험 입주자 목록
router.get('/health-alerts', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const residents = await prisma.resident.findMany({
      where: { status: 'ACTIVE' },
      include: {
        healthRecords: { orderBy: { recordedAt: 'desc' }, take: 3 },
      },
    });

    const alerts = residents
      .map(r => {
        const score = calculateHealthScore(r.healthRecords);
        const latest = r.healthRecords[0];
        const issues: string[] = [];

        if (latest) {
          if (latest.systolicBP && latest.systolicBP > 160) issues.push(`고혈압 위험 (${latest.systolicBP}/${latest.diastolicBP})`);
          if (latest.bloodSugarFasting && latest.bloodSugarFasting > 200) issues.push(`혈당 위험 (${latest.bloodSugarFasting}mg/dL)`);
          if (latest.bloodSugarFasting && latest.bloodSugarFasting < 70) issues.push(`저혈당 위험 (${latest.bloodSugarFasting}mg/dL)`);
          if (latest.temperature && latest.temperature > 37.5) issues.push(`발열 (${latest.temperature}°C)`);
          if (latest.moodScore && latest.moodScore <= 2) issues.push(`기분 저하 (${latest.moodScore}점)`);
        }

        return {
          id: r.id,
          name: r.name,
          roomNumber: r.roomNumber,
          healthScore: score,
          healthStatus: getHealthStatus(score),
          issues,
          lastRecordedAt: latest?.recordedAt,
        };
      })
      .filter(r => r.healthScore < 70 || r.issues.length > 0)
      .sort((a, b) => a.healthScore - b.healthScore);

    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 최근 낙상 이벤트
router.get('/recent-falls', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const falls = await prisma.fallEvent.findMany({
      orderBy: { occurredAt: 'desc' },
      take: 10,
      include: {
        resident: { select: { id: true, name: true, roomNumber: true } },
        device: { select: { deviceCode: true, location: true } },
        responses: true,
      },
    });
    return res.json(falls);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 월별 건강 통계
router.get('/monthly-stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);

      const [recordCount, fallCount] = await Promise.all([
        prisma.healthRecord.count({ where: { recordedAt: { gte: start, lte: end } } }),
        prisma.fallEvent.count({ where: { occurredAt: { gte: start, lte: end } } }),
      ]);

      months.push({
        month: `${year}-${String(month).padStart(2, '0')}`,
        label: `${month}월`,
        recordCount,
        fallCount,
      });
    }
    return res.json(months);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 프로그램 참여율
router.get('/program-stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      where: { status: 'ONGOING' },
      select: {
        id: true,
        name: true,
        category: true,
        capacity: true,
        enrolledCount: true,
      },
    });

    const categoryStats = programs.reduce((acc: any, p) => {
      const cat = p.category;
      if (!acc[cat]) acc[cat] = { count: 0, enrolled: 0 };
      acc[cat].count += 1;
      acc[cat].enrolled += p.enrolledCount;
      return acc;
    }, {});

    return res.json({ programs, categoryStats });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// IoT 기기 상태 현황
router.get('/device-status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const devices = await prisma.iotDevice.findMany({
      include: { resident: { select: { id: true, name: true, roomNumber: true } } },
    });

    const summary = {
      normal: devices.filter(d => d.status === 'NORMAL').length,
      lowBattery: devices.filter(d => d.status === 'LOW_BATTERY').length,
      disconnected: devices.filter(d => d.status === 'DISCONNECTED').length,
      total: devices.length,
    };

    return res.json({ devices, summary });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
