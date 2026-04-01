// 케어닥 케어홈 배곧신도시점 - 통합 가상 데이터
// 시드 데이터(run-seed.ts) 기준 10명의 입주자 + 5명의 직원 정보

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
  {
    id: 'r1', name: '김영순', birthDate: '1942-03-15', age: 84, gender: 'FEMALE',
    roomNumber: '101', building: '1관', moveInDate: '2022-01-10', status: 'ACTIVE',
    height: 155, weight: 52, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['고혈압', '당뇨병'],
    medications: [
      { name: '암로디핀', dosage: '5mg', schedule: '아침', prescribedBy: '박내과', isActive: true },
      { name: '메트포르민', dosage: '500mg', schedule: '아침,저녁', prescribedBy: '박내과', isActive: true },
      { name: '아스피린', dosage: '100mg', schedule: '아침', prescribedBy: '박내과', isActive: true },
    ],
    emergencyContact: { name: '김철수', relationship: '아들', phone: '010-9876-5432' },
    allergies: ['페니실린', '새우'],
    dietaryRestrictions: ['저염식', '저당식'],
    healthScore: 72, careGrade: '3등급',
  },
  {
    id: 'r2', name: '이복자', birthDate: '1938-07-22', age: 88, gender: 'FEMALE',
    roomNumber: '103', building: '1관', moveInDate: '2021-06-15', status: 'ACTIVE',
    height: 150, weight: 48, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['치매', '심부전'],
    medications: [
      { name: '도네페질', dosage: '10mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
      { name: '푸로세미드', dosage: '40mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
    ],
    emergencyContact: { name: '이상훈', relationship: '아들', phone: '010-7654-3210' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)', '저염식'],
    healthScore: 58, careGrade: '2등급',
  },
  {
    id: 'r3', name: '박정호', birthDate: '1945-11-08', age: 80, gender: 'MALE',
    roomNumber: '105', building: '1관', moveInDate: '2023-02-20', status: 'ACTIVE',
    height: 168, weight: 65, mobilityLevel: 1, mobilityLabel: mobilityLabels[1],
    cognitiveLevel: 'NORMAL', cognitiveLabelKo: cognitiveLabelMap['NORMAL'],
    diseases: ['관절염', '골다공증'],
    medications: [
      { name: '셀레콕시브', dosage: '200mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
      { name: '알렌드론산', dosage: '70mg', schedule: '아침', prescribedBy: '정형외과', isActive: true },
    ],
    emergencyContact: { name: '박미선', relationship: '딸', phone: '010-6543-2109' },
    allergies: ['설폰아미드'],
    dietaryRestrictions: [],
    healthScore: 85, careGrade: '4등급',
  },
  {
    id: 'r4', name: '최순남', birthDate: '1940-05-30', age: 86, gender: 'FEMALE',
    roomNumber: '107', building: '1관', moveInDate: '2022-09-05', status: 'ACTIVE',
    height: 158, weight: 55, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'NORMAL', cognitiveLabelKo: cognitiveLabelMap['NORMAL'],
    diseases: ['뇌졸중', '고혈압'],
    medications: [
      { name: '클로피도그렐', dosage: '75mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
      { name: '아토르바스타틴', dosage: '20mg', schedule: '취침전', prescribedBy: '신경과', isActive: true },
    ],
    emergencyContact: { name: '최민호', relationship: '아들', phone: '010-4321-0987' },
    allergies: [],
    dietaryRestrictions: ['저지방식'],
    healthScore: 65, careGrade: '3등급',
  },
  {
    id: 'r5', name: '정기원', birthDate: '1948-09-12', age: 78, gender: 'MALE',
    roomNumber: '109', building: '1관', moveInDate: '2023-07-01', status: 'ACTIVE',
    height: 172, weight: 70, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['파킨슨병', '우울증'],
    medications: [
      { name: '레보도파/카르비도파', dosage: '100/25mg', schedule: '아침,점심,저녁', prescribedBy: '신경과', isActive: true },
      { name: '에스시탈로프람', dosage: '10mg', schedule: '아침', prescribedBy: '정신건강의학과', isActive: true },
    ],
    emergencyContact: { name: '정수진', relationship: '딸', phone: '010-3210-9876' },
    allergies: [],
    dietaryRestrictions: [],
    healthScore: 70, careGrade: '3등급',
  },
  {
    id: 'r6', name: '한말순', birthDate: '1936-01-20', age: 90, gender: 'FEMALE',
    roomNumber: '201', building: '2관', moveInDate: '2021-03-10', status: 'ACTIVE',
    height: 148, weight: 45, mobilityLevel: 4, mobilityLabel: mobilityLabels[4],
    cognitiveLevel: 'SEVERE', cognitiveLabelKo: cognitiveLabelMap['SEVERE'],
    diseases: ['치매', '골다공증'],
    medications: [
      { name: '메만틴', dosage: '20mg', schedule: '아침', prescribedBy: '신경과', isActive: true },
    ],
    emergencyContact: { name: '한지훈', relationship: '손자', phone: '010-1111-2222' },
    allergies: [],
    dietaryRestrictions: ['연하식(미음)'],
    healthScore: 42, careGrade: '1등급',
  },
  {
    id: 'r7', name: '오세진', birthDate: '1950-06-05', age: 76, gender: 'MALE',
    roomNumber: '203', building: '2관', moveInDate: '2024-01-15', status: 'ACTIVE',
    height: 175, weight: 80, mobilityLevel: 1, mobilityLabel: mobilityLabels[1],
    cognitiveLevel: 'NORMAL', cognitiveLabelKo: cognitiveLabelMap['NORMAL'],
    diseases: ['만성폐쇄성폐질환', '고혈압'],
    medications: [
      { name: '티오트로피움', dosage: '18mcg', schedule: '아침', prescribedBy: '호흡기내과', isActive: true },
      { name: '발사르탄', dosage: '80mg', schedule: '아침', prescribedBy: '내과', isActive: true },
    ],
    emergencyContact: { name: '오수빈', relationship: '딸', phone: '010-3333-4444' },
    allergies: ['땅콩'],
    dietaryRestrictions: [],
    healthScore: 78, careGrade: '4등급',
  },
  {
    id: 'r8', name: '송미경', birthDate: '1944-12-18', age: 82, gender: 'FEMALE',
    roomNumber: '205', building: '2관', moveInDate: '2023-05-20', status: 'HOSPITALIZED',
    height: 160, weight: 58, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'MILD', cognitiveLabelKo: cognitiveLabelMap['MILD'],
    diseases: ['심부전', '당뇨병'],
    medications: [
      { name: '엔알라프릴', dosage: '5mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
      { name: '글리메피리드', dosage: '2mg', schedule: '아침', prescribedBy: '내분비내과', isActive: true },
      { name: '스피로놀락톤', dosage: '25mg', schedule: '아침', prescribedBy: '심장내과', isActive: true },
    ],
    emergencyContact: { name: '송현우', relationship: '아들', phone: '010-5555-6666' },
    allergies: [],
    dietaryRestrictions: ['저단백식', '저염식'],
    healthScore: 48, careGrade: '2등급',
  },
  {
    id: 'r9', name: '윤태식', birthDate: '1947-08-25', age: 79, gender: 'MALE',
    roomNumber: '207', building: '2관', moveInDate: '2022-11-01', status: 'ACTIVE',
    height: 165, weight: 58, mobilityLevel: 3, mobilityLabel: mobilityLabels[3],
    cognitiveLevel: 'MODERATE', cognitiveLabelKo: cognitiveLabelMap['MODERATE'],
    diseases: ['뇌졸중', '치매'],
    medications: [
      { name: '와파린', dosage: '3mg', schedule: '저녁', prescribedBy: '신경과', isActive: true },
      { name: '리바스티그민', dosage: '6mg', schedule: '아침,저녁', prescribedBy: '신경과', isActive: true },
    ],
    emergencyContact: { name: '윤지영', relationship: '딸', phone: '010-6666-7777' },
    allergies: [],
    dietaryRestrictions: ['연하식(다진식)'],
    healthScore: 55, careGrade: '2등급',
  },
  {
    id: 'r10', name: '강옥희', birthDate: '1943-04-02', age: 83, gender: 'FEMALE',
    roomNumber: '209', building: '2관', moveInDate: '2024-06-10', status: 'ACTIVE',
    height: 153, weight: 50, mobilityLevel: 2, mobilityLabel: mobilityLabels[2],
    cognitiveLevel: 'NORMAL', cognitiveLabelKo: cognitiveLabelMap['NORMAL'],
    diseases: ['관절염', '우울증'],
    medications: [
      { name: '트라마돌', dosage: '50mg', schedule: '아침,저녁', prescribedBy: '정형외과', isActive: true },
      { name: '세르트랄린', dosage: '50mg', schedule: '아침', prescribedBy: '정신건강의학과', isActive: true },
    ],
    emergencyContact: { name: '강준호', relationship: '아들', phone: '010-8888-9999' },
    allergies: ['아스피린', '복숭아'],
    dietaryRestrictions: ['저지방식', '저당식'],
    healthScore: 74, careGrade: '3등급',
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

// 호실 정보 (1관 18호, 2관 18호 = 총 36호)
export interface MockRoom {
  id: string;
  building: string;
  floor: number;
  roomNumber: string;
  type: '1인실' | '2인실';
  status: '사용중' | '빈방' | '수리중';
  residentName?: string;
  residentId?: string;
}

export const rooms: MockRoom[] = (() => {
  const result: MockRoom[] = [];
  const bldgs = ['1관', '2관'];
  const baseNums = { '1관': 100, '2관': 200 };
  for (const bldg of bldgs) {
    for (let floor = 1; floor <= 3; floor++) {
      for (let room = 1; room <= 6; room++) {
        const num = String(baseNums[bldg as keyof typeof baseNums] + (floor - 1) * 10 + room);
        const matched = residents.find(r => r.roomNumber === num);
        result.push({
          id: `room-${num}`,
          building: bldg,
          floor,
          roomNumber: num,
          type: room <= 3 ? '1인실' : '2인실',
          status: matched ? '사용중' : (num === '112' || num === '212' ? '수리중' : '빈방'),
          residentName: matched?.name,
          residentId: matched?.id,
        });
      }
    }
  }
  return result;
})();

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
