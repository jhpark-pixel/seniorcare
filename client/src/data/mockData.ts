// 케어닥 케어홈 송추점 - 통합 가상 데이터
// 시드 데이터(run-seed.ts) 기준 25명의 입주자 + 5명의 직원 정보

export interface MockResident {
  id: string;
  name: string;
  birthDate: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  roomNumber: string;
  building: string;
  moveInDate: string;
  status: 'ACTIVE' | 'HOSPITALIZED' | 'OUTING' | 'DISCHARGED';
  height: number;
  weight: number;
  mobilityLevel: number;
  mobilityLabel: string;
  cognitiveLevel: string;
  cognitiveLabelKo: string;
  diseases: string[];
  medications: MockMedication[];
  emergencyContact: { name: string; relationship: string; phone: string };
  allergies: string[];
  dietaryRestrictions: string[];
  healthScore: number;
  careGrade: string;
}

export interface MockMedication {
  name: string;
  dosage: string;
  schedule: string;
  prescribedBy: string;
  isActive: boolean;
}

export interface MockStaff {
  id: string;
  username: string;
  name: string;
  role: string;
  roleLabel: string;
  email: string;
  phone: string;
}

const mobilityLabels: Record<number, string> = {
  1: '자유보행',
  2: '부분보조',
  3: '휠체어필요',
  4: '거동불편',
};

const cognitiveLabelMap: Record<string, string> = {
  NORMAL: '정상',
  MILD: '경도',
  MODERATE: '중등도',
  SEVERE: '중증',
};

