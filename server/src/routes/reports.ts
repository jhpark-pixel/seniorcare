import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

const router = Router();
const prisma = new PrismaClient();
const FONT_PATH = path.join(__dirname, '../../fonts/malgun.ttf');
const FONT_BOLD_PATH = path.join(__dirname, '../../fonts/malgunbd.ttf');

// 입주자 건강 리포트 생성 (PDF)
router.get('/health/:residentId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const resident = await prisma.resident.findUnique({
      where: { id: req.params.residentId },
      include: {
        diseases: { include: { disease: true } },
        medications: { where: { isActive: true } },
        allergies: true,
        healthRecords: { orderBy: { recordedAt: 'desc' }, take: 30 },
        emergencyContacts: true,
      },
    });

    if (!resident) return res.status(404).json({ message: '입주자를 찾을 수 없습니다.' });

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.registerFont('Korean', FONT_PATH);
    doc.registerFont('KoreanBold', FONT_BOLD_PATH);
    doc.font('Korean');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=health-report-${resident.id}.pdf`);
    doc.pipe(res);

    // 헤더
    doc.font('KoreanBold').fontSize(20).text('시니어 케어 - 건강 리포트', { align: 'center' });
    doc.font('Korean').fontSize(12).text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // 기본 정보
    doc.font('KoreanBold').fontSize(16).text('기본 정보', { underline: true });
    doc.moveDown(0.5);
    doc.font('Korean').fontSize(11);
    doc.text(`이름: ${resident.name}`);
    doc.text(`생년월일: ${new Date(resident.birthDate).toLocaleDateString('ko-KR')}`);
    doc.text(`성별: ${resident.gender === 'MALE' ? '남' : '여'}`);
    doc.text(`호실: ${resident.roomNumber}`);
    doc.text(`입소일: ${new Date(resident.admissionDate).toLocaleDateString('ko-KR')}`);
    doc.text(`이동 능력: ${resident.mobilityLevel}등급`);
    doc.text(`인지 수준: ${resident.cognitiveLevel}`);
    doc.moveDown();

    // 질병 정보
    doc.font('KoreanBold').fontSize(16).text('보유 질환', { underline: true });
    doc.moveDown(0.5);
    doc.font('Korean').fontSize(11);
    if (resident.diseases.length > 0) {
      resident.diseases.forEach(d => {
        doc.text(`• ${d.disease.name}${d.notes ? ` - ${d.notes}` : ''}`);
      });
    } else {
      doc.text('없음');
    }
    doc.moveDown();

    // 복용 약물
    doc.font('KoreanBold').fontSize(16).text('복용 약물', { underline: true });
    doc.moveDown(0.5);
    doc.font('Korean').fontSize(11);
    if (resident.medications.length > 0) {
      resident.medications.forEach(m => {
        doc.text(`• ${m.name} ${m.dosage} - ${m.schedule}`);
      });
    } else {
      doc.text('없음');
    }
    doc.moveDown();

    // 최근 활력징후
    const latest = resident.healthRecords[0];
    if (latest) {
      doc.font('KoreanBold').fontSize(16).text('최근 건강 지표', { underline: true });
      doc.moveDown(0.5);
      doc.font('Korean').fontSize(11);
      doc.text(`측정일: ${new Date(latest.recordedAt).toLocaleDateString('ko-KR')}`);
      if (latest.systolicBP) doc.text(`혈압: ${latest.systolicBP}/${latest.diastolicBP} mmHg`);
      if (latest.heartRate) doc.text(`심박수: ${latest.heartRate} bpm`);
      if (latest.temperature) doc.text(`체온: ${latest.temperature}°C`);
      if (latest.bloodSugarFasting) doc.text(`공복 혈당: ${latest.bloodSugarFasting} mg/dL`);
      if (latest.weight) doc.text(`체중: ${latest.weight} kg`);
      doc.moveDown();
    }

    // 비상 연락처
    doc.font('KoreanBold').fontSize(16).text('비상 연락처', { underline: true });
    doc.moveDown(0.5);
    doc.font('Korean').fontSize(11);
    resident.emergencyContacts.forEach(c => {
      doc.text(`• ${c.name} (${c.relationship}): ${c.phone}${c.isPrimary ? ' [주 보호자]' : ''}`);
    });

    doc.end();

    await prisma.activityLog.create({
      data: {
        adminId: req.admin!.id,
        action: 'REPORT_GENERATE',
        targetType: 'Resident',
        targetId: req.params.residentId,
        details: `${resident.name} 건강 리포트 생성`,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 시설 전체 현황 리포트
router.get('/facility', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const [residents, programs, falls, devices] = await Promise.all([
      prisma.resident.findMany({
        include: { diseases: { include: { disease: true } } },
      }),
      prisma.program.findMany({
        include: { enrollments: true },
      }),
      prisma.fallEvent.findMany({
        orderBy: { occurredAt: 'desc' },
        take: 20,
        include: { resident: { select: { name: true, roomNumber: true } } },
      }),
      prisma.iotDevice.findMany(),
    ]);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.registerFont('Korean', FONT_PATH);
    doc.registerFont('KoreanBold', FONT_BOLD_PATH);
    doc.font('Korean');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=facility-report-${new Date().toISOString().split('T')[0]}.pdf`);
    doc.pipe(res);

    doc.font('KoreanBold').fontSize(20).text('시니어 케어 - 시설 현황 리포트', { align: 'center' });
    doc.font('Korean').fontSize(12).text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown();

    // 입주자 현황
    doc.font('KoreanBold').fontSize(16).text('입주자 현황', { underline: true });
    doc.moveDown(0.5);
    doc.font('Korean').fontSize(11);
    const activeCount = residents.filter(r => r.status === 'ACTIVE').length;
    const hospitalCount = residents.filter(r => r.status === 'HOSPITALIZED').length;
    doc.text(`총 입주자: ${residents.length}명`);
    doc.text(`재실: ${activeCount}명`);
    doc.text(`입원: ${hospitalCount}명`);
    doc.moveDown();

    // 낙상 현황
    doc.font('KoreanBold').fontSize(16).text('낙상 이벤트 현황 (최근 20건)', { underline: true });
    doc.moveDown(0.5);
    doc.font('Korean').fontSize(11);
    const unresolvedFalls = falls.filter(f => f.status === 'UNHANDLED').length;
    doc.text(`미처리 낙상: ${unresolvedFalls}건`);
    doc.text(`처리 완료: ${falls.filter(f => f.status === 'RESOLVED').length}건`);
    doc.moveDown();

    falls.slice(0, 10).forEach(f => {
      doc.text(`• ${new Date(f.occurredAt).toLocaleDateString('ko-KR')} - ${f.resident.name}(${f.resident.roomNumber}) - ${f.severity} - ${f.status}`);
    });
    doc.moveDown();

    // 프로그램 현황
    doc.font('KoreanBold').fontSize(16).text('프로그램 현황', { underline: true });
    doc.moveDown(0.5);
    doc.font('Korean').fontSize(11);
    doc.text(`운영 중 프로그램: ${programs.filter(p => p.status === 'ONGOING').length}개`);
    programs.forEach(p => {
      doc.text(`• ${p.name} (${p.category}): ${p.enrolledCount}/${p.capacity || '무제한'}명`);
    });
    doc.moveDown();

    // IoT 기기 현황
    doc.font('KoreanBold').fontSize(16).text('IoT 기기 현황', { underline: true });
    doc.moveDown(0.5);
    doc.font('Korean').fontSize(11);
    doc.text(`정상: ${devices.filter(d => d.status === 'NORMAL').length}대`);
    doc.text(`배터리 부족: ${devices.filter(d => d.status === 'LOW_BATTERY').length}대`);
    doc.text(`연결 끊김: ${devices.filter(d => d.status === 'DISCONNECTED').length}대`);

    doc.end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

export default router;
