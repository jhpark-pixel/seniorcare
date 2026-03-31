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

// 우선순위 정렬 순서
const PRIORITY_ORDER: Record<string, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

// 추천 업무 항목 인터페이스
interface TaskRecommendation {
  id: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  relatedResidentId?: string;
  relatedResidentName?: string;
  roomNumber?: string;
  resolved: boolean;
}

// 오늘 날짜의 시작과 끝 계산 헬퍼
function getTodayRange(): { startOfDay: Date; endOfDay: Date } {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  return { startOfDay, endOfDay };
}

// ========================================
// 자동 추천 업무 생성 엔드포인트
// ========================================
router.get('/recommendations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { startOfDay, endOfDay } = getTodayRange();
    const recommendations: TaskRecommendation[] = [];

    // 오늘 이미 존재하는 완료된 업무 목록 조회 (중복 확인용)
    const existingTasks = await prisma.dailyTask.findMany({
      where: {
        dueDate: { gte: startOfDay, lte: endOfDay },
        status: 'COMPLETED',
      },
      select: { title: true },
    });
    const completedTitles = new Set(existingTasks.map((t) => t.title));

    // 활성 입주자 목록 조회
    const activeResidents = await prisma.resident.findMany({
      where: { status: 'ACTIVE' },
      include: {
        healthRecords: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
        medications: {
          where: { isActive: true },
        },
      },
    });

    // ----- 1. 건강체크 (HEALTH_CHECK) -----
    // 오늘 건강 기록이 없는 활성 입주자 찾기
    const residentsWithTodayRecords = await prisma.healthRecord.findMany({
      where: {
        recordedAt: { gte: startOfDay, lte: endOfDay },
        resident: { status: 'ACTIVE' },
      },
      select: { residentId: true },
    });
    const residentsWithRecordIds = new Set(residentsWithTodayRecords.map((r) => r.residentId));

    for (const resident of activeResidents) {
      if (!residentsWithRecordIds.has(resident.id)) {
        const title = `${resident.name}님 (${resident.roomNumber}호) 오늘 건강 체크 필요`;
        recommendations.push({
          id: crypto.randomUUID(),
          category: 'HEALTH_CHECK',
          priority: 'MEDIUM',
          title,
          description: `${resident.name}님의 오늘 건강 기록이 아직 등록되지 않았습니다. 체크가 필요합니다.`,
          relatedResidentId: resident.id,
          relatedResidentName: resident.name,
          roomNumber: resident.roomNumber,
          resolved: completedTitles.has(title),
        });
      }
    }

    // ----- 2. 투약 (MEDICATION) -----
    // 활성 약물이 있는 활성 입주자 그룹화
    for (const resident of activeResidents) {
      if (resident.medications.length > 0) {
        const medNames = resident.medications.map((m) => m.name).join(', ');
        const title = `${resident.name}님 (${resident.roomNumber}호) 투약 확인 - ${medNames}`;
        recommendations.push({
          id: crypto.randomUUID(),
          category: 'MEDICATION',
          priority: 'MEDIUM',
          title,
          description: `${resident.name}님의 활성 약물 ${resident.medications.length}건에 대한 투약 확인이 필요합니다.`,
          relatedResidentId: resident.id,
          relatedResidentName: resident.name,
          roomNumber: resident.roomNumber,
          resolved: completedTitles.has(title),
        });
      }
    }

    // ----- 3. 안전점검 (SAFETY) -----
    // 배터리 부족 또는 연결 끊김 상태의 IoT 기기 찾기
    const problematicDevices = await prisma.iotDevice.findMany({
      where: {
        status: { in: ['LOW_BATTERY', 'DISCONNECTED'] },
      },
    });

    for (const device of problematicDevices) {
      const statusText = device.status === 'LOW_BATTERY' ? '배터리 부족' : '연결 끊김';
      const title = `IoT 기기 점검 필요: ${device.deviceCode} (${device.location}) - ${statusText}`;
      recommendations.push({
        id: crypto.randomUUID(),
        category: 'SAFETY',
        priority: 'MEDIUM',
        title,
        description: `IoT 기기 "${device.deviceCode}"의 상태가 "${statusText}"입니다. 점검이 필요합니다.`,
        resolved: completedTitles.has(title),
      });
    }

    // ----- 4. 낙상 대응 (FALL_RESPONSE) -----
    // 미처리 낙상 이벤트 찾기 (DETECTED 또는 ALERTED 상태)
    const unresolvedFallEvents = await prisma.fallEvent.findMany({
      where: {
        status: { in: ['DETECTED', 'ALERTED'] },
      },
      include: {
        resident: {
          select: { id: true, name: true, roomNumber: true },
        },
      },
    });

    for (const event of unresolvedFallEvents) {
      const title = `${event.resident.name}님 (${event.resident.roomNumber}호) 낙상 이벤트 미처리 - 심각도: ${event.severity}`;
      recommendations.push({
        id: crypto.randomUUID(),
        category: 'FALL_RESPONSE',
        priority: 'HIGH',
        title,
        description: `${event.resident.name}님에게 미처리된 낙상 이벤트가 있습니다. 즉시 확인이 필요합니다.`,
        relatedResidentId: event.resident.id,
        relatedResidentName: event.resident.name,
        roomNumber: event.resident.roomNumber,
        resolved: completedTitles.has(title),
      });
    }

    // ----- 5. 프로그램 (ACTIVITY) -----
    // 진행 중인 프로그램 찾기
    const ongoingPrograms = await prisma.program.findMany({
      where: { status: 'ONGOING' },
    });

    for (const program of ongoingPrograms) {
      const title = `${program.name} 프로그램 진행 확인`;
      recommendations.push({
        id: crypto.randomUUID(),
        category: 'ACTIVITY',
        priority: 'LOW',
        title,
        description: `"${program.name}" 프로그램이 현재 진행 중입니다. 진행 상황을 확인해 주세요.`,
        resolved: completedTitles.has(title),
      });
    }

    // ----- 6. 건강 이상 (HEALTH_ALERT) -----
    // 각 활성 입주자의 최근 건강 기록 분석
    for (const resident of activeResidents) {
      if (resident.healthRecords.length === 0) continue;
      const latest = resident.healthRecords[0];
      const abnormalities: string[] = [];

      // 혈압 이상 확인
      if (latest.systolicBP !== null && latest.systolicBP !== undefined) {
        if (latest.systolicBP > 140) {
          abnormalities.push(`수축기 혈압 높음 (${latest.systolicBP}mmHg)`);
        } else if (latest.systolicBP < 90) {
          abnormalities.push(`수축기 혈압 낮음 (${latest.systolicBP}mmHg)`);
        }
      }

      // 공복 혈당 이상 확인
      if (latest.bloodSugarFasting !== null && latest.bloodSugarFasting !== undefined) {
        if (latest.bloodSugarFasting > 126) {
          abnormalities.push(`공복 혈당 높음 (${latest.bloodSugarFasting}mg/dL)`);
        } else if (latest.bloodSugarFasting < 70) {
          abnormalities.push(`공복 혈당 낮음 (${latest.bloodSugarFasting}mg/dL)`);
        }
      }

      // 체온 이상 확인
      if (latest.temperature !== null && latest.temperature !== undefined) {
        if (latest.temperature > 37.5) {
          abnormalities.push(`체온 높음 (${latest.temperature}°C)`);
        }
      }

      if (abnormalities.length > 0) {
        const abnormalityDesc = abnormalities.join(', ');
        const title = `${resident.name}님 (${resident.roomNumber}호) 건강 이상 감지 - ${abnormalityDesc}`;
        recommendations.push({
          id: crypto.randomUUID(),
          category: 'HEALTH_ALERT',
          priority: 'HIGH',
          title,
          description: `${resident.name}님의 최근 건강 기록에서 이상 수치가 감지되었습니다: ${abnormalityDesc}. 확인이 필요합니다.`,
          relatedResidentId: resident.id,
          relatedResidentName: resident.name,
          roomNumber: resident.roomNumber,
          resolved: completedTitles.has(title),
        });
      }
    }

    // 우선순위 순으로 정렬 (HIGH → MEDIUM → LOW)
    recommendations.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

    res.json(recommendations);
  } catch (error) {
    console.error('추천 업무 생성 오류:', error);
    res.status(500).json({ message: '추천 업무를 생성하는 중 오류가 발생했습니다.' });
  }
});

// ========================================
// 기존 CRUD 엔드포인트
// ========================================

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
