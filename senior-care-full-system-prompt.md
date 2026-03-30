# 시니어 주거시설 통합 관리 시스템 (ERP) — Claude Code 프롬프트

아래 `---` 이후 전체를 Claude Code에 붙여넣으세요.

---

시니어(고령자) 주거시설 통합 관리 ERP 시스템을 풀스택으로 개발해줘.
기존 케어닥(CareDoc) 시스템의 구조를 참고하되, IoT 낙상감지 + AI 건강분석 + 프로그램 추천까지 확장한다.

## 기술 스택

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- DB: SQLite (개발) / PostgreSQL (운영)
- ORM: Prisma
- 차트: Recharts
- 실시간: Socket.IO
- PDF: pdfkit
- 인증: JWT
- 한국어 UI, 반응형

## 프로젝트 구조

```
/senior-care-erp
  /client
    /src
      /pages          (각 메뉴별 페이지)
      /components     (공용 컴포넌트)
      /layouts        (레이아웃: 사이드바+헤더+메인)
      /hooks
      /utils
      /types
  /server
    /src
      /routes
      /controllers
      /services       (비즈니스 로직)
      /middleware
      /utils
  /prisma
  /iot-simulator
```

---

## 전체 메뉴 구조 (상단 탭 + 좌측 사이드바)

아래 메뉴 구조를 정확히 반영해서 라우팅과 네비게이션을 만들어줘.

### 탭 1. 입소자관리

**좌측 메뉴:**

```
📋 상담관리
  ├─ 상담등록
  ├─ 상담일정조회
  ├─ 상담내역조회
  └─ 상담유형별 상담자현황

📝 청약관리
  ├─ 청약서등록 및 조회
  ├─ 청약금입금 및 조회
  └─ 청약자가입현황

📄 계약관리
  ├─ 계약서등록 및 조회
  ├─ 보증금입금 및 조회
  └─ 계약자현황

🏠 입소관리
  ├─ 입소자등록
  └─ 입퇴소자현황

💰 청구관리
  ├─ 월청구내역
  ├─ 월청구산출 (일반관리비)
  ├─ 월청구산출 (식사비)
  ├─ 월청구산출 (수도광열비)
  └─ 월청구내역현황

🚗 장기외출
  └─ 장기외출신청등록

🏢 시설자산관리
  ├─ 비품/자산대장
  └─ 비품/자산 유지보수 요청서

🔄 재계약관리
  └─ 재계약대상자조회

🚪 퇴소관리
  └─ 퇴소신청

💳 정산관리
  ├─ 입퇴소보증금 정산관리
  └─ 입퇴소보증금 입금관리
```

### 탭 2. 건강관리

```
❤️ 건강기록
  ├─ 일일 바이탈사인 입력
  ├─ 건강기록 이력조회
  └─ 건강기록 일괄입력

🏥 건강상담
  ├─ 건강상담 예약등록
  ├─ 건강상담 예약현황
  └─ 건강상담 내역조회

🔬 정기검진
  ├─ 검진일정 관리
  ├─ 검진결과 입력
  └─ 검진이력 조회

💊 투약관리
  ├─ 처방약물 등록
  ├─ 투약스케줄 관리
  └─ 투약이력 조회

🩺 집중케어
  ├─ 집중케어대상자 등록
  ├─ 집중케어대상자 현황
  └─ 집중케어 디바이스 관리

📊 건강분석 (AI)
  ├─ 개인 건강분석표
  ├─ 전체 입주자 건강 대시보드
  └─ AI 맞춤 가이드 (식단/운동/생활)
```

### 탭 3. 컨시어지

```
🛎️ 서비스신청
  ├─ 서비스 신청등록
  ├─ 서비스 신청현황
  └─ 서비스 유형관리

🏥 병원동행
  ├─ 병원동행 신청
  ├─ 병원동행 일정
  └─ 병원동행 이력

📮 민원관리
  ├─ 민원접수
  ├─ 민원처리현황
  └─ 민원통계
```

### 탭 4. 커뮤니티

```
📅 프로그램관리
  ├─ 프로그램 등록/관리
  ├─ 프로그램 일정표 (캘린더)
  ├─ 참여자 관리 및 출석
  └─ AI 프로그램 추천

📢 공지사항
  ├─ 공지사항 등록
  └─ 공지사항 목록

🎉 월간행사
  ├─ 행사계획 등록
  └─ 행사계획 현황
```

### 탭 5. 식사관리 (F8)