export const residents: MockResident[] = [
  // #1 강정순 - 94세 여성, 301호 특실
  {
    id: 'r1', name: '강정순', birthDate: '1931-10-20', age: 94, gender: 'FEMALE',
    roomNumber: '301', building: '3층', moveInDate: '2024-01-31', status: 'ACTIVE',
    height: 148, weight: 44, mobilityLevel: 4, mobilityLabel: mobilityLabels[4],
    cognitiveLevel: 'SEVERE', cognitiveLabelKo: cognitiveLabelMap['SEVERE'],
    diseases: ['치매', '고혈압', '골다공증'],
    medications: [
      { name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '강민준', relationship: '아들', phone: '010-2341-5678' },
    allergies: [],
    dietaryRestrictions: ['연하식(미음)', '저염식'],
    healthScore: 42, careGrade: '등급외',
  },
  // #2 강한석 - 89세 남성, 405호 1인실
  {
    id: 'r2', name: '강한석', birthDate: '1936-06-22', age: 89, gender: 'MALE',
    roomNumber: '405', building: '4층', moveInDate: '2023-12-10', status: 'ACTIVE',
    height: 165, weight: 60, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['치매', '고혈압'],
    medications: [
      { name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
      { name: '발사르탄', dosage: '80mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '강선희', relationship: '딸', phone: '010-3452-6789' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)'],
    healthScore: 55, careGrade: '등급외',
  },
  // #3 구자윤 - 92세 남성, 309호 2인실
  {
    id: 'r3', name: '구자윤', birthDate: '1934-02-01', age: 92, gender: 'MALE',
    roomNumber: '309', building: '3층', moveInDate: '2024-02-24', status: 'ACTIVE',
    height: 163, weight: 58, mobilityLevel: 4, mobilityLabel: mobilityLabels[4],
    cognitiveLevel: 'SEVERE', cognitiveLabelKo: cognitiveLabelMap['SEVERE'],
    diseases: ['치매', '심부전', '골다공증'],
    medications: [
      { name: '리바스티그민', dosage: '6mg', schedule: '아침,저녁', prescribedBy: '신경과', isActive: true },
      { name: '푸로세미드', dosage: '40mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '구본철', relationship: '아들', phone: '010-4563-7890' },
    allergies: [],
    dietaryRestrictions: ['연하식(미음)', '저염식'],
    healthScore: 43, careGrade: '등급외',
  },
  // #4 김복자 - 81세 여성, 305호 1인실
  {
    id: 'r4', name: '김복자', birthDate: '1944-10-30', age: 81, gender: 'FEMALE',
    roomNumber: '305', building: '3층', moveInDate: '2025-11-16', status: 'ACTIVE',
    height: 153, weight: 52, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['고혈압', '관절염'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '셀레콕시브', dosage: '200mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '이정호', relationship: '아들', phone: '010-5674-8901' },
    allergies: [],
    dietaryRestrictions: ['저염식'],
    healthScore: 72, careGrade: '등급외',
  },
  // #5 김옥희 - 87세 여성, 406호 1인실
  {
    id: 'r5', name: '김옥희', birthDate: '1938-03-28', age: 87, gender: 'FEMALE',
    roomNumber: '406', building: '4층', moveInDate: '2024-01-19', status: 'ACTIVE',
    height: 151, weight: 47, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['치매', '골다공증'],
    medications: [
      { name: '도네페질', dosage: '5mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '박성훈', relationship: '아들', phone: '010-6785-9012' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)'],
    healthScore: 58, careGrade: '등급외',
  },
  // #6 박복순 - 99세 여성, 202호 1인실 (퇴소)
  {
    id: 'r6', name: '박복순', birthDate: '1926-09-17', age: 99, gender: 'FEMALE',
    roomNumber: '202', building: '2층', moveInDate: '2024-07-20', status: 'DISCHARGED',
    height: 143, weight: 38, mobilityLevel: 4, mobilityLabel: mobilityLabels[4],
    cognitiveLevel: 'SEVERE', cognitiveLabelKo: cognitiveLabelMap['SEVERE'],
    diseases: ['치매', '고혈압', '심부전'],
    medications: [
      { name: '메만틴', dosage: '10mg', schedule: '아침', prescribedBy: '신경과', isActive: false },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: false },
    ],
    emergencyContact: { name: '박영수', relationship: '아들', phone: '010-7896-0123' },
    allergies: [],
    dietaryRestrictions: ['연하식(미음)'],
    healthScore: 40, careGrade: '등급외',
  },
  // #7 박정희 - 92세 여성, 205호 1인실
  {
    id: 'r7', name: '박정희', birthDate: '1934-01-17', age: 92, gender: 'FEMALE',
    roomNumber: '205', building: '2층', moveInDate: '2025-04-25', status: 'ACTIVE',
    height: 150, weight: 46, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'SEVERE', cognitiveLabelKo: cognitiveLabelMap['SEVERE'],
    diseases: ['치매', '고혈압', '골다공증'],
    medications: [
      { name: '리바스티그민', dosage: '4.6mg', schedule: '아침,저녁', prescribedBy: '신경과', isActive: true },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '박용철', relationship: '아들', phone: '010-8907-1234' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)', '저염식'],
    healthScore: 44, careGrade: '등급외',
  },
  // #8 서향숙 - 78세 여성, 207호 특실
  {
    id: 'r8', name: '서향숙', birthDate: '1947-02-10', age: 78, gender: 'FEMALE',
    roomNumber: '207', building: '2층', moveInDate: '2024-05-19', status: 'ACTIVE',
    height: 157, weight: 56, mobilityLevel: 1, mobilityLabel: mobilityLabels[1],
    cognitiveLevel: 'NORMAL', cognitiveLabelKo: cognitiveLabelMap['NORMAL'],
    diseases: ['관절염'],
    medications: [
      { name: '셀레콕시브', dosage: '200mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '서민호', relationship: '아들', phone: '010-9018-2345' },
    allergies: [],
    dietaryRestrictions: [],
    healthScore: 82, careGrade: '등급외',
  },
  // #9 성기철 - 85세 남성, 303호 2인실
  {
    id: 'r9', name: '성기철', birthDate: '1941-01-07', age: 85, gender: 'MALE',
    roomNumber: '303', building: '3층', moveInDate: '2024-01-23', status: 'ACTIVE',
    height: 167, weight: 63, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['고혈압', '당뇨병'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '메트포르민', dosage: '500mg', schedule: '아침,저녁', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '성유리', relationship: '딸', phone: '010-1129-3456' },
    allergies: [],
    dietaryRestrictions: ['저염식', '저당식'],
    healthScore: 65, careGrade: '등급외',
  },
  // #10 송영화 - 86세 남성, 203호 2인실
  {
    id: 'r10', name: '송영화', birthDate: '1939-10-04', age: 86, gender: 'MALE',
    roomNumber: '203', building: '2층', moveInDate: '2024-09-11', status: 'ACTIVE',
    height: 169, weight: 64, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['고혈압', '골다공증'],
    medications: [
      { name: '발사르탄', dosage: '80mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '송지혜', relationship: '딸', phone: '010-2230-4567' },
    allergies: [],
    dietaryRestrictions: ['저염식'],
    healthScore: 62, careGrade: '등급외',
  },
  // #11 오윤희 - 67세 남성, 401호 1인실
  {
    id: 'r11', name: '오윤희', birthDate: '1958-08-30', age: 67, gender: 'MALE',
    roomNumber: '401', building: '4층', moveInDate: '2026-02-01', status: 'ACTIVE',
    height: 170, weight: 68, mobilityLevel: 1, mobilityLabel: mobilityLabels[1],
    cognitiveLevel: 'NORMAL', cognitiveLabelKo: cognitiveLabelMap['NORMAL'],
    diseases: ['고혈압'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '오수정', relationship: '딸', phone: '010-3341-5678' },
    allergies: [],
    dietaryRestrictions: ['저염식'],
    healthScore: 85, careGrade: '등급외',
  },
  // #12 이선규 - 88세 여성, 212호 1인실
  {
    id: 'r12', name: '이선규', birthDate: '1937-11-20', age: 88, gender: 'FEMALE',
    roomNumber: '212', building: '2층', moveInDate: '2025-07-15', status: 'ACTIVE',
    height: 152, weight: 49, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['치매', '심부전'],
    medications: [
      { name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
      { name: '스피로놀락톤', dosage: '25mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
    ],
    emergencyContact: { name: '이준기', relationship: '아들', phone: '010-4452-6789' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)', '저염식'],
    healthScore: 56, careGrade: '등급외',
  },
  // #13 이창진 - 89세 여성, 309호 2인실
  {
    id: 'r13', name: '이창진', birthDate: '1936-03-10', age: 89, gender: 'FEMALE',
    roomNumber: '309', building: '3층', moveInDate: '2024-02-24', status: 'ACTIVE',
    height: 149, weight: 45, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['치매', '고혈압'],
    medications: [
      { name: '메만틴', dosage: '10mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '이성민', relationship: '아들', phone: '010-5563-7890' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)'],
    healthScore: 57, careGrade: '등급외',
  },
  // #14 정정자 - 84세 여성, 203호 2인실
  {
    id: 'r14', name: '정정자', birthDate: '1941-03-01', age: 84, gender: 'FEMALE',
    roomNumber: '203', building: '2층', moveInDate: '2024-09-11', status: 'ACTIVE',
    height: 154, weight: 51, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['고혈압', '골다공증'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '정유진', relationship: '딸', phone: '010-6674-8901' },
    allergies: [],
    dietaryRestrictions: ['저염식'],
    healthScore: 70, careGrade: '등급외',
  },
  // #15 조병현 - 82세 남성, 209호 2인실 (4등급)
  {
    id: 'r15', name: '조병현', birthDate: '1943-04-20', age: 82, gender: 'MALE',
    roomNumber: '209', building: '2층', moveInDate: '2025-07-19', status: 'ACTIVE',
    height: 164, weight: 60, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['치매', '고혈압'],
    medications: [
      { name: '도네페질', dosage: '5mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '조현우', relationship: '아들', phone: '010-7785-9012' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)'],
    healthScore: 68, careGrade: '4등급',
  },
  // #16 조용근 - 94세 남성, 408호 1인실
  {
    id: 'r16', name: '조용근', birthDate: '1931-07-18', age: 94, gender: 'MALE',
    roomNumber: '408', building: '4층', moveInDate: '2025-06-27', status: 'ACTIVE',
    height: 160, weight: 55, mobilityLevel: 4, mobilityLabel: mobilityLabels[4],
    cognitiveLevel: 'SEVERE', cognitiveLabelKo: cognitiveLabelMap['SEVERE'],
    diseases: ['치매', '심부전', '골다공증'],
    medications: [
      { name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
      { name: '푸로세미드', dosage: '40mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '조민석', relationship: '아들', phone: '010-8896-0123' },
    allergies: [],
    dietaryRestrictions: ['연하식(미음)', '저염식'],
    healthScore: 41, careGrade: '등급외',
  },
  // #17 최난숙 - 89세 여성, 206호 1인실
  {
    id: 'r17', name: '최난숙', birthDate: '1936-09-01', age: 89, gender: 'FEMALE',
    roomNumber: '206', building: '2층', moveInDate: '2025-04-17', status: 'ACTIVE',
    height: 150, weight: 46, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['치매', '고혈압'],
    medications: [
      { name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
      { name: '발사르탄', dosage: '80mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '최병훈', relationship: '아들', phone: '010-9907-1234' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)', '저염식'],
    healthScore: 57, careGrade: '등급외',
  },
  // #18 최윤언 - 85세 남성, 412호 1인실
  {
    id: 'r18', name: '최윤언', birthDate: '1941-03-15', age: 85, gender: 'MALE',
    roomNumber: '412', building: '4층', moveInDate: '2024-01-29', status: 'ACTIVE',
    height: 166, weight: 62, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['고혈압', '당뇨병'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '글리메피리드', dosage: '2mg', schedule: '아침', prescribedBy: '내분비내과', isActive: true },
    ],
    emergencyContact: { name: '최수진', relationship: '딸', phone: '010-1018-2345' },
    allergies: [],
    dietaryRestrictions: ['저염식', '저당식'],
    healthScore: 67, careGrade: '등급외',
  },
  // #19 최종현 - 93세 여성, 410호 1인실
  {
    id: 'r19', name: '최종현', birthDate: '1933-05-10', age: 93, gender: 'FEMALE',
    roomNumber: '410', building: '4층', moveInDate: '2024-09-18', status: 'ACTIVE',
    height: 147, weight: 43, mobilityLevel: 4, mobilityLabel: mobilityLabels[4],
    cognitiveLevel: 'SEVERE', cognitiveLabelKo: cognitiveLabelMap['SEVERE'],
    diseases: ['치매', '고혈압', '심부전'],
    medications: [
      { name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '푸로세미드', dosage: '40mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
    ],
    emergencyContact: { name: '최영민', relationship: '아들', phone: '010-2129-3456' },
    allergies: [],
    dietaryRestrictions: ['연하식(미음)', '저염식'],
    healthScore: 41, careGrade: '등급외',
  },
  // #20 최형수 - 84세 남성, 307호 특실
  {
    id: 'r20', name: '최형수', birthDate: '1942-08-22', age: 84, gender: 'MALE',
    roomNumber: '307', building: '3층', moveInDate: '2023-12-25', status: 'ACTIVE',
    height: 168, weight: 65, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['고혈압', '관절염'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '트라마돌', dosage: '50mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '최지연', relationship: '딸', phone: '010-3230-4567' },
    allergies: [],
    dietaryRestrictions: ['저염식'],
    healthScore: 71, careGrade: '등급외',
  },
  // #21 하혜숙 - 80세 여성, 303호 2인실
  {
    id: 'r21', name: '하혜숙', birthDate: '1945-12-18', age: 80, gender: 'FEMALE',
    roomNumber: '303', building: '3층', moveInDate: '2024-01-23', status: 'ACTIVE',
    height: 155, weight: 53, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['고혈압', '골다공증'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '하성민', relationship: '아들', phone: '010-4341-5678' },
    allergies: [],
    dietaryRestrictions: ['저염식'],
    healthScore: 75, careGrade: '등급외',
  },
  // #22 한대현 - 92세 남성, 402호 1인실
  {
    id: 'r22', name: '한대현', birthDate: '1933-12-05', age: 92, gender: 'MALE',
    roomNumber: '402', building: '4층', moveInDate: '2025-04-20', status: 'ACTIVE',
    height: 161, weight: 57, mobilityLevel: 4, mobilityLabel: mobilityLabels[4],
    cognitiveLevel: 'SEVERE', cognitiveLabelKo: cognitiveLabelMap['SEVERE'],
    diseases: ['치매', '고혈압', '골다공증'],
    medications: [
      { name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '한진수', relationship: '아들', phone: '010-5452-6789' },
    allergies: [],
    dietaryRestrictions: ['연하식(미음)', '저염식'],
    healthScore: 43, careGrade: '등급외',
  },
  // #23 허금순 - 80세 여성, 209호 2인실 (3등급)
  {
    id: 'r23', name: '허금순', birthDate: '1945-08-03', age: 80, gender: 'FEMALE',
    roomNumber: '209', building: '2층', moveInDate: '2025-07-19', status: 'ACTIVE',
    height: 154, weight: 54, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['관절염', '고혈압'],
    medications: [
      { name: '셀레콕시브', dosage: '200mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '허태준', relationship: '아들', phone: '010-6563-7890' },
    allergies: [],
    dietaryRestrictions: ['저염식'],
    healthScore: 76, careGrade: '3등급',
  },
  // #24 허용오 - 90세 남성, 201호 특실
  {
    id: 'r24', name: '허용오', birthDate: '1935-07-12', age: 90, gender: 'MALE',
    roomNumber: '201', building: '2층', moveInDate: '2025-07-15', status: 'ACTIVE',
    height: 162, weight: 56, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['치매', '고혈압'],
    medications: [
      { name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '허미영', relationship: '딸', phone: '010-7674-8901' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)', '저염식'],
    healthScore: 52, careGrade: '등급외',
  },
  // #25 홍영자 - 80세 여성, 411호 1인실
  {
    id: 'r25', name: '홍영자', birthDate: '1946-04-15', age: 80, gender: 'FEMALE',
    roomNumber: '411', building: '4층', moveInDate: '2025-11-21', status: 'ACTIVE',
    height: 156, weight: 54, mobilityLevel: 1, mobilityLabel: mobilityLabels[1],
    cognitiveLevel: 'NORMAL', cognitiveLabelKo: cognitiveLabelMap['NORMAL'],
    diseases: ['고혈압'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '홍준혁', relationship: '아들', phone: '010-8785-9012' },
    allergies: [],
    dietaryRestrictions: ['저염식'],
    healthScore: 80, careGrade: '등급외',
  },
];

export const activeResidents = residents.filter(r => r.status !== 'DISCHARGED');

export const staff: MockStaff[] = [
  { id: 's1', username: 'director', name: '박준혁', role: 'DIRECTOR', roleLabel: '시설장', email: 'director@caredochome.co.kr', phone: '031-431-7700' },
  { id: 's2', username: 'nurse_kim', name: '김서연', role: 'NURSE', roleLabel: '간호사', email: 'nurse.kim@caredochome.co.kr', phone: '031-431-7701' },
  { id: 's3', username: 'nurse_lee', name: '이하은', role: 'NURSE', roleLabel: '간호사', email: 'nurse.lee@caredochome.co.kr', phone: '031-431-7702' },
  { id: 's4', username: 'social_choi', name: '최민정', role: 'SOCIAL_WORKER', roleLabel: '생활지도사', email: 'social.choi@caredochome.co.kr', phone: '031-431-7703' },
  { id: 's5', username: 'social_park', name: '박은지', role: 'SOCIAL_WORKER', roleLabel: '생활지도사', email: 'social.park@caredochome.co.kr', phone: '031-431-7704' },
];

// 호실 정보 - 송추점 (2층/3층/4층)
export interface MockRoom {
  id: string;
  building: string;
  floor: number;
  roomNumber: string;
  type: '1인실' | '2인실' | '특실';
  status: '사용중' | '빈방' | '수리중';
  residentName?: string;
  residentId?: string;
}

// 송추점 실제 호실 목록
const songchuRooms: { num: string; floor: number; type: '1인실' | '2인실' | '특실' }[] = [
  // 2층
  { num: '201', floor: 2, type: '특실' },
  { num: '202', floor: 2, type: '1인실' },
  { num: '203', floor: 2, type: '2인실' },
  { num: '204', floor: 2, type: '1인실' },
  { num: '205', floor: 2, type: '1인실' },
  { num: '206', floor: 2, type: '1인실' },
  { num: '207', floor: 2, type: '특실' },
  { num: '208', floor: 2, type: '1인실' },
  { num: '209', floor: 2, type: '2인실' },
  { num: '210', floor: 2, type: '1인실' },
  { num: '211', floor: 2, type: '1인실' },
  { num: '212', floor: 2, type: '1인실' },
  // 3층
  { num: '301', floor: 3, type: '특실' },
  { num: '302', floor: 3, type: '1인실' },
  { num: '303', floor: 3, type: '2인실' },
  { num: '304', floor: 3, type: '1인실' },
  { num: '305', floor: 3, type: '1인실' },
  { num: '306', floor: 3, type: '1인실' },
  { num: '307', floor: 3, type: '특실' },
  { num: '308', floor: 3, type: '1인실' },
  { num: '309', floor: 3, type: '2인실' },
  // 4층
  { num: '401', floor: 4, type: '1인실' },
  { num: '402', floor: 4, type: '1인실' },
  { num: '403', floor: 4, type: '1인실' },
  { num: '404', floor: 4, type: '1인실' },
  { num: '405', floor: 4, type: '1인실' },
  { num: '406', floor: 4, type: '1인실' },
  { num: '407', floor: 4, type: '1인실' },
  { num: '408', floor: 4, type: '1인실' },
  { num: '409', floor: 4, type: '1인실' },
  { num: '410', floor: 4, type: '1인실' },
  { num: '411', floor: 4, type: '1인실' },
  { num: '412', floor: 4, type: '1인실' },
];

export const rooms: MockRoom[] = songchuRooms.map(r => {
  const matched = residents.find(res => res.roomNumber === r.num && res.status !== 'DISCHARGED');
  return {
    id: `room-${r.num}`,
    building: `${r.floor}층`,
    floor: r.floor,
    roomNumber: r.num,
    type: r.type,
    status: matched ? '사용중' : '빈방',
    residentName: matched?.name,
    residentId: matched?.id,
  };
});

// 유틸 함수
export function getResidentByRoom(roomNumber: string): MockResident | undefined {
  return residents.find(r => r.roomNumber === roomNumber);
}

export function getResidentById(id: string): MockResident | undefined {
  return residents.find(r => r.id === id);
}

export function getResidentByName(name: string): MockResident | undefined {
  return residents.find(r => r.name === name);
}

// 날짜 유틸
export function formatDateKo(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function daysAgo(days: number): string {
  return daysFromNow(-days);
}

// 상태 뱃지 색상
export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE': case '활성': case '완납': case '진행중': case '사용중': case '계약중': case '승인':
      return 'bg-green-100 text-green-800';
    case 'HOSPITALIZED': case '입원': case '미납': case '대기': case '접수': case '심사중':
      return 'bg-yellow-100 text-yellow-800';
    case 'OUTING': case '외출': case '외박':
      return 'bg-blue-100 text-blue-800';
    case 'DISCHARGED': case '퇴소': case '중단': case '반려': case '만료':
      return 'bg-red-100 text-red-800';
    case '수리중':
      return 'bg-orange-100 text-orange-800';
    case '빈방':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// ID 생성
let idCounter = 1000;
export function generateId(prefix = 'item'): string {
  return `${prefix}-${++idCounter}`;
}
