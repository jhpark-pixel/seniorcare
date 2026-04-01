// Seed runner that runs from server directory so @prisma/client resolves correctly
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('케어닥 케어홈 송추점 시드 데이터 생성 시작...');

  const hashedPassword = await bcrypt.hash('caredoc2024!', 10);

  const director = await prisma.admin.upsert({
    where: { username: 'director' },
    update: {},
    create: { username: 'director', password: hashedPassword, name: '박준혁', role: 'DIRECTOR', email: 'director@caredochome.co.kr', phone: '031-431-7700' },
  });

  const nurseKim = await prisma.admin.upsert({
    where: { username: 'nurse_kim' },
    update: {},
    create: { username: 'nurse_kim', password: hashedPassword, name: '김서연', role: 'NURSE', email: 'nurse.kim@caredochome.co.kr', phone: '031-431-7701' },
  });

  const nurseLee = await prisma.admin.upsert({
    where: { username: 'nurse_lee' },
    update: {},
    create: { username: 'nurse_lee', password: hashedPassword, name: '이하은', role: 'NURSE', email: 'nurse.lee@caredochome.co.kr', phone: '031-431-7702' },
  });

  const socialChoi = await prisma.admin.upsert({
    where: { username: 'social_choi' },
    update: {},
    create: { username: 'social_choi', password: hashedPassword, name: '최민정', role: 'SOCIAL_WORKER', email: 'social.choi@caredochome.co.kr', phone: '031-431-7703' },
  });

  const socialPark = await prisma.admin.upsert({
    where: { username: 'social_park' },
    update: {},
    create: { username: 'social_park', password: hashedPassword, name: '박은지', role: 'SOCIAL_WORKER', email: 'social.park@caredochome.co.kr', phone: '031-431-7704' },
  });

  console.log('관리자 생성 완료');

  const diseases = await Promise.all([
    prisma.disease.upsert({ where: { name: '고혈압' }, update: {}, create: { name: '고혈압', code: 'I10' } }),         // [0]
    prisma.disease.upsert({ where: { name: '당뇨병' }, update: {}, create: { name: '당뇨병', code: 'E11' } }),         // [1]
    prisma.disease.upsert({ where: { name: '심부전' }, update: {}, create: { name: '심부전', code: 'I50' } }),         // [2]
    prisma.disease.upsert({ where: { name: '치매' }, update: {}, create: { name: '치매', code: 'F03' } }),             // [3]
    prisma.disease.upsert({ where: { name: '골다공증' }, update: {}, create: { name: '골다공증', code: 'M81' } }),     // [4]
    prisma.disease.upsert({ where: { name: '관절염' }, update: {}, create: { name: '관절염', code: 'M19' } }),         // [5]
    prisma.disease.upsert({ where: { name: '뇌졸중' }, update: {}, create: { name: '뇌졸중', code: 'I64' } }),         // [6]
    prisma.disease.upsert({ where: { name: '파킨슨병' }, update: {}, create: { name: '파킨슨병', code: 'G20' } }),     // [7]
    prisma.disease.upsert({ where: { name: '만성폐쇄성폐질환' }, update: {}, create: { name: '만성폐쇄성폐질환', code: 'J44' } }), // [8]
    prisma.disease.upsert({ where: { name: '우울증' }, update: {}, create: { name: '우울증', code: 'F32' } }),         // [9]
  ]);

  console.log('질병 데이터 생성 완료');

  // #1 강정순 - 94세 여성, 301호 특실, 등급외
  const resident1 = await prisma.resident.create({
    data: {
      name: '강정순', birthDate: new Date('1931-10-20'), gender: 'FEMALE', roomNumber: '301',
      moveInDate: new Date('2024-01-31'), status: 'ACTIVE', height: 148, weight: 44,
      mobilityLevel: 4, cognitiveLevel: 'SEVERE',
      emergencyContacts: { create: [{ name: '강민준', relationship: '아들', phone: '010-2341-5678', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '중증 연하곤란, 미음식 필요' }, { type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident1.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2018-03-10'), notes: '중증 치매' },
    { residentId: resident1.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2015-06-20'), notes: '고혈압 관리 중' },
    { residentId: resident1.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2016-09-05'), notes: '골다공증 치료 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident1.id, name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
    { residentId: resident1.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident1.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #2 강한석 - 89세 남성, 405호 1인실, 등급외
  const resident2 = await prisma.resident.create({
    data: {
      name: '강한석', birthDate: new Date('1936-06-22'), gender: 'MALE', roomNumber: '405',
      moveInDate: new Date('2023-12-10'), status: 'ACTIVE', height: 165, weight: 60,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE',
      emergencyContacts: { create: [{ name: '강선희', relationship: '딸', phone: '010-3452-6789', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident2.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2020-07-15'), notes: '중등도 치매' },
    { residentId: resident2.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2016-02-10'), notes: '고혈압 관리 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident2.id, name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
    { residentId: resident2.id, name: '발사르탄', dosage: '80mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  // #3 구자윤 - 92세 남성, 309호 2인실, 등급외
  const resident3 = await prisma.resident.create({
    data: {
      name: '구자윤', birthDate: new Date('1934-02-01'), gender: 'MALE', roomNumber: '309',
      moveInDate: new Date('2024-02-24'), status: 'ACTIVE', height: 163, weight: 58,
      mobilityLevel: 4, cognitiveLevel: 'SEVERE',
      emergencyContacts: { create: [{ name: '구본철', relationship: '아들', phone: '010-4563-7890', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '중증 연하곤란, 미음식 필요' }, { type: 'LOW_SALT', notes: '심부전 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident3.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2017-05-20'), notes: '중증 치매' },
    { residentId: resident3.id, diseaseId: diseases[2].id, diagnosedAt: new Date('2019-03-10'), notes: '심부전 관리 중' },
    { residentId: resident3.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2018-11-05'), notes: '골다공증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident3.id, name: '리바스티그민', dosage: '6mg', schedule: '아침,저녁', prescribedBy: '신경과', isActive: true },
    { residentId: resident3.id, name: '푸로세미드', dosage: '40mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
    { residentId: resident3.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #4 김복자 - 81세 여성, 305호 1인실, 등급외
  const resident4 = await prisma.resident.create({
    data: {
      name: '김복자', birthDate: new Date('1944-10-30'), gender: 'FEMALE', roomNumber: '305',
      moveInDate: new Date('2025-11-16'), status: 'ACTIVE', height: 153, weight: 52,
      mobilityLevel: 2, cognitiveLevel: 'MILD',
      emergencyContacts: { create: [{ name: '이정호', relationship: '아들', phone: '010-5674-8901', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident4.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2015-04-10'), notes: '고혈압 복약 중' },
    { residentId: resident4.id, diseaseId: diseases[5].id, diagnosedAt: new Date('2018-07-20'), notes: '무릎 관절염' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident4.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident4.id, name: '셀레콕시브', dosage: '200mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
  ]});

  // #5 김옥희 - 87세 여성, 406호 1인실, 등급외
  const resident5 = await prisma.resident.create({
    data: {
      name: '김옥희', birthDate: new Date('1938-03-28'), gender: 'FEMALE', roomNumber: '406',
      moveInDate: new Date('2024-01-19'), status: 'ACTIVE', height: 151, weight: 47,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE',
      emergencyContacts: { create: [{ name: '박성훈', relationship: '아들', phone: '010-6785-9012', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident5.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2021-02-15'), notes: '중등도 치매' },
    { residentId: resident5.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2019-09-10'), notes: '골다공증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident5.id, name: '도네페질', dosage: '5mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
    { residentId: resident5.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #6 박복순 - 99세 여성, 202호 1인실, 등급외 (퇴소)
  const resident6 = await prisma.resident.create({
    data: {
      name: '박복순', birthDate: new Date('1926-09-17'), gender: 'FEMALE', roomNumber: '202',
      moveInDate: new Date('2024-07-20'), status: 'DISCHARGED', height: 143, weight: 38,
      mobilityLevel: 4, cognitiveLevel: 'SEVERE',
      emergencyContacts: { create: [{ name: '박영수', relationship: '아들', phone: '010-7896-0123', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '중증 연하곤란, 미음식 필요' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident6.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2015-01-10'), notes: '중증 치매' },
    { residentId: resident6.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2010-06-20'), notes: '고혈압' },
    { residentId: resident6.id, diseaseId: diseases[2].id, diagnosedAt: new Date('2020-08-15'), notes: '심부전 관리 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident6.id, name: '메만틴', dosage: '10mg', schedule: '아침', prescribedBy: '신경과', isActive: false },
    { residentId: resident6.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: false },
  ]});

  // #7 박정희 - 92세 여성, 205호 1인실, 등급외
  const resident7 = await prisma.resident.create({
    data: {
      name: '박정희', birthDate: new Date('1934-01-17'), gender: 'FEMALE', roomNumber: '205',
      moveInDate: new Date('2025-04-25'), status: 'ACTIVE', height: 150, weight: 46,
      mobilityLevel: 3, cognitiveLevel: 'SEVERE',
      emergencyContacts: { create: [{ name: '박용철', relationship: '아들', phone: '010-8907-1234', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }, { type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident7.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2019-04-20'), notes: '중증 치매' },
    { residentId: resident7.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2014-07-10'), notes: '고혈압 관리 중' },
    { residentId: resident7.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2017-10-05'), notes: '골다공증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident7.id, name: '리바스티그민', dosage: '4.6mg', schedule: '아침,저녁', prescribedBy: '신경과', isActive: true },
    { residentId: resident7.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident7.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #8 서향숙 - 78세 여성, 207호 특실, 등급외
  const resident8 = await prisma.resident.create({
    data: {
      name: '서향숙', birthDate: new Date('1947-02-10'), gender: 'FEMALE', roomNumber: '207',
      moveInDate: new Date('2024-05-19'), status: 'ACTIVE', height: 157, weight: 56,
      mobilityLevel: 1, cognitiveLevel: 'NORMAL',
      emergencyContacts: { create: [{ name: '서민호', relationship: '아들', phone: '010-9018-2345', isPrimary: true }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident8.id, diseaseId: diseases[5].id, diagnosedAt: new Date('2020-03-15'), notes: '무릎 관절염' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident8.id, name: '셀레콕시브', dosage: '200mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
  ]});

  // #9 성기철 - 85세 남성, 303호 2인실, 등급외
  const resident9 = await prisma.resident.create({
    data: {
      name: '성기철', birthDate: new Date('1941-01-07'), gender: 'MALE', roomNumber: '303',
      moveInDate: new Date('2024-01-23'), status: 'ACTIVE', height: 167, weight: 63,
      mobilityLevel: 2, cognitiveLevel: 'MILD',
      emergencyContacts: { create: [{ name: '성유리', relationship: '딸', phone: '010-1129-3456', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }, { type: 'LOW_SUGAR', notes: '당뇨 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident9.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2014-05-10'), notes: '고혈압 복약 중' },
    { residentId: resident9.id, diseaseId: diseases[1].id, diagnosedAt: new Date('2016-08-20'), notes: '2형 당뇨병' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident9.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident9.id, name: '메트포르민', dosage: '500mg', schedule: '아침,저녁', prescribedBy: '내과', isActive: true },
  ]});

  // #10 송영화 - 86세 남성, 203호 2인실, 등급외
  const resident10 = await prisma.resident.create({
    data: {
      name: '송영화', birthDate: new Date('1939-10-04'), gender: 'MALE', roomNumber: '203',
      moveInDate: new Date('2024-09-11'), status: 'ACTIVE', height: 169, weight: 64,
      mobilityLevel: 2, cognitiveLevel: 'MILD',
      emergencyContacts: { create: [{ name: '송지혜', relationship: '딸', phone: '010-2230-4567', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident10.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2013-09-10'), notes: '고혈압 복약 중' },
    { residentId: resident10.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2017-11-05'), notes: '골다공증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident10.id, name: '발사르탄', dosage: '80mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident10.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #11 오윤희 - 67세 남성, 401호 1인실, 등급외
  const resident11 = await prisma.resident.create({
    data: {
      name: '오윤희', birthDate: new Date('1958-08-30'), gender: 'MALE', roomNumber: '401',
      moveInDate: new Date('2026-02-01'), status: 'ACTIVE', height: 170, weight: 68,
      mobilityLevel: 1, cognitiveLevel: 'NORMAL',
      emergencyContacts: { create: [{ name: '오수정', relationship: '딸', phone: '010-3341-5678', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident11.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2020-01-15'), notes: '고혈압 초기' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident11.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  // #12 이선규 - 88세 여성, 212호 1인실, 등급외
  const resident12 = await prisma.resident.create({
    data: {
      name: '이선규', birthDate: new Date('1937-11-20'), gender: 'FEMALE', roomNumber: '212',
      moveInDate: new Date('2025-07-15'), status: 'ACTIVE', height: 152, weight: 49,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE',
      emergencyContacts: { create: [{ name: '이준기', relationship: '아들', phone: '010-4452-6789', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }, { type: 'LOW_SALT', notes: '심부전 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident12.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2022-04-10'), notes: '중등도 치매' },
    { residentId: resident12.id, diseaseId: diseases[2].id, diagnosedAt: new Date('2021-08-20'), notes: '심부전' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident12.id, name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
    { residentId: resident12.id, name: '스피로놀락톤', dosage: '25mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
  ]});

  // #13 이창진 - 89세 여성, 309호 2인실, 등급외
  const resident13 = await prisma.resident.create({
    data: {
      name: '이창진', birthDate: new Date('1936-03-10'), gender: 'FEMALE', roomNumber: '309',
      moveInDate: new Date('2024-02-24'), status: 'ACTIVE', height: 149, weight: 45,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE',
      emergencyContacts: { create: [{ name: '이성민', relationship: '아들', phone: '010-5563-7890', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident13.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2021-06-15'), notes: '중등도 치매' },
    { residentId: resident13.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2015-03-10'), notes: '고혈압' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident13.id, name: '메만틴', dosage: '10mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
    { residentId: resident13.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  // #14 정정자 - 84세 여성, 203호 2인실, 등급외
  const resident14 = await prisma.resident.create({
    data: {
      name: '정정자', birthDate: new Date('1941-03-01'), gender: 'FEMALE', roomNumber: '203',
      moveInDate: new Date('2024-09-11'), status: 'ACTIVE', height: 154, weight: 51,
      mobilityLevel: 2, cognitiveLevel: 'MILD',
      emergencyContacts: { create: [{ name: '정유진', relationship: '딸', phone: '010-6674-8901', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident14.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2016-04-10'), notes: '고혈압 복약 중' },
    { residentId: resident14.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2018-09-05'), notes: '골다공증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident14.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident14.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #15 조병현 - 82세 남성, 209호 2인실, 4등급
  const resident15 = await prisma.resident.create({
    data: {
      name: '조병현', birthDate: new Date('1943-04-20'), gender: 'MALE', roomNumber: '209',
      moveInDate: new Date('2025-07-19'), status: 'ACTIVE', height: 164, weight: 60,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE',
      emergencyContacts: { create: [{ name: '조현우', relationship: '아들', phone: '010-7785-9012', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident15.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2022-05-10'), notes: '경도-중등도 치매' },
    { residentId: resident15.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2017-03-15'), notes: '고혈압' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident15.id, name: '도네페질', dosage: '5mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
    { residentId: resident15.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  // #16 조용근 - 94세 남성, 408호 1인실, 등급외
  const resident16 = await prisma.resident.create({
    data: {
      name: '조용근', birthDate: new Date('1931-07-18'), gender: 'MALE', roomNumber: '408',
      moveInDate: new Date('2025-06-27'), status: 'ACTIVE', height: 160, weight: 55,
      mobilityLevel: 4, cognitiveLevel: 'SEVERE',
      emergencyContacts: { create: [{ name: '조민석', relationship: '아들', phone: '010-8896-0123', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '중증 연하곤란, 미음식 필요' }, { type: 'LOW_SALT', notes: '심부전 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident16.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2017-08-10'), notes: '중증 치매' },
    { residentId: resident16.id, diseaseId: diseases[2].id, diagnosedAt: new Date('2020-02-20'), notes: '심부전' },
    { residentId: resident16.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2018-05-15'), notes: '골다공증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident16.id, name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
    { residentId: resident16.id, name: '푸로세미드', dosage: '40mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
    { residentId: resident16.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #17 최난숙 - 89세 여성, 206호 1인실, 등급외
  const resident17 = await prisma.resident.create({
    data: {
      name: '최난숙', birthDate: new Date('1936-09-01'), gender: 'FEMALE', roomNumber: '206',
      moveInDate: new Date('2025-04-17'), status: 'ACTIVE', height: 150, weight: 46,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE',
      emergencyContacts: { create: [{ name: '최병훈', relationship: '아들', phone: '010-9907-1234', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }, { type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident17.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2022-02-10'), notes: '중등도 치매' },
    { residentId: resident17.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2014-06-20'), notes: '고혈압 복약 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident17.id, name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
    { residentId: resident17.id, name: '발사르탄', dosage: '80mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  // #18 최윤언 - 85세 남성, 412호 1인실, 등급외
  const resident18 = await prisma.resident.create({
    data: {
      name: '최윤언', birthDate: new Date('1941-03-15'), gender: 'MALE', roomNumber: '412',
      moveInDate: new Date('2024-01-29'), status: 'ACTIVE', height: 166, weight: 62,
      mobilityLevel: 2, cognitiveLevel: 'MILD',
      emergencyContacts: { create: [{ name: '최수진', relationship: '딸', phone: '010-1018-2345', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }, { type: 'LOW_SUGAR', notes: '당뇨 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident18.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2013-07-15'), notes: '고혈압 복약 중' },
    { residentId: resident18.id, diseaseId: diseases[1].id, diagnosedAt: new Date('2017-04-10'), notes: '2형 당뇨병' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident18.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident18.id, name: '글리메피리드', dosage: '2mg', schedule: '아침', prescribedBy: '내분비내과', isActive: true },
  ]});

  // #19 최종현 - 93세 여성, 410호 1인실, 등급외
  const resident19 = await prisma.resident.create({
    data: {
      name: '최종현', birthDate: new Date('1933-05-10'), gender: 'FEMALE', roomNumber: '410',
      moveInDate: new Date('2024-09-18'), status: 'ACTIVE', height: 147, weight: 43,
      mobilityLevel: 4, cognitiveLevel: 'SEVERE',
      emergencyContacts: { create: [{ name: '최영민', relationship: '아들', phone: '010-2129-3456', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '중증 연하곤란, 미음식 필요' }, { type: 'LOW_SALT', notes: '심부전·고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident19.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2018-06-10'), notes: '중증 치매' },
    { residentId: resident19.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2012-03-20'), notes: '고혈압 복약 중' },
    { residentId: resident19.id, diseaseId: diseases[2].id, diagnosedAt: new Date('2021-10-05'), notes: '심부전' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident19.id, name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
    { residentId: resident19.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident19.id, name: '푸로세미드', dosage: '40mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
  ]});

  // #20 최형수 - 84세 남성, 307호 특실, 등급외
  const resident20 = await prisma.resident.create({
    data: {
      name: '최형수', birthDate: new Date('1942-08-22'), gender: 'MALE', roomNumber: '307',
      moveInDate: new Date('2023-12-25'), status: 'ACTIVE', height: 168, weight: 65,
      mobilityLevel: 2, cognitiveLevel: 'MILD',
      emergencyContacts: { create: [{ name: '최지연', relationship: '딸', phone: '010-3230-4567', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident20.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2014-02-10'), notes: '고혈압 복약 중' },
    { residentId: resident20.id, diseaseId: diseases[5].id, diagnosedAt: new Date('2017-06-20'), notes: '양측 무릎 관절염' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident20.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident20.id, name: '트라마돌', dosage: '50mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
  ]});

  // #21 하혜숙 - 80세 여성, 303호 2인실, 등급외
  const resident21 = await prisma.resident.create({
    data: {
      name: '하혜숙', birthDate: new Date('1945-12-18'), gender: 'FEMALE', roomNumber: '303',
      moveInDate: new Date('2024-01-23'), status: 'ACTIVE', height: 155, weight: 53,
      mobilityLevel: 2, cognitiveLevel: 'MILD',
      emergencyContacts: { create: [{ name: '하성민', relationship: '아들', phone: '010-4341-5678', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident21.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2016-08-10'), notes: '고혈압 복약 중' },
    { residentId: resident21.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2018-12-05'), notes: '골다공증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident21.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident21.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #22 한대현 - 92세 남성, 402호 1인실, 등급외
  const resident22 = await prisma.resident.create({
    data: {
      name: '한대현', birthDate: new Date('1933-12-05'), gender: 'MALE', roomNumber: '402',
      moveInDate: new Date('2025-04-20'), status: 'ACTIVE', height: 161, weight: 57,
      mobilityLevel: 4, cognitiveLevel: 'SEVERE',
      emergencyContacts: { create: [{ name: '한진수', relationship: '아들', phone: '010-5452-6789', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '중증 연하곤란, 미음식 필요' }, { type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident22.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2018-11-10'), notes: '중증 치매' },
    { residentId: resident22.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2013-04-20'), notes: '고혈압 복약 중' },
    { residentId: resident22.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2019-07-15'), notes: '골다공증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident22.id, name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
    { residentId: resident22.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    { residentId: resident22.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  // #23 허금순 - 80세 여성, 209호 2인실, 3등급
  const resident23 = await prisma.resident.create({
    data: {
      name: '허금순', birthDate: new Date('1945-08-03'), gender: 'FEMALE', roomNumber: '209',
      moveInDate: new Date('2025-07-19'), status: 'ACTIVE', height: 154, weight: 54,
      mobilityLevel: 2, cognitiveLevel: 'MILD',
      emergencyContacts: { create: [{ name: '허태준', relationship: '아들', phone: '010-6563-7890', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident23.id, diseaseId: diseases[5].id, diagnosedAt: new Date('2019-06-10'), notes: '양측 무릎 관절염' },
    { residentId: resident23.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2017-09-20'), notes: '고혈압 복약 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident23.id, name: '셀레콕시브', dosage: '200mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
    { residentId: resident23.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  // #24 허용오 - 90세 남성, 201호 특실, 등급외
  const resident24 = await prisma.resident.create({
    data: {
      name: '허용오', birthDate: new Date('1935-07-12'), gender: 'MALE', roomNumber: '201',
      moveInDate: new Date('2025-07-15'), status: 'ACTIVE', height: 162, weight: 56,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE',
      emergencyContacts: { create: [{ name: '허미영', relationship: '딸', phone: '010-7674-8901', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }, { type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident24.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2022-03-10'), notes: '중등도 치매' },
    { residentId: resident24.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2014-07-20'), notes: '고혈압 복약 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident24.id, name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
    { residentId: resident24.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  // #25 홍영자 - 80세 여성, 411호 1인실, 등급외
  const resident25 = await prisma.resident.create({
    data: {
      name: '홍영자', birthDate: new Date('1946-04-15'), gender: 'FEMALE', roomNumber: '411',
      moveInDate: new Date('2025-11-21'), status: 'ACTIVE', height: 156, weight: 54,
      mobilityLevel: 1, cognitiveLevel: 'NORMAL',
      emergencyContacts: { create: [{ name: '홍준혁', relationship: '아들', phone: '010-8785-9012', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압 관리' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident25.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2019-05-10'), notes: '고혈압 초기' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident25.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  const residents = [
    resident1, resident2, resident3, resident4, resident5,
    resident6, resident7, resident8, resident9, resident10,
    resident11, resident12, resident13, resident14, resident15,
    resident16, resident17, resident18, resident19, resident20,
    resident21, resident22, resident23, resident24, resident25,
  ];
  console.log('입주자 생성 완료 (25명)');

  // IoT 기기 - 활성 입주자(퇴소자 제외)에게만 부여
  const activeResidents = residents.filter(r => r.name !== '박복순');
  const iotDevices = await Promise.all(
    activeResidents.map((r, i) => {
      const devNum = String(i + 1).padStart(3, '0');
      const batteryLevels = [85, 20, 92, 60, 45, 78, 55, 90, 33, 67, 82, 50, 70, 88, 40, 63, 77, 95, 30, 58, 72, 44, 86, 65, 91];
      const battery = batteryLevels[i] ?? 75;
      const status = battery <= 20 ? 'LOW_BATTERY' : 'NORMAL';
      return prisma.iotDevice.create({
        data: {
          deviceCode: `DEV-${devNum}`,
          residentId: r.id,
          location: `${r.roomNumber}호 침실`,
          batteryLevel: battery,
          lastCommunicated: new Date(),
          status,
        },
      });
    })
  );

  console.log('IoT 기기 생성 완료');

  // 낙상 이벤트
  const fall1 = await prisma.fallEvent.create({
    data: {
      residentId: resident1.id, deviceId: iotDevices[0].id,
      occurredAt: new Date(Date.now() - 7 * 86400000), location: '301호 화장실',
      severity: 'WARNING', sensorData: JSON.stringify({ acceleration: 2.5, angle: 45, impact: 'medium' }),
      status: 'RESOLVED', isRead: true,
    },
  });
  await prisma.fallResponse.create({
    data: { fallEventId: fall1.id, respondedBy: '김서연', content: '화장실에서 미끄러짐. 외상 없음. 활력징후 정상.', outcome: 'NO_INJURY' },
  });

  const fall2 = await prisma.fallEvent.create({
    data: {
      residentId: resident3.id, deviceId: iotDevices[2].id,
      occurredAt: new Date(Date.now() - 3 * 86400000), location: '309호 침실',
      severity: 'CRITICAL', sensorData: JSON.stringify({ acceleration: 4.2, angle: 78, impact: 'high' }),
      status: 'RESOLVED', isRead: true,
    },
  });
  await prisma.fallResponse.create({
    data: { fallEventId: fall2.id, respondedBy: '김서연', content: '침대에서 낙상. 오른쪽 팔 타박상. 경과 관찰 중.', outcome: 'MINOR_INJURY' },
  });

  await prisma.fallEvent.create({
    data: {
      residentId: resident9.id, deviceId: iotDevices[7].id,
      occurredAt: new Date(Date.now() - 3600000), location: '303호 복도',
      severity: 'WARNING', sensorData: JSON.stringify({ acceleration: 2.1, angle: 35, impact: 'light' }),
      status: 'UNHANDLED', isRead: false,
    },
  });

  console.log('낙상 이벤트 생성 완료');

  // 건강 기록 (30일 x 활성 입주자)
  for (const resident of activeResidents) {
    const baseWeight = resident.weight || 60;
    let systolicBase = 130, diastolicBase = 85, sugarBase = 110;
    if (resident.id === resident1.id || resident.id === resident7.id || resident.id === resident19.id) {
      systolicBase = 148; diastolicBase = 92; sugarBase = 115;
    } else if (resident.id === resident9.id || resident.id === resident10.id) {
      systolicBase = 140; diastolicBase = 88; sugarBase = 130;
    }

    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const iv = () => Math.floor((Math.random() - 0.5) * 6);
      await prisma.healthRecord.create({
        data: {
          residentId: resident.id, recordedAt: date, recordedBy: nurseKim.name,
          systolicBP: systolicBase + iv(), diastolicBP: diastolicBase + iv(),
          bloodSugarFasting: sugarBase + (Math.random() - 0.5) * 4, heartRate: 72 + iv(),
          temperature: 36.5 + (Math.random() - 0.5) * 0.6,
          weight: baseWeight + (Math.random() - 0.5) * 0.5,
          sleepHours: 6 + Math.random() * 3, waterIntake: 1200 + Math.random() * 600,
          mealAmount: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
          bowelMovement: Math.random() > 0.3, moodScore: Math.floor(Math.random() * 3) + 2,
        },
      });
    }
  }
  console.log(`건강 기록 생성 완료 (30일 x ${activeResidents.length}명)`);

  const programs = await Promise.all([
    prisma.program.create({ data: { name: '실버요가', category: 'EXERCISE', description: '시니어 맞춤 요가로 유연성과 균형감각을 향상시키는 프로그램', instructor: '요가 강사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '09:00', endTime: '10:00' }, { dayOfWeek: 3, startTime: '09:00', endTime: '10:00' }, { dayOfWeek: 5, startTime: '09:00', endTime: '10:00' }]), location: '2층 운동실', capacity: 15, enrolledCount: 8, status: 'ONGOING', minMobilityLevel: 2, minCognitiveLevel: 'NORMAL' } }),
    prisma.program.create({ data: { name: '호흡과 명상', category: 'EXERCISE', description: '호흡법과 명상을 통한 심신 안정 및 스트레스 해소 프로그램', instructor: '명상 지도사', schedule: JSON.stringify([{ dayOfWeek: 2, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 4, startTime: '10:00', endTime: '11:00' }]), location: '3층 힐링룸', capacity: 20, enrolledCount: 12, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MILD' } }),
    prisma.program.create({ data: { name: '미술공예', category: 'CULTURE', description: '다양한 미술 재료를 활용한 창작 활동으로 소근육 운동 및 정서 안정', instructor: '공예 강사', schedule: JSON.stringify([{ dayOfWeek: 2, startTime: '14:00', endTime: '15:30' }, { dayOfWeek: 4, startTime: '14:00', endTime: '15:30' }]), location: '4층 문화실', capacity: 12, enrolledCount: 7, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MILD' } }),
    prisma.program.create({ data: { name: '노래교실', category: 'CULTURE', description: '동요, 가요를 함께 부르는 음악치료 프로그램', instructor: '음악치료사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '14:00', endTime: '15:00' }, { dayOfWeek: 3, startTime: '14:00', endTime: '15:00' }]), location: '3층 다목적홀', capacity: 25, enrolledCount: 15, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MODERATE' } }),
    prisma.program.create({ data: { name: '맞춤재활운동', category: 'HEALTH_REHAB', description: '개인별 신체 상태에 맞춘 재활 운동 프로그램', instructor: '물리치료사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 2, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 3, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 4, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 5, startTime: '10:00', endTime: '11:00' }]), location: '2층 재활센터', capacity: 8, enrolledCount: 5, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'NORMAL' } }),
    prisma.program.create({ data: { name: '인지훈련프로그램', category: 'COGNITIVE', description: '퍼즐, 기억력 게임을 통한 인지 기능 유지 및 향상 프로그램', instructor: '작업치료사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '11:00', endTime: '12:00' }, { dayOfWeek: 3, startTime: '11:00', endTime: '12:00' }, { dayOfWeek: 5, startTime: '11:00', endTime: '12:00' }]), location: '4층 인지치료실', capacity: 6, enrolledCount: 4, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'NORMAL' } }),
    prisma.program.create({ data: { name: '원예치료', category: 'COGNITIVE', description: '화분 가꾸기와 텃밭 활동을 통한 인지 기능 향상 및 정서 안정', instructor: '원예치료사', schedule: JSON.stringify([{ dayOfWeek: 2, startTime: '14:00', endTime: '15:30' }, { dayOfWeek: 4, startTime: '14:00', endTime: '15:30' }]), location: '옥상정원', capacity: 10, enrolledCount: 6, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'NORMAL' } }),
    prisma.program.create({ data: { name: '영화감상회', category: 'SOCIAL', description: '매주 다양한 장르의 영화를 함께 감상하는 여가 프로그램', instructor: '생활지도사', schedule: JSON.stringify([{ dayOfWeek: 5, startTime: '15:00', endTime: '17:00' }]), location: '3층 영상실', capacity: 30, enrolledCount: 20, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MODERATE' } }),
    prisma.program.create({ data: { name: '건강강좌', category: 'SOCIAL', description: '외부 전문가를 초청하여 건강 관련 주제로 진행하는 교육 프로그램', instructor: '외부강사', schedule: JSON.stringify([{ dayOfWeek: 2, startTime: '15:00', endTime: '16:00' }, { dayOfWeek: 4, startTime: '15:00', endTime: '16:00' }]), location: '3층 다목적홀', capacity: 40, enrolledCount: 25, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MILD' } }),
    prisma.program.create({ data: { name: '산책모임', category: 'EXERCISE', description: '시설 주변 산책로를 이용한 야외 걷기 활동', instructor: '생활지도사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '09:00', endTime: '10:00' }, { dayOfWeek: 3, startTime: '09:00', endTime: '10:00' }, { dayOfWeek: 5, startTime: '09:00', endTime: '10:00' }]), location: '외부산책로', capacity: 15, enrolledCount: 10, status: 'ONGOING', minMobilityLevel: 2, minCognitiveLevel: 'MILD' } }),
  ]);

  console.log('프로그램 생성 완료');

  await prisma.programEnrollment.createMany({ data: [
    { residentId: resident4.id, programId: programs[0].id },
    { residentId: resident4.id, programId: programs[6].id },
    { residentId: resident8.id, programId: programs[4].id },
    { residentId: resident8.id, programId: programs[9].id },
    { residentId: resident9.id, programId: programs[5].id },
    { residentId: resident9.id, programId: programs[8].id },
    { residentId: resident11.id, programId: programs[4].id },
    { residentId: resident11.id, programId: programs[6].id },
    { residentId: resident14.id, programId: programs[3].id },
    { residentId: resident14.id, programId: programs[7].id },
    { residentId: resident20.id, programId: programs[0].id },
    { residentId: resident20.id, programId: programs[2].id },
    { residentId: resident21.id, programId: programs[1].id },
    { residentId: resident23.id, programId: programs[4].id },
    { residentId: resident25.id, programId: programs[9].id },
  ]});
  console.log('프로그램 등록 완료');

  await prisma.healthGuide.createMany({ data: [
    { residentId: resident9.id, type: 'DIET', content: JSON.stringify({ title: '고혈압·당뇨 맞춤 식이 가이드', summary: '저염, 저당 식이가 필요합니다.', recommendations: [{ priority: 'HIGH', category: '나트륨 제한', detail: '하루 나트륨 섭취량을 2,000mg 이하로 제한하세요.' }], avoidFoods: ['가공육', '패스트푸드'], recommendFoods: ['현미밥', '채소', '두부'] }) },
    { residentId: resident20.id, type: 'EXERCISE', content: JSON.stringify({ title: '관절 건강 맞춤 운동 가이드', summary: '관절에 부담이 적은 수중 운동을 권장합니다.', recommendations: [{ priority: 'HIGH', category: '저충격 운동', detail: '수중 운동을 주 3회 이상 권장합니다.' }], avoidExercises: ['달리기', '점프'], recommendExercises: ['수중 운동', '고정 자전거'], schedule: '주 5회, 하루 30분' }) },
  ]});

  await prisma.activityLog.createMany({ data: [
    { adminId: director.id, action: 'LOGIN', details: '시설장 로그인' },
    { adminId: nurseKim.id, action: 'HEALTH_RECORD_CREATE', targetType: 'Resident', targetId: resident1.id, details: `${resident1.name} 건강 기록 입력` },
  ]});

  console.log('');
  console.log('=== 케어닥 케어홈 송추점 시드 데이터 생성 완료! ===');
  console.log('로그인 계정:');
  console.log('  시설장: director / caredoc2024!');
  console.log('  간호사: nurse_kim / caredoc2024!');
  console.log('  간호사: nurse_lee / caredoc2024!');
  console.log('  생활지도사: social_choi / caredoc2024!');
  console.log('  생활지도사: social_park / caredoc2024!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
