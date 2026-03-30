import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Server } from 'socket.io';

const router = Router();
const prisma = new PrismaClient();

let ioInstance: Server;
export function setSocketIO(io: Server) {
  ioInstance = io;
}

// 낙상 이벤트 목록
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status, severity, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const [events, total] = await Promise.all([
      prisma.fallEvent.findMany({
        where,
        include: {
          resident: { select: { id: true, name: true, roomNumber: true } },
          device: true,
          responses: true,
        },
        orderBy: { occurredAt: 'desc' },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.fallEvent.count({ where }),
    ]);

    return res.json({ data: events, total });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 미처리 낙상 이벤트 수
router.get('/unhandled/count', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const count = await prisma.fallEvent.count({ where: { status: 'UNHANDLED' } });
    const unread = await prisma.fallEvent.count({ where: { isRead: false } });
    return res.json({ count, unread });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 낙상 이벤트 생성 (IoT 기기에서 호출)
router.post('/', async (req: any, res: Response) => {
  try {
    const { residentId, deviceId, location, severity, sensorData } = req.body;

    const fallEvent = await prisma.fallEvent.create({
      data: {
        residentId,
        deviceId,
        location,
        severity: severity || 'WARNING',
        sensorData: sensorData ? JSON.stringify(sensorData) : undefined,
        status: 'UNHANDLED',
        isRead: false,
      },
      include: {
        resident: { select: { id: true, name: true, roomNumber: true } },
        device: true,
      },
    });

    // 실시간 알림 전송
    if (ioInstance) {
      ioInstance.emit('fallEvent', {
        type: 'FALL_DETECTED',
        event: fallEvent,
        message: `${fallEvent.resident.name}(${fallEvent.resident.roomNumber}) 낙상 감지!`,
      });
    }

    return res.status(201).json(fallEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 낙상 이벤트 읽음 처리
router.put('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.fallEvent.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    return res.json({ message: '읽음 처리되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 전체 읽음 처리
router.put('/read/all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.fallEvent.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    return res.json({ message: '전체 읽음 처리되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 낙상 처리 응답 추가
router.post('/:id/responses', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { content, outcome } = req.body;

    const response = await prisma.fallResponse.create({
      data: {
        fallEventId: req.params.id,
        respondedBy: req.admin!.name,
        content,
        outcome,
      },
    });

    await prisma.fallEvent.update({
      where: { id: req.params.id },
      data: { status: 'RESOLVED', isRead: true },
    });

    if (ioInstance) {
      ioInstance.emit('fallEventUpdated', {
        eventId: req.params.id,
        status: 'RESOLVED',
      });
    }

    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'FALL_RESPONSE',
        targetType: 'FallEvent',
        targetId: req.params.id,
        details: `낙상 사고 처리: ${outcome}`,
      },
    });

    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 낙상 상태 변경
router.put('/:id/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const event = await prisma.fallEvent.update({
      where: { id: req.params.id },
      data: { status },
    });

    if (ioInstance) {
      ioInstance.emit('fallEventUpdated', { eventId: req.params.id, status });
    }

    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
