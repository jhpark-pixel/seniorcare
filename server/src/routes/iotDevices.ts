import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// IoT 기기 목록
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const devices = await prisma.iotDevice.findMany({
      include: {
        resident: { select: { id: true, name: true, roomNumber: true } },
        fallEvents: {
          where: { status: 'UNHANDLED' },
          orderBy: { occurredAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { installedAt: 'desc' },
    });
    return res.json(devices);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// IoT 기기 등록
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { deviceCode, residentId, location } = req.body;
    const device = await prisma.iotDevice.create({
      data: { deviceCode, residentId, location, lastCommunicated: new Date() },
    });
    return res.status(201).json(device);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// IoT 기기 상태 업데이트 (기기에서 주기적으로 호출)
router.put('/:id/heartbeat', async (req: any, res: Response) => {
  try {
    const { batteryLevel } = req.body;
    let status = 'NORMAL';
    if (batteryLevel !== undefined) {
      if (batteryLevel <= 10) status = 'DISCONNECTED';
      else if (batteryLevel <= 20) status = 'LOW_BATTERY';
    }

    const device = await prisma.iotDevice.update({
      where: { id: req.params.id },
      data: { batteryLevel, lastCommunicated: new Date(), status },
    });
    return res.json(device);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// IoT 기기 수정
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const device = await prisma.iotDevice.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return res.json(device);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// IoT 기기 삭제
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.iotDevice.delete({ where: { id: req.params.id } });
    return res.json({ message: '삭제되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
