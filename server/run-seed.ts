// Seed runner that runs from server directory so @prisma/client resolves correctly
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('케어닥 케어홈 배곧신도시점 시드 데이터 생성 시작...');

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
    prisma.disease.upsert({ where: { name: '고혈압' }, update: {}, create: { name: '고혈압', code: 'I10' } }),
    prisma.disease.upsert({ where: { name: '당뇨병' }, update: {}, create: { name: '당뇨병', code: 'E11' } }),
    prisma.disease.upsert({ where: { name: '심부전' }, update: {}, create: { name: '심부전', code: 'I50' } }),
    prisma.disease.upsert({ where: { name: '치매' }, update: {}, create: { name: '치매', code: 'F03' } }),
    prisma.disease.upsert({ where: { name: '골다공증' }, update: {}, create: { name: '골다공증', code: 'M81' } }),
    prisma.disease.upsert({ where: { name: '관절염' }, update: {}, create: { name: '관절염', code: 'M19' } }),
    prisma.disease.upsert({ where: { name: '뇌졸중' }, update: {}, create: { name: '뇌졸중', code: 'I64' } }),
    prisma.disease.upsert({ where: { name: '파킨슨병' }, update: {}, create: { name: '파킨슨병', code: 'G20' } }),
    prisma.disease.upsert({ where: { name: '만성폐쇄성폐질환' }, update: {}, create: { name: '만성폐쇄성폐질환', code: 'J44' } }),
    prisma.disease.upsert({ where: { name: '우울증' }, update: {}, create: { name: '우울증', code: 'F32' } }),
  ]);

  console.log('질병 데이터 생성 완료');

  // 1관 입주자 (101, 103, 105, 107, 109)
  const resident1 = await prisma.resident.create({
    data: {
      name: '김영순', birthDate: new Date('1942-03-15'), gender: 'FEMALE', roomNumber: '101',
      admissionDate: new Date('2022-01-10'), status: 'ACTIVE', height: 155, weight: 52,
      mobilityLevel: 2, cognitiveLevel: 'MILD', monthlyFee: 1900000, deposit: 10000000, depositPaid: true,
      emergencyContacts: { create: [
        { name: '김철수', relationship: '아들', phone: '010-9876-5432', isPrimary: true },
        { name: '이민지', relationship: '며느리', phone: '010-8765-4321' },
      ]},
      allergies: { create: [{ type: 'DRUG', name: '페니실린', severity: '심각' }, { type: 'FOOD', name: '새우', severity: '경미' }]},
      dietaryRestrictions: { create: [{ type: 'LOW_SALT', notes: '고혈압으로 인한 저염식' }, { type: 'LOW_SUGAR', notes: '당뇨 관리' }]},
    },
  });

  await prisma.residentDisease.createMany({ data: [
    { residentId: resident1.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2018-05-20'), notes: '혈압약 복용 중' },
    { residentId: resident1.id, diseaseId: diseases[1].id, diagnosedAt: new Date('2019-11-10'), notes: '인슐린 투여' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident1.id, name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '박내과', isActive: true },
    { residentId: resident1.id, name: '메트포르민', dosage: '500mg', schedule: '아침,저녁', prescribedBy: '박내과', isActive: true },
    { residentId: resident1.id, name: '아스피린', dosage: '100mg', schedule: '아침', prescribedBy: '박내과', isActive: true },
  ]});

  const resident2 = await prisma.resident.create({
    data: {
      name: '이복자', birthDate: new Date('1938-07-22'), gender: 'FEMALE', roomNumber: '103',
      admissionDate: new Date('2021-06-15'), status: 'ACTIVE', height: 150, weight: 48,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE', monthlyFee: 2200000, deposit: 10000000, depositPaid: true,
      emergencyContacts: { create: [{ name: '이상훈', relationship: '아들', phone: '010-7654-3210', isPrimary: true }]},
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '연하 곤란으로 다진식 필요' }, { type: 'LOW_SALT', notes: '심부전 관리' }]},
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident2.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2020-03-15'), notes: '중등도 치매' },
    { residentId: resident2.id, diseaseId: diseases[2].id, diagnosedAt: new Date('2019-08-20'), notes: '심부전 관리 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident2.id, name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
    { residentId: resident2.id, name: '푸로세미드', dosage: '40mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
  ]});

  const resident3 = await prisma.resident.create({
    data: {
      name: '박정호', birthDate: new Date('1945-11-08'), gender: 'MALE', roomNumber: '105',
      admissionDate: new Date('2023-02-20'), status: 'ACTIVE', height: 168, weight: 65,
      mobilityLevel: 1, cognitiveLevel: 'NORMAL', monthlyFee: 1900000, deposit: 10000000, depositPaid: true,
      emergencyContacts: { create: [{ name: '박미선', relationship: '딸', phone: '010-6543-2109', isPrimary: true }]},
      allergies: { create: [{ type: 'DRUG', name: '설폰아미드', severity: '심각' }]},
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident3.id, diseaseId: diseases[5].id, diagnosedAt: new Date('2015-04-10'), notes: '무릎 관절염' },
    { residentId: resident3.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2016-09-05'), notes: '골다공증 치료 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident3.id, name: '셀레콕시브', dosage: '200mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
    { residentId: resident3.id, name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
  ]});

  const resident4 = await prisma.resident.create({
    data: {
      name: '최순남', birthDate: new Date('1940-05-30'), gender: 'FEMALE', roomNumber: '107',
      admissionDate: new Date('2022-09-05'), status: 'ACTIVE', height: 158, weight: 55,
      mobilityLevel: 3, cognitiveLevel: 'NORMAL', monthlyFee: 2200000, deposit: 10000000, depositPaid: true,
      emergencyContacts: { create: [{ name: '최민호', relationship: '아들', phone: '010-4321-0987', isPrimary: true }]},
      dietaryRestrictions: { create: [{ type: 'LOW_FAT', notes: '고지혈증 관리' }]},
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident4.id, diseaseId: diseases[6].id, diagnosedAt: new Date('2021-07-20'), notes: '좌측 편마비' },
    { residentId: resident4.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2015-02-15'), notes: '뇌졸중 관련 고혈압' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident4.id, name: '클로피도그렐', dosage: '75mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
    { residentId: resident4.id, name: '아토르바스타틴', dosage: '20mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
  ]});

  const resident5 = await prisma.resident.create({
    data: {
      name: '정기원', birthDate: new Date('1948-09-12'), gender: 'MALE', roomNumber: '109',
      admissionDate: new Date('2023-07-01'), status: 'ACTIVE', height: 172, weight: 70,
      mobilityLevel: 2, cognitiveLevel: 'MILD', monthlyFee: 1900000, deposit: 10000000, depositPaid: true,
      emergencyContacts: { create: [{ name: '정수진', relationship: '딸', phone: '010-3210-9876', isPrimary: true }]},
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident5.id, diseaseId: diseases[7].id, diagnosedAt: new Date('2022-01-10'), notes: '파킨슨병 초기' },
    { residentId: resident5.id, diseaseId: diseases[9].id, diagnosedAt: new Date('2022-06-15'), notes: '우울증 치료 중' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident5.id, name: '레보도파/카르비도파', dosage: '100/25mg', schedule: '아침,점심,저녁', prescribedBy: '신경과', isActive: true },
    { residentId: resident5.id, name: '에스시탈로프람', dosage: '10mg', schedule: '아침', prescribedBy: '정신건강의학과', isActive: true },
  ]});

  // 2관 입주자 (201, 203, 205, 207, 209)
  const resident6 = await prisma.resident.create({
    data: {
      name: '한말순', birthDate: new Date('1936-01-20'), gender: 'FEMALE', roomNumber: '201',
      admissionDate: new Date('2021-03-10'), status: 'ACTIVE', height: 148, weight: 45,
      mobilityLevel: 4, cognitiveLevel: 'SEVERE', monthlyFee: 2800000, deposit: 15000000, depositPaid: true,
      emergencyContacts: { create: [{ name: '한지훈', relationship: '손자', phone: '010-1111-2222', isPrimary: true }] },
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '중증 연하곤란, 미음식 필요' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident6.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2017-04-10'), notes: '중증 치매' },
    { residentId: resident6.id, diseaseId: diseases[4].id, diagnosedAt: new Date('2018-08-01'), notes: '골다공증 심화' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident6.id, name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
  ]});

  const resident7 = await prisma.resident.create({
    data: {
      name: '오세진', birthDate: new Date('1950-06-05'), gender: 'MALE', roomNumber: '203',
      admissionDate: new Date('2024-01-15'), status: 'ACTIVE', height: 175, weight: 80,
      mobilityLevel: 1, cognitiveLevel: 'NORMAL', monthlyFee: 1900000, deposit: 10000000, depositPaid: true,
      emergencyContacts: { create: [
        { name: '오수빈', relationship: '딸', phone: '010-3333-4444', isPrimary: true },
        { name: '오민재', relationship: '아들', phone: '010-4444-5555' },
      ]},
      allergies: { create: [{ type: 'FOOD', name: '땅콩', severity: '심각' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident7.id, diseaseId: diseases[8].id, diagnosedAt: new Date('2020-11-20'), notes: '만성폐쇄성폐질환 관리 중' },
    { residentId: resident7.id, diseaseId: diseases[0].id, diagnosedAt: new Date('2016-03-10'), notes: '경도 고혈압' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident7.id, name: '티오트로피움', dosage: '18mcg', schedule: '아침', prescribedBy: '호흡기내과', isActive: true },
    { residentId: resident7.id, name: '발사르탄', dosage: '80mg', schedule: '아침', prescribedBy: '내과', isActive: true },
  ]});

  const resident8 = await prisma.resident.create({
    data: {
      name: '송미경', birthDate: new Date('1944-12-18'), gender: 'FEMALE', roomNumber: '205',
      admissionDate: new Date('2023-05-20'), status: 'HOSPITALIZED', height: 160, weight: 58,
      mobilityLevel: 2, cognitiveLevel: 'MILD', monthlyFee: 1900000, deposit: 10000000, depositPaid: true,
      emergencyContacts: { create: [{ name: '송현우', relationship: '아들', phone: '010-5555-6666', isPrimary: true }] },
      dietaryRestrictions: { create: [
        { type: 'LOW_PROTEIN', notes: '신장질환으로 저단백식 필요' },
        { type: 'LOW_SALT', notes: '부종 관리' },
      ]},
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident8.id, diseaseId: diseases[2].id, diagnosedAt: new Date('2022-09-15'), notes: '만성 심부전' },
    { residentId: resident8.id, diseaseId: diseases[1].id, diagnosedAt: new Date('2017-06-20'), notes: '2형 당뇨병' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident8.id, name: '엔알라프릴', dosage: '5mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
    { residentId: resident8.id, name: '글리메피리드', dosage: '2mg', schedule: '아침', prescribedBy: '내분비내과', isActive: true },
    { residentId: resident8.id, name: '스피로놀락톤', dosage: '25mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
  ]});

  const resident9 = await prisma.resident.create({
    data: {
      name: '윤태식', birthDate: new Date('1947-08-25'), gender: 'MALE', roomNumber: '207',
      admissionDate: new Date('2022-11-01'), status: 'ACTIVE', height: 165, weight: 58,
      mobilityLevel: 3, cognitiveLevel: 'MODERATE', monthlyFee: 2500000, deposit: 12000000, depositPaid: false,
      emergencyContacts: { create: [
        { name: '윤지영', relationship: '딸', phone: '010-6666-7777', isPrimary: true },
        { name: '윤석민', relationship: '아들', phone: '010-7777-8888' },
      ]},
      dietaryRestrictions: { create: [{ type: 'DYSPHAGIA', notes: '다진식 필요' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident9.id, diseaseId: diseases[6].id, diagnosedAt: new Date('2020-05-30'), notes: '뇌졸중 후유증, 우측 편마비' },
    { residentId: resident9.id, diseaseId: diseases[3].id, diagnosedAt: new Date('2023-02-10'), notes: '혈관성 치매' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident9.id, name: '와파린', dosage: '3mg', schedule: '저녁', prescribedBy: '신경과', isActive: true },
    { residentId: resident9.id, name: '리바스티그민', dosage: '6mg', schedule: '아침,저녁', prescribedBy: '신경과', isActive: true },
  ]});

  const resident10 = await prisma.resident.create({
    data: {
      name: '강옥희', birthDate: new Date('1943-04-02'), gender: 'FEMALE', roomNumber: '209',
      admissionDate: new Date('2024-06-10'), status: 'ACTIVE', height: 153, weight: 50,
      mobilityLevel: 2, cognitiveLevel: 'NORMAL', monthlyFee: 2100000, deposit: 10000000, depositPaid: true,
      emergencyContacts: { create: [
        { name: '강준호', relationship: '아들', phone: '010-8888-9999', isPrimary: true },
        { name: '이은정', relationship: '며느리', phone: '010-9999-0000' },
      ]},
      allergies: { create: [{ type: 'DRUG', name: '아스피린', severity: '경미' }, { type: 'FOOD', name: '복숭아', severity: '경미' }] },
      dietaryRestrictions: { create: [{ type: 'LOW_FAT', notes: '고지혈증 관리' }, { type: 'LOW_SUGAR', notes: '경계성 당뇨' }] },
    },
  });
  await prisma.residentDisease.createMany({ data: [
    { residentId: resident10.id, diseaseId: diseases[5].id, diagnosedAt: new Date('2019-07-10'), notes: '양측 무릎 관절염' },
    { residentId: resident10.id, diseaseId: diseases[9].id, diagnosedAt: new Date('2023-12-01'), notes: '배우자 사별 후 우울증' },
  ]});
  await prisma.medication.createMany({ data: [
    { residentId: resident10.id, name: '트라마돌', dosage: '50mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
    { residentId: resident10.id, name: '세르트랄린', dosage: '50mg', schedule: '아침', prescribedBy: '정신건강의학과', isActive: true },
  ]});

  const residents = [resident1, resident2, resident3, resident4, resident5, resident6, resident7, resident8, resident9, resident10];
  console.log('입주자 생성 완료');

  const iotDevices = await Promise.all([
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-001', residentId: resident1.id, location: '1관 101호 침실', batteryLevel: 85, lastCommunicated: new Date(), status: 'NORMAL' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-002', residentId: resident2.id, location: '1관 103호 침실', batteryLevel: 20, lastCommunicated: new Date(), status: 'LOW_BATTERY' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-003', residentId: resident3.id, location: '1관 105호 침실', batteryLevel: 92, lastCommunicated: new Date(), status: 'NORMAL' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-004', residentId: resident4.id, location: '1관 107호 침실', batteryLevel: 60, lastCommunicated: new Date(), status: 'NORMAL' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-005', residentId: resident5.id, location: '1관 109호 침실', batteryLevel: 45, lastCommunicated: new Date(), status: 'NORMAL' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-006', residentId: resident6.id, location: '2관 201호 침실', batteryLevel: 78, lastCommunicated: new Date(), status: 'NORMAL' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-007', residentId: resident7.id, location: '2관 203호 침실', batteryLevel: 55, lastCommunicated: new Date(), status: 'NORMAL' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-008', residentId: resident8.id, location: '2관 205호 침실', batteryLevel: 90, lastCommunicated: new Date(), status: 'NORMAL' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-009', residentId: resident9.id, location: '2관 207호 침실', batteryLevel: 33, lastCommunicated: new Date(), status: 'NORMAL' } }),
    prisma.iotDevice.create({ data: { deviceCode: 'DEV-010', residentId: resident10.id, location: '2관 209호 침실', batteryLevel: 67, lastCommunicated: new Date(), status: 'NORMAL' } }),
  ]);

  console.log('IoT 기기 생성 완료');

  const fall1 = await prisma.fallEvent.create({
    data: { residentId: resident1.id, deviceId: iotDevices[0].id, occurredAt: new Date(Date.now() - 7 * 86400000), location: '1관 101호 화장실', severity: 'WARNING', sensorData: JSON.stringify({ acceleration: 2.5, angle: 45, impact: 'medium' }), status: 'RESOLVED', isRead: true },
  });
  await prisma.fallResponse.create({ data: { fallEventId: fall1.id, respondedBy: '김서연', content: '화장실에서 미끄러짐. 외상 없음. 활력징후 정상.', outcome: 'NO_INJURY' } });

  const fall2 = await prisma.fallEvent.create({
    data: { residentId: resident2.id, deviceId: iotDevices[1].id, occurredAt: new Date(Date.now() - 3 * 86400000), location: '1관 103호 침실', severity: 'CRITICAL', sensorData: JSON.stringify({ acceleration: 4.2, angle: 78, impact: 'high' }), status: 'RESOLVED', isRead: true },
  });
  await prisma.fallResponse.create({ data: { fallEventId: fall2.id, respondedBy: '김서연', content: '침대에서 낙상. 오른쪽 팔 타박상. 경과 관찰 중.', outcome: 'MINOR_INJURY' } });

  await prisma.fallEvent.create({
    data: { residentId: resident5.id, deviceId: iotDevices[4].id, occurredAt: new Date(Date.now() - 3600000), location: '1관 109호 복도', severity: 'WARNING', sensorData: JSON.stringify({ acceleration: 2.1, angle: 35, impact: 'light' }), status: 'UNHANDLED', isRead: false },
  });

  console.log('낙상 이벤트 생성 완료');

  for (const resident of residents) {
    const baseWeight = resident.weight || 60;
    let systolicBase = 130, diastolicBase = 85, sugarBase = 110;
    if (resident.id === resident1.id) { systolicBase = 145; diastolicBase = 90; sugarBase = 135; }
    else if (resident.id === resident2.id) { systolicBase = 150; diastolicBase = 95; sugarBase = 120; }

    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      const v = () => (Math.random() - 0.5) * 4;
      const iv = () => Math.floor((Math.random() - 0.5) * 6);
      await prisma.healthRecord.create({
        data: {
          residentId: resident.id, recordedAt: date, recordedBy: nurseKim.name,
          systolicBP: systolicBase + iv(), diastolicBP: diastolicBase + iv(),
          bloodSugarFasting: sugarBase + v(), heartRate: 72 + iv(),
          temperature: 36.5 + (Math.random() - 0.5) * 0.6,
          weight: baseWeight + (Math.random() - 0.5) * 0.5,
          sleepHours: 6 + Math.random() * 3, waterIntake: 1200 + Math.random() * 600,
          mealAmount: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
          bowelMovement: Math.random() > 0.3, moodScore: Math.floor(Math.random() * 3) + 2,
        },
      });
    }
  }
  console.log('건강 기록 생성 완료 (30일 x 10명)');

  const programs = await Promise.all([
    prisma.program.create({ data: { name: '실버요가', category: 'EXERCISE', description: '시니어 맞춤 요가로 유연성과 균형감각을 향상시키는 프로그램', instructor: '요가 강사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '09:00', endTime: '10:00' }, { dayOfWeek: 3, startTime: '09:00', endTime: '10:00' }, { dayOfWeek: 5, startTime: '09:00', endTime: '10:00' }]), location: '1층 운동실', capacity: 15, enrolledCount: 8, status: 'ONGOING', minMobilityLevel: 2, minCognitiveLevel: 'NORMAL' } }),
    prisma.program.create({ data: { name: '호흡과 명상', category: 'EXERCISE', description: '호흡법과 명상을 통한 심신 안정 및 스트레스 해소 프로그램', instructor: '명상 지도사', schedule: JSON.stringify([{ dayOfWeek: 2, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 4, startTime: '10:00', endTime: '11:00' }]), location: '2층 힐링룸', capacity: 20, enrolledCount: 12, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MILD' } }),
    prisma.program.create({ data: { name: '미술공예', category: 'CULTURE', description: '다양한 미술 재료를 활용한 창작 활동으로 소근육 운동 및 정서 안정', instructor: '공예 강사', schedule: JSON.stringify([{ dayOfWeek: 2, startTime: '14:00', endTime: '15:30' }, { dayOfWeek: 4, startTime: '14:00', endTime: '15:30' }]), location: '3층 문화실', capacity: 12, enrolledCount: 7, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MILD' } }),
    prisma.program.create({ data: { name: '노래교실', category: 'CULTURE', description: '동요, 가요를 함께 부르는 음악치료 프로그램', instructor: '음악치료사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '14:00', endTime: '15:00' }, { dayOfWeek: 3, startTime: '14:00', endTime: '15:00' }]), location: '2층 다목적홀', capacity: 25, enrolledCount: 15, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MODERATE' } }),
    prisma.program.create({ data: { name: '맞춤재활운동', category: 'HEALTH_REHAB', description: '개인별 신체 상태에 맞춘 재활 운동 프로그램', instructor: '물리치료사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 2, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 3, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 4, startTime: '10:00', endTime: '11:00' }, { dayOfWeek: 5, startTime: '10:00', endTime: '11:00' }]), location: '1층 재활센터', capacity: 8, enrolledCount: 5, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'NORMAL' } }),
    prisma.program.create({ data: { name: '인지훈련프로그램', category: 'COGNITIVE', description: '퍼즐, 기억력 게임을 통한 인지 기능 유지 및 향상 프로그램', instructor: '작업치료사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '11:00', endTime: '12:00' }, { dayOfWeek: 3, startTime: '11:00', endTime: '12:00' }, { dayOfWeek: 5, startTime: '11:00', endTime: '12:00' }]), location: '3층 인지치료실', capacity: 6, enrolledCount: 4, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'NORMAL' } }),
    prisma.program.create({ data: { name: '원예치료', category: 'COGNITIVE', description: '화분 가꾸기와 텃밭 활동을 통한 인지 기능 향상 및 정서 안정', instructor: '원예치료사', schedule: JSON.stringify([{ dayOfWeek: 2, startTime: '14:00', endTime: '15:30' }, { dayOfWeek: 4, startTime: '14:00', endTime: '15:30' }]), location: '옥상정원', capacity: 10, enrolledCount: 6, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'NORMAL' } }),
    prisma.program.create({ data: { name: '영화감상회', category: 'SOCIAL', description: '매주 다양한 장르의 영화를 함께 감상하는 여가 프로그램', instructor: '생활지도사', schedule: JSON.stringify([{ dayOfWeek: 5, startTime: '15:00', endTime: '17:00' }]), location: '2층 영상실', capacity: 30, enrolledCount: 20, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MODERATE' } }),
    prisma.program.create({ data: { name: '건강강좌', category: 'SOCIAL', description: '외부 전문가를 초청하여 건강 관련 주제로 진행하는 교육 프로그램', instructor: '외부강사', schedule: JSON.stringify([{ dayOfWeek: 2, startTime: '15:00', endTime: '16:00' }, { dayOfWeek: 4, startTime: '15:00', endTime: '16:00' }]), location: '2층 다목적홀', capacity: 40, enrolledCount: 25, status: 'ONGOING', minMobilityLevel: 1, minCognitiveLevel: 'MILD' } }),
    prisma.program.create({ data: { name: '산책모임', category: 'EXERCISE', description: '시설 주변 산책로를 이용한 야외 걷기 활동', instructor: '생활지도사', schedule: JSON.stringify([{ dayOfWeek: 1, startTime: '09:00', endTime: '10:00' }, { dayOfWeek: 3, startTime: '09:00', endTime: '10:00' }, { dayOfWeek: 5, startTime: '09:00', endTime: '10:00' }]), location: '외부산책로', capacity: 15, enrolledCount: 10, status: 'ONGOING', minMobilityLevel: 2, minCognitiveLevel: 'MILD' } }),
  ]);

  console.log('프로그램 생성 완료');

  await prisma.programEnrollment.createMany({ data: [
    { residentId: resident1.id, programId: programs[0].id },
    { residentId: resident1.id, programId: programs[6].id },
    { residentId: resident1.id, programId: programs[3].id },
    { residentId: resident2.id, programId: programs[3].id },
    { residentId: resident2.id, programId: programs[7].id },
    { residentId: resident3.id, programId: programs[4].id },
    { residentId: resident3.id, programId: programs[0].id },
    { residentId: resident3.id, programId: programs[9].id },
    { residentId: resident4.id, programId: programs[4].id },
    { residentId: resident4.id, programId: programs[2].id },
    { residentId: resident5.id, programId: programs[5].id },
    { residentId: resident5.id, programId: programs[8].id },
  ]});
  console.log('프로그램 등록 완료');

  await prisma.healthGuide.createMany({ data: [
    { residentId: resident1.id, type: 'DIET', content: JSON.stringify({ title: '고혈압·당뇨 맞춤 식이 가이드', summary: '저염, 저당 식이가 필요합니다.', recommendations: [{ priority: 'HIGH', category: '나트륨 제한', detail: '하루 나트륨 섭취량을 2,000mg 이하로 제한하세요.' }], avoidFoods: ['가공육', '패스트푸드'], recommendFoods: ['현미밥', '채소', '두부'] }) },
    { residentId: resident3.id, type: 'EXERCISE', content: JSON.stringify({ title: '관절 건강 맞춤 운동 가이드', summary: '관절에 부담이 적은 수중 운동을 권장합니다.', recommendations: [{ priority: 'HIGH', category: '저충격 운동', detail: '수중 운동을 주 3회 이상 권장합니다.' }], avoidExercises: ['달리기', '점프'], recommendExercises: ['수중 운동', '고정 자전거'], schedule: '주 5회, 하루 30분' }) },
  ]});

  await prisma.activityLog.createMany({ data: [
    { adminId: director.id, action: 'LOGIN', details: '시설장 로그인' },
    { adminId: nurseKim.id, action: 'HEALTH_RECORD_CREATE', targetType: 'Resident', targetId: resident1.id, details: `${resident1.name} 건강 기록 입력` },
  ]});

  console.log('');
  console.log('=== 케어닥 케어홈 배곧신도시점 시드 데이터 생성 완료! ===');
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