```
🍽️ 식단관리
  ├─ 주간식단 등록
  ├─ 식단표 조회
  └─ AI 맞춤식단 추천

🥗 특별식 관리
  ├─ 특별식 대상자 (질환별)
  ├─ 특별식 유형 관리 (저염/저당/연하곤란 등)
  └─ 특별식 신청현황

📊 식사통계
  ├─ 일별 식수인원
  └─ 월별 식사비 산출
```

### 탭 6. 시설관리

```
🏗️ 호실관리
  ├─ 동/호실 현황
  ├─ 호실배정 관리
  └─ 호실점검 이력

🔧 유지보수
  ├─ 보수요청 등록
  ├─ 보수진행 현황
  └─ 보수이력 조회

📡 IoT 장치관리
  ├─ 장치등록 및 현황
  ├─ 장치상태 모니터링
  └─ 장치알림 설정
```

### 탭 7. 경영통계

```
📈 입소현황 통계
  ├─ 거주자현황 (동별/타입별 세대수, 계약률, 입주율)
  ├─ 입퇴소 추이
  └─ 계약/청약 현황

💹 매출통계
  ├─ 월별 매출현황
  ├─ 항목별 매출 (관리비/식사비/서비스비)
  └─ 미수금 현황

📊 건강통계
  ├─ 질환별 입주자 분포
  ├─ 서비스신청 현황 (고혈압/당뇨/신장/저작곤란/병원동행/민원)
  ├─ 건강상담 실적 (당일/당월/반기)
  └─ 낙상사고 통계
```

### 탭 8. 경영관리자

```
👤 직원관리
  ├─ 직원등록/조회
  ├─ 근무스케줄
  └─ 권한관리

⚙️ 시스템설정
  ├─ 기본정보 설정 (시설명, 주소 등)
  ├─ 코드관리 (질환코드, 서비스코드 등)
  └─ 알림설정
```

---

## 홈 대시보드 (HOME)

로그인 후 첫 화면. 아래 7개 위젯을 그리드 레이아웃으로 배치:

### 위젯 1: 응급 및 안전 사고 발생 (주간)
- 테이블 컬럼: 발생일시 | 동호수 | 사고자명 | 발생장소 | 사고내용 | 조치사항 | 조치결과 | 보호자연락 | 처리완료 | 담당자
- 최근 7일 데이터 표시
- 처리완료 여부 토글

### 위젯 2: 집중케어대상자 현황 (오늘 날짜)
- 테이블 컬럼: 동호수 | 대상자 | 성별 | 연령 | 관리사유 | 관리기간(시작~종료) | 관리등급 | 연락처 | 보호자 | 보호자연락처
- 현재 집중케어 등록자만 표시

### 위젯 3: 집중케어 디바이스 관리
- 테이블 컬럼: 발생일시 | 디바이스번호 | 동호수 | 성명 | 관리사유 | 혈압(고) | 혈압(저) | 심박 | 혈당 | 수면장애
- IoT 디바이스에서 수집된 최근 이상 데이터
- 이상치는 빨간색 강조

### 위젯 4: 건강 상담 예약 현황 (오늘 날짜)
- 테이블 형태:
  | 구분 | 건강상담 | 외래 | 정기검진 | 체육운전 | 약역관련 | 합계 |
  |------|---------|------|---------|---------|---------|------|
  | 당일계획 | | | | | | |
  | 당월실적 | | | | | | |
  | 반기실적 | | | | | | |
- 숫자 클릭 시 해당 상세 목록으로 이동

### 위젯 5: 서비스 신청 현황
- 상단에 오늘 신청 건수 뱃지 (컬러: 초록/주황/빨강)
- 테이블:
  | 구분 | 고혈압 | 당뇨 | 신장 | 저작곤란 | 병원동행 | 민원신청 |
  |------|-------|------|------|---------|---------|---------|
  | 전일 | | | | | | |
  | 금주 | | | | | | |
  | 월간 | | | | | | |

### 위젯 6: 거주자 현황 (오늘 날짜)
- 테이블:
  | 동분류 | 타입구분 | 세대수 | 계약세대수 | 계약률(%) | 입주세대수 | 입주율(%) | 입주자수 |
  |-------|---------|-------|----------|----------|----------|----------|---------|
  | A동 | 1인실 | 36 | | | | | |
  | A동 | 2인실 | 6 | | | | | |
  | 합계 | | 42 | | | | | |
- 동/타입별 소계 및 합계 자동 계산

