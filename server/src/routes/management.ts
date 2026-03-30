import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { calculateHealthScore } from '../services/healthScore';

const router = Router();
const prisma = new PrismaClient();

// 시설 운영 통합 통계 (시설장 전용)
router.get('/stats', authenticate, requireRole('DIRECTOR'), async (req: AuthRequest, res: Response) => {
  try {
    // 전체 입주자 조회
    const allResidents = await prisma.resident.findMany({
      include: {
        healthRecords: {
          orderBy: { recordedAt: 'desc' },
          take: 5,
        },
        programEnrollments: true,
      },
    });

    const activeResidents = allResidents.filter(r => r.status === 'ACTIVE');
    const totalResidents = allResidents.length;
    const activeCount = activeResidents.length;

    // 평균 건강 점수 계산
    let totalHealthScore = 0;
    let healthScoreCount = 0;
    for (const resident of activeResidents) {
      if (resident.healthRecords.length > 0) {
        totalHealthScore += calculateHealthScore(resident.healthRecords);
        healthScoreCount++;
      }
    }
    const averageHealthScore = healthScoreCount > 0
      ? Math.round(totalHealthScore / healthScoreCount)
      : 0;

    // 이번 달 낙상 사고 건수
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const fallEventsThisMonth = await prisma.fallEvent.count({
      where: {
        occurredAt: { gte: startOfMonth },
      },
    });

    // 프로그램 참여율 계산
    const totalEnrollments = await prisma.programEnrollment.count({
      where: { status: 'ACTIVE' },
    });
    const programParticipationRate = activeCount > 0
      ? Math.round((totalEnrollments / activeCount) * 100)
      : 0;

    // 입실률 (정원 50실 기준)
    const ROOM_CAPACITY = 50;
    const occupancyRate = Math.round((activeCount / ROOM_CAPACITY) * 100);

    // 평균 나이 계산
    const currentYear = now.getFullYear();
    let totalAge = 0;
    for (const resident of allResidents) {
      const birthYear = new Date(resident.birthDate).getFullYear();
      totalAge += currentYear - birthYear;
    }
    const averageAge = totalResidents > 0
      ? Math.round(totalAge / totalResidents)
      : 0;

    // === 월별 추이 (최근 6개월) ===
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);

      // 해당 월 입주자 수 (해당 월 이전 입소 + 퇴소 안 했거나 해당 월 이후 퇴소)
      const residentCount = await prisma.resident.count({
        where: {
          admissionDate: { lte: monthEnd },
          OR: [
            { status: { not: 'DISCHARGED' } },
            { updatedAt: { gte: monthStart } },
          ],
        },
      });

      // 해당 월 낙상 건수
      const fallCount = await prisma.fallEvent.count({
        where: {
          occurredAt: { gte: monthStart, lte: monthEnd },
        },
      });

      // 해당 월 신규 입소자
      const newAdmissions = await prisma.resident.count({
        where: {
          admissionDate: { gte: monthStart, lte: monthEnd },
        },
      });

      const monthLabel = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;
      monthlyTrends.push({
        month: monthLabel,
        residentCount,
        fallCount,
        newAdmissions,
      });
    }

    // === 입주자 상태 분류 ===
    // 상태별 분류
    const statusBreakdown: Record<string, number> = {};
    for (const r of allResidents) {
      statusBreakdown[r.status] = (statusBreakdown[r.status] || 0) + 1;
    }

    // 운동 능력별 분류
    const mobilityBreakdown: Record<string, number> = {};
    for (const r of allResidents) {
      const key = `레벨${r.mobilityLevel}`;
      mobilityBreakdown[key] = (mobilityBreakdown[key] || 0) + 1;
    }

    // 인지 능력별 분류
    const cognitiveBreakdown: Record<string, number> = {};
    for (const r of allResidents) {
      cognitiveBreakdown[r.cognitiveLevel] = (cognitiveBreakdown[r.cognitiveLevel] || 0) + 1;
    }

    // 성별 분류
    const genderBreakdown: Record<string, number> = {};
    for (const r of allResidents) {
      genderBreakdown[r.gender] = (genderBreakdown[r.gender] || 0) + 1;
    }

    // === 재무 데이터 (모의) ===
    const monthlyRevenue = activeCount * 3500000; // 입주자당 350만원
    const operatingCosts = Math.round(monthlyRevenue * 0.7);  // 운영비 70%
    const staffCosts = Math.round(monthlyRevenue * 0.2);       // 인건비 20%
    const profitMargin = monthlyRevenue > 0
      ? Math.round(((monthlyRevenue - operatingCosts - staffCosts) / monthlyRevenue) * 100)
      : 0;

    res.json({
      kpi: {
        totalResidents,
        activeCount,
        averageHealthScore,
        fallEventsThisMonth,
        programParticipationRate,
        occupancyRate,
        averageAge,
      },
      monthlyTrends,
      residentBreakdown: {
        byStatus: statusBreakdown,
        byMobility: mobilityBreakdown,
        byCognitive: cognitiveBreakdown,
        byGender: genderBreakdown,
      },
      financial: {
        monthlyRevenue,
        operatingCosts,
        staffCosts,
        profitMargin,
      },
    });
  } catch (error) {
    console.error('운영 통계 조회 오류:', error);
    res.status(500).json({ message: '운영 통계를 불러오는 중 오류가 발생했습니다.' });
  }
});

export default router;
