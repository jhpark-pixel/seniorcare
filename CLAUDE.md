# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

시니어 주거시설 입주자 통합 관리 시스템. 한국어 UI. 입주자 관리, 일일 건강 기록, IoT 낙상 감지, 규칙 기반 맞춤 건강 가이드 생성, 시설 프로그램 추천 기능을 제공한다.

## 명령어

```bash
# 의존성 설치 (프로젝트 루트에서 실행)
npm install && cd server && npm install && cd ../client && npm install

# 클라이언트 + 서버 동시 실행
npm run dev

# 개별 실행
npm run dev:server   # Express, 포트 4000
npm run dev:client   # Vite, 포트 5173

# 데이터베이스
npm run db:migrate   # Prisma 마이그레이션
npm run db:seed      # 데모 시드 데이터 생성
npm run db:studio    # Prisma Studio GUI

# DB 초기화 후 재생성 (시드 데이터 변경 시)
rm -f prisma/dev.db && cd server && npx prisma migrate dev

# 빌드
cd client && npm run build    # TypeScript 검사 + Vite 빌드
cd server && npm run build    # TypeScript → dist/ 컴파일
```

## 주의사항

- **시드 파일이 2개 존재**: Prisma가 실제 실행하는 시드는 `server/run-seed.ts`이다 (`prisma/seed.ts`가 아님). 시드 데이터를 수정할 때 반드시 `server/run-seed.ts`를 편집할 것.
- **PDF 한글 폰트**: `server/src/routes/reports.ts`에서 pdfkit에 맑은 고딕(`C:\Windows\Fonts\malgun.ttf`)을 등록하여 한국어를 렌더링한다. 비-Windows 환경에서는 폰트 경로 변경 필요.
- **타입명과 컴포넌트명 충돌 주의**: `client/src/pages/HealthGuide.tsx`처럼 import된 타입명과 default export 함수명이 같으면 Babel에서 `Duplicate declaration` 에러가 발생한다. 컴포넌트명에 `Page` 접미사를 붙여 회피 (예: `HealthGuidePage`).

## 아키텍처

**모노레포** 구조, 3개 최상위 디렉토리:

- `client/` — React 18 SPA (Vite, TypeScript, Tailwind CSS, Recharts)
- `server/` — Express API (TypeScript, ts-node-dev)
- `prisma/` — DB 스키마 및 마이그레이션 (개발: SQLite, 운영: PostgreSQL)

### 백엔드 (server/)

- **진입점**: `src/index.ts` — Express + Socket.IO를 하나의 HTTP 서버에서 구동. CORS는 `localhost:5173` 허용.
- **라우트** (`src/routes/`): `/api/` 하위 RESTful API — auth, residents, health-records, fall-events, iot-devices, programs, guides, dashboard, reports.
- **인증**: JWT Bearer 토큰. `src/middleware/auth.ts`에 `authenticate`와 `requireRole()` 미들웨어. 역할: `DIRECTOR`(시설장), `NURSE`(간호사), `SOCIAL_WORKER`(생활지도사).
- **서비스** (`src/services/`):
  - `healthScore.ts` — 100점 만점 감점 방식 건강 점수 산출 + 추이 분석 (혈압, 혈당, 체중).
  - `guideEngine.ts` — 질환, 운동/인지 등급, 건강 기록을 기반으로 식단·운동·생활습관 맞춤 가이드를 규칙 기반으로 자동 생성. 외부 AI API 호출 없음.
  - `recommendationEngine.ts` — 프로그램 추천 점수 산출: 적격성 필터링(운동 능력, 인지 능력, 제외 질환) 후 점수 기반 순위 매김.
- **실시간**: Socket.IO로 낙상 감지 알림을 연결된 클라이언트에 푸시. `setSocketIO(io)`를 통해 fall events 라우트에서 서버 측 emit 활성화.
- **파일 업로드**: Multer 사용, `/uploads` 정적 경로로 제공.
- **PDF**: pdfkit + 맑은 고딕 폰트로 서버 측 한국어 리포트 생성.

### 프론트엔드 (client/)

- **진입점**: `src/main.tsx` → `src/App.tsx`, React Router v6 사용.
- **컨텍스트**: `AuthContext`와 `SocketContext`를 App 루트에서 제공. `useAuth` 훅은 JWT를 localStorage로 관리. `useSocket` 훅은 Socket.IO 연결 관리.
- **API 클라이언트**: `src/services/api.ts` — `/api` 기본 경로의 Axios 인스턴스. Bearer 토큰 자동 주입 및 401 응답 시 로그인 페이지 리다이렉트.
- **페이지**: Dashboard, ResidentList, ResidentDetail, ResidentForm, HealthRecords, FallEvents, Programs, HealthGuidePage, IoTDevices. 모두 `PrivateRoute`로 보호.
- **스타일링**: Tailwind CSS + PostCSS/Autoprefixer.

### 데이터베이스 (prisma/)

- 개발 환경은 SQLite (`prisma/dev.db`), 운영 환경은 PostgreSQL 지원.
- Prisma Client 출력 경로: `server/node_modules/.prisma/client`.
- 주요 관계: Resident가 HealthRecords, FallEvents, Medications, Allergies, DietaryRestrictions와 1:N 관계. Disease는 `ResidentDisease`를 통한 N:M 관계. Program은 `ProgramEnrollment`로 연결되며 `ProgramAttendance`로 출석 추적.
- 시드 데이터 (10명): 다양한 건강 상태의 입주자 — 고혈압+당뇨, 치매+심부전, 관절염+골다공증, 뇌졸중, 파킨슨+우울증, 중증치매, COPD, 심부전+당뇨(입원중), 뇌졸중+혈관성치매, 관절염+우울증.

### 실시간 흐름 (낙상 감지)

IoT 장치/시뮬레이터 → Socket.IO → `server/src/routes/fallEvents.ts` (DB 저장) → Socket.IO 브로드캐스트 → `client/src/components/NotificationCenter.tsx` (알림 배너 + 알림음).

## 주요 컨벤션

- 모든 UI 텍스트는 한국어.
- 모든 PK는 UUID.
- 건강 점수는 100점 만점에서 감점하는 방식.
- 인지 능력 등급: `NORMAL`, `MILD`, `MODERATE`, `SEVERE`.
- 운동 능력 등급: 1(자유보행) ~ 4(거동불편·침상).
- 입주자 상태: `ACTIVE`(입주중), `OUTING`(외출중), `HOSPITALIZED`(입원중), `DISCHARGED`(퇴소).
- 프로그램 상태: `RECRUITING`(모집중), `ONGOING`(진행중), `ENDED`(종료), `SUSPENDED`(일시중단).

## 시드 데이터 로그인 정보

- 시설장: `admin` / `admin123`
- 간호사: `nurse` / `nurse123`
- 생활지도사: `social` / `social123`
- 기본 JWT 시크릿: `senior-care-secret-key-2024`