### 위젯 7: 월간 행사 계획
- 공지사항 바로가기 링크 + 공지 건수 뱃지
- 테이블: 순번 | 제목 | 대상 | 일시 | 장소 | 주관
- 이번 달 행사만 표시

---

## 상단 공통 UI

- 좌측 상단: 시설 로고 + 시설명
- 상단 탭 메뉴: 현재 선택 탭은 주황색 배경으로 강조
- 우측 상단 날짜 표시: "2026년 03월 30일"
- 우측 상단 기능 버튼: 신규[F2] | 조회[F3] | 저장[F4] | 삭제[F5] | 인쇄[F6] | 엑셀[F7] | 종료[F12]
  - 각 버튼은 현재 활성 페이지에 맞는 동작 수행
  - 키보드 단축키 지원
- 하단 상태바: 버전 | 시설명 | 로그인 사용자 | 직급 | IP | 현재 폼명 | 자동종료 타이머

---

## 핵심 데이터 모델 (Prisma Schema)

### 시설/조직

```
Facility (시설)
  - id, name, address, phone, ceoName, businessNumber, logo

Building (동)
  - id, facilityId, name (A동, B동...)

Room (호실)
  - id, buildingId, roomNumber, roomType (1인실/2인실), floor, status (사용가능/수리중/빈방)
```

### 입소자 관리

```
Counseling (상담)
  - id, date, counselorId, clientName, clientPhone, counselType (전화/방문/온라인)
  - content, result, nextSchedule, status

Subscription (청약)
  - id, counselingId, clientName, phone, desiredRoomType, desiredMoveIn
  - depositAmount, depositDate, depositStatus (미납/완납/환불)
  - status (접수/승인/취소)

Contract (계약)
  - id, subscriptionId, residentId, roomId
  - contractDate, startDate, endDate, monthlyFee
  - depositAmount, depositPaidDate, depositStatus
  - contractStatus (계약중/만료/해지)

Resident (입주자)
  - id, contractId, roomId
  - name, birthDate, age (자동계산), gender, phone
  - moveInDate, moveOutDate
  - status (입주중/외출중/입원중/퇴소)
  - profilePhoto
  - mobilityLevel (1:자유보행/2:보조기구/3:휠체어/4:거동불편)
  - cognitiveLevel (정상/경도인지장애/중등도치매/중증치매)
  - fallRiskLevel (저/중/고)

EmergencyContact (비상연락처)
  - id, residentId, name, relationship, phone, isPrimary
```

### 건강 관리

```
HealthRecord (일일 건강기록)
  - id, residentId, recordDate, recordedBy
  - systolicBP, diastolicBP (혈압)
  - heartRate (심박수)
  - bloodSugar (혈당 - 공복/식후 구분)
  - bloodSugarType (fasting/postprandial)
  - temperature (체온)
  - weight (체중)
  - oxygenSaturation (산소포화도)
  - sleepHours (수면시간)
  - sleepDisorder (수면장애 여부)
  - waterIntake (수분섭취 ml)
  - mealAmount (식사량: 상/중/하)
  - bowelMovement (배변 여부)
  - mood (기분: 1~5)
  - notes

Disease (기저질환) - 다대다
  - id, residentId, diseaseName, diseaseCode
  - diagnosisDate, severity, status (활성/관해/완치)

Medication (투약)
  - id, residentId, drugName, dosage, frequency
  - prescribedBy, startDate, endDate
  - schedule (아침/점심/저녁/취침전)
  - notes

Allergy (알레르기)
  - id, residentId, allergyType (음식/약물/기타), allergenName, severity, reaction

DietaryRestriction (식이제한)
  - id, residentId, restrictionType (저염/저당/저지방/연하곤란/채식/유당불내증/투석식/저단백 등)

HealthCounseling (건강상담)
  - id, residentId, counselorId, scheduledDate
  - counselType (건강상담/외래/정기검진/체육운동/약역관련)
  - status (예약/완료/취소)
  - content, result

HealthCheckup (정기검진)
  - id, residentId, checkupDate, checkupType
  - results (JSON), hospitalName, doctorName, nextCheckupDate
```

### 집중케어 & IoT

```
IntensiveCare (집중케어)
  - id, residentId, reason (관리사유)
  - startDate, endDate, careLevel (관리등급: 1~3)
  - assignedStaffId, status (진행중/종료)

IoTDevice (디바이스)
  - id, deviceNumber, roomId, residentId
  - deviceType (웨어러블/침대센서/도어센서/낙상감지)
  - installDate, batteryLevel, lastCommunication
  - status (정상/배터리부족/통신끊김/점검중)

IoTReading (디바이스 측정값)
  - id, deviceId, residentId, timestamp
  - systolicBP, diastolicBP, heartRate, bloodSugar
  - sleepDisorder, accelerometerX, accelerometerY, accelerometerZ
  - eventType (정상/이상감지/낙상감지)

FallEvent (낙상 이벤트)
  - id, residentId, deviceId
  - occurredAt, location (호실/복도/화장실/식당/야외)
  - severity (경고/긴급)
  - sensorData (JSON)
  - responseStatus (미대응/대응중/완료)

FallResponse (낙상 대응)
  - id, fallEventId, responderId
  - responseTime, actionTaken
  - result (이상없음/경상/중상/병원이송)
  - notes

SafetyIncident (응급/안전사고)
  - id, residentId, occurredAt
  - buildingRoom (동호수)
  - location (발생장소)
  - incidentType, description
  - actionTaken, actionResult
  - guardianContacted (보호자 연락 여부)
  - isResolved, resolvedAt
  - staffId (담당자)
```

### 서비스 & 컨시어지

```
ServiceType (서비스 유형)
  - id, name, category (고혈압/당뇨/신장/저작곤란/병원동행/민원 등)
  - description, isActive

ServiceRequest (서비스 신청)
  - id, residentId, serviceTypeId
  - requestDate, desiredDate
  - description, status (신청/접수/진행중/완료/취소)
  - assignedStaffId, completedDate, result

HospitalVisit (병원동행)
  - id, residentId, serviceRequestId
  - hospitalName, department, visitDate, visitTime
  - accompanyStaffId, transportType
  - purpose, result, nextVisitDate

Complaint (민원)
  - id, residentId, category, title, content
  - filedDate, status (접수/처리중/완료)
  - handlerId, response, resolvedDate
```

### 커뮤니티 & 프로그램

```
Program (시설 프로그램)
  - id, name, category (건강재활/운동체력/인지교육/문화여가/사회심리/외부서비스)
  - description, instructorName, instructorId
  - dayOfWeek (월~일), startTime, endTime
  - location, capacity, currentParticipants
  - requiredMobilityLevel (최소 운동능력)
  - requiredCognitiveLevel (최소 인지능력)
  - excludedDiseases (제외 질환 목록)
  - status (모집중/진행중/종료/일시중단)

ProgramEnrollment (프로그램 참여)
  - id, programId, residentId
  - enrollDate, withdrawDate
  - status (참여중/중단/완료)

ProgramAttendance (출석)
  - id, enrollmentId, date, attended (출석/결석/외출/입원)
  - notes

ProgramRecommendation (AI 추천)
  - id, residentId, programId
  - score (추천 점수), reason (추천 사유)
  - recommendedDate, enrolled (신청 여부)

Notice (공지사항)
  - id, title, content, category
  - authorId, createdAt, isPinned

MonthlyEvent (월간 행사)
  - id, title, targetGroup, eventDate, eventTime
  - location, organizer, description, status
```

### 식사관리

```
MealPlan (식단)
  - id, weekStartDate, mealType (아침/점심/저녁/간식)
  - dayOfWeek, menuItems (JSON)
  - calories, protein, carbs, fat, sodium, fiber
  - isSpecialDiet (특별식 여부)
  - specialDietType

MealCount (식수인원)
  - id, date, mealType, headCount, specialDietCount, notes

MealCost (식사비 산출)
  - id, yearMonth, totalMeals, costPerMeal, totalCost
```

### 청구/정산

```
MonthlyBilling (월청구)
  - id, residentId, yearMonth
  - managementFee (일반관리비)
  - mealFee (식사비)
  - utilityFee (수도광열비)
  - serviceFee (서비스비)
  - totalAmount, paidAmount, unpaidAmount
  - billingDate, dueDate, paidDate
  - status (미청구/청구완료/수납완료/미수)

DepositSettlement (보증금 정산)
  - id, residentId, contractId
  - depositAmount, refundAmount, deductionAmount
  - deductionReason, settlementDate, status
```

### 시설/자산

```
Asset (자산/비품)
  - id, name, category, serialNumber
  - location (동/호실), purchaseDate, purchasePrice
  - status (사용중/수리중/폐기)
  - warrantyEndDate

MaintenanceRequest (유지보수 요청)
  - id, assetId, roomId, requesterId
  - requestDate, category (전기/배관/가구/기타)
  - description, urgency (일반/긴급)
  - assignedTo, status (접수/진행/완료)
  - completedDate, result, cost

LongTermLeave (장기외출)
  - id, residentId, startDate, endDate, reason
  - destination, contactPhone, approvedBy, status
```

### 관리자/직원

```
Staff (직원)
  - id, name, loginId, password (hashed), role
  - department, position, phone, email
  - hireDate, status (재직/퇴직/휴직)
  - permissions (JSON)
  - role enum: DIRECTOR(시설장) / NURSE(간호사) / CAREGIVER(요양보호사) / COUNSELOR(상담사) / NUTRITIONIST(영양사) / TRAINER(운동지도사) / ADMIN(행정) / MANAGER(경영관리자)

ActivityLog (활동 로그)
  - id, staffId, action, targetTable, targetId
  - details, ipAddress, timestamp
```

---

## IoT 낙상 감지 시뮬레이터

`/iot-simulator/index.ts` — Node.js 스크립트

- 가상 웨어러블 센서 데이터 생성 (3축 가속도 + 자이로)
- 정상 패턴 (걷기, 앉기, 눕기, 수면) 시뮬레이션
- 낙상 이벤트: 급격한 가속도 변화 → 충격 → 정지 패턴
- 바이탈 사인도 함께 전송 (혈압, 심박, 혈당)
- 수면장애 감지: 뒤척임 패턴
- Socket.IO로 서버에 실시간 전송
- CLI 명령어: `simulate normal`, `simulate fall`, `simulate vital-alert`
- 각 입주자별 디바이스 설정 가능

---

## AI 건강 분석 엔진 (규칙 기반, API 없이)

### 건강 종합 점수 (100점)

| 항목 | 배점 | 판정 기준 |
|------|------|----------|
| BMI | 15점 | 정상(18.5~24.9): 15점, 주의(17~18.4 or 25~29.9): 10점, 위험(<17 or ≥30): 5점 |
| 혈압 | 20점 | 정상(<120/80): 20점, 주의(120~139/80~89): 13점, 위험(≥140/90): 7점 |
| 혈당(공복) | 20점 | 정상(70~99): 20점, 주의(100~125): 13점, 위험(≥126 or <70): 7점 |
| 콜레스테롤 | 15점 | 정상(<200): 15점, 주의(200~239): 10점, 위험(≥240): 5점 |
| 활동성 | 15점 | Level1: 15점, Level2: 11점, Level3: 7점, Level4: 3점 |
| 수면/수분 | 15점 | 수면 7~9h + 수분 ≥1500ml: 15점, 부분 충족: 10점, 미충족: 5점 |

### 위험 태그 자동 생성
- BMI < 18.5 → "저체중 위험"
- BMI ≥ 30 → "비만 주의"
- 수축기 ≥ 140 or 이완기 ≥ 90 → "고혈압 주의"
- 공복혈당 ≥ 126 → "혈당 위험"
- 수분 < 1000ml → "탈수 주의"
- 낙상이력 있고 운동능력 Level 2 이상 → "낙상 고위험"
- 수면 < 5시간 연속 3일 → "수면장애 주의"
- 체중 30일간 3kg 이상 변화 → "체중 급변 주의"

### 맞춤 가이드 생성

**(a) 식단 가이드** — 질환별 교차 규칙
- 당뇨: 저당, GI지수 낮은 식품, 탄수화물 제한
- 고혈압: 저염(나트륨 2000mg 이하), DASH 식단
- 신장질환: 저단백, 칼륨/인 제한
- 심장질환: 저지방, 저콜레스테롤
- 연하곤란: 음식 형태 조절 (일반→다진→미음)
- 복수 질환 시 교차 적용하여 최종 식단 산출
- 주간 식단표 (월~일 × 아침/점심/저녁/간식) + 영양소 목표

**(b) 운동 가이드** — 능력별 프로그램
- Level 1: 걷기 30분, 밴드운동, 균형훈련, 스트레칭
- Level 2: 보조기구 보행훈련, 앉아서 상체운동, 가벼운 스트레칭
- Level 3: 휠체어 상체운동, 관절가동범위 운동
- Level 4: 침상 스트레칭, 수동관절운동, 체위변환
- 질환 반영: 관절염→수중운동, 심장→고강도 금지, 골다공증→충격운동 금지
- 낙상 고위험 → 균형훈련 강화 + 단독운동 제한

**(c) 생활 습관 가이드**
- 수면, 수분, 인지활동, 사회활동 권장사항
- 질환별 맞춤 팁

**(d) 프로그램 추천** — 시설 내 프로그램 매칭
- 운동능력 등급 ≥ 요구 등급
- 인지능력 등급 ≥ 요구 등급
- 제외 질환 충돌 없음
- 건강 분석 결과 반영 (낙상위험→균형운동, 인지저하→인지훈련, 고립→사회프로그램)
- 추천 점수: 적합도(40%) + 건강필요도(40%) + 정원여유(20%)
- 추천 카드 UI에 "추천 사유" 표시

---

## PDF 리포트

개인별 건강분석표 + 맞춤 가이드를 PDF로 내보내기:
- 헤더: 시설 로고, 시설명, 출력일
- 입주자 기본 정보
- 건강 종합 점수 + 항목별 판정 (컬러)
- 30일 추이 차트 (혈압, 혈당, 체중)
- 위험 태그 목록
- 식단/운동/생활 가이드 전문
- 추천 프로그램 목록
- 2가지 템플릿: 가족 공유용(간략) / 의료진용(상세)

---

## 시드 데이터

반드시 포함:

**시설**
- 시설명: "실버힐 시니어타운", A동 (1인실 36세대 + 2인실 6세대 = 42세대)

**직원 6명**
- 시설장 1, 간호사 1, 요양보호사 1, 상담사 1, 영양사 1, 운동지도사 1

**입주자 8명** (다양한 건강 프로파일)
1. 김영수(78/M) — 건강, Level 1, 인지정상
2. 이순자(82/F) — 고혈압+당뇨, Level 1, 인지정상
3. 박철호(85/M) — 치매+낙상이력2건, Level 2, 경도인지장애
4. 정미경(79/F) — 관절염+골다공증, Level 2, 인지정상
5. 최동환(88/M) — 심장질환+신장질환, Level 3, 경도인지장애
6. 한금순(91/F) — 파킨슨+연하곤란, Level 3, 중등도치매
7. 오진우(76/M) — 고혈압+비만, Level 1, 인지정상
8. 송영희(84/F) — 뇌졸중이력+편마비, Level 4, 경도인지장애

**각 입주자별 데이터**
- 최근 30일 일일 건강기록 (질환 특성 반영 랜덤 생성)
- 복용 약물 1~4개
- 비상연락처 1~2명
- 식이제한 해당자 반영

**프로그램 12개** (카테고리별 2개)
**월간행사 3개**
**공지사항 5개**
**낙상이벤트 3건** (대응기록 포함)
**안전사고 2건**
**서비스신청 5건**
**IoT 디바이스 8개** (입주자당 1개)
**계약/청약 데이터 입주자 수만큼**

---

## UI/UX 요구사항

- 레이아웃: 상단 탭바 + 좌측 사이드바(트리형) + 메인 콘텐츠 + 하단 상태바
- 상단 탭: 현재 선택 = 주황색(#E67E22) 배경 + 흰색 글씨
- 좌측 사이드바: 접힘/펼침 가능, 현재 선택 = 주황색 배경
- 테이블: 줄무늬 배경, 헤더 회색, 정렬/필터/검색 지원
- 위험 표시: 빨강(#E74C3C), 주의: 노랑(#F39C12), 정상: 초록(#27AE60)
- 반응형 (태블릿까지 대응)
- 상단 단축키 버튼 (F2~F12) 동작 구현
- 낙상 감지 실시간 알림: 화면 상단 배너 + 알림음

---

## 개발 순서

1. Prisma 스키마 전체 작성 + 마이그레이션
2. 시드 데이터 생성 스크립트
3. Express API — 입주자 CRUD + 건강기록 CRUD
4. React 레이아웃 (탭 + 사이드바 + 라우팅)
5. 홈 대시보드 (7개 위젯)
6. 입소자관리 전체 메뉴
7. 건강관리 — 바이탈 입력 + 차트
8. 건강분석표 + AI 가이드 생성 엔진
9. IoT 낙상감지 (시뮬레이터 + Socket.IO + 알림)
10. 커뮤니티 — 프로그램 관리 + AI 추천
11. 컨시어지 — 서비스/병원동행/민원
12. 식사관리 — 식단 + 특별식
13. 시설관리 — 호실 + IoT장치
14. 경영통계 대시보드
15. 청구/정산
16. PDF 리포트
17. 관리자 인증 + 권한

DB 스키마부터 시작해서 위 순서대로 하나씩 구현해줘.
각 단계마다 동작 확인 가능하도록 만들고, 완료되면 다음 단계로 넘어가줘.
