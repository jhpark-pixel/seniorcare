# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

케어닥 케어홈 송추점 입주자 통합 관리 시스템. 한국어 UI. 입주자 관리, 일일 건강 기록, IoT 낙상 감지, 규칙 기반 맞춤 건강 가이드 생성, 시설 프로그램 추천, 스마트 업무 추천, 경영통계, 직원 계정 관리 기능을 제공한다.

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
npm run db:studio    # Prisma Studio GUI

# DB 초기화 후 재생성 (시드 데이터 변경 시)
rm -f prisma/dev.db && cd server && npx prisma db push && npx ts-node --transpile-only run-seed.ts

# 빌드
cd client && npm run build    # TypeScript 검사 + Vite 빌드
cd server && npm run build    # TypeScript → dist/ 컴파일
```

## 주의사항

- **시드 파일이 2개 존재**: Prisma가 실제 실행하는 시드는 `server/run-seed.ts`이다 (`prisma/seed.ts`가 아님). 시드 데이터를 수정할 때 반드시 `server/run-seed.ts`를 편집할 것.
- **PDF 한글 폰트**: `server/src/routes/reports.ts`에서 pdfkit에 맑은 고딕(`server/fonts/malgun.ttf`)을 등록하여 한국어를 렌더링한다. 폰트 파일은 `server/fonts/`에 포함.
- **타입명과 컴포넌트명 충돌 주의**: `client/src/pages/HealthGuide.tsx`처럼 import된 타입명과 default export 함수명이 같으면 Babel에서 `Duplicate declaration` 에러가 발생한다. 컴포넌트명에 `Page` 접미사를 붙여 회피.
- **배포 시 DB 전환**: `scripts/prepare-prod.js`가 Prisma 스키마를 SQLite → PostgreSQL로 자동 전환. 로컬은 SQLite, 프로덕션은 Railway PostgreSQL.
- **프로덕션 배포**: Railway CLI (`railway up --detach`). `railway.json`에 빌드/시작 명령 정의. 시작 시 `prisma db push --accept-data-loss` 사용.

## 아키텍처

**모노레포** 구조:

- `client/` — React 18 SPA (Vite, TypeScript, Tailwind CSS, Recharts)
- `server/` — Express API (TypeScript, ts-node-dev)
- `prisma/` — DB 스키마 (개발: SQLite, 운영: PostgreSQL)
- `scripts/` — 프로덕션 빌드 스크립트 (`prepare-prod.js`)

### 백엔드 (server/)

- **진입점**: `src/index.ts` — Express + Socket.IO 단일 HTTP 서버. 프로덕션에서 `client/dist` 정적 파일 서빙.
- **라우트** (`src/routes/`): `/api/` 하위 RESTful API
  - `auth` — JWT 로그인
  - `residents` — 입주자 CRUD
  - `healthRecords` — 일일 건강 기록
  - `fallEvents` — 낙상 이벤트 + Socket.IO 실시간 알림
  - `iotDevices` — IoT 장치 관리
  - `programs` — 시설 프로그램 + 추천
  - `guides` — 맞춤 건강 가이드 생성
  - `dashboard` — 대시보드 통계
  - `reports` — PDF 리포트 (pdfkit + 맑은 고딕)
  - `dailyTasks` — 일일 업무 CRUD + `/recommendations` 자동 추천 엔진
  - `management` — 경영통계 KPI/추이/재무 (DIRECTOR 전용)
  - `adminManagement` — 직원 계정 CRUD (DIRECTOR 전용)
- **인증**: JWT Bearer 토큰. `src/middleware/auth.ts`에 `authenticate`와 `requireRole()`. 역할: `DIRECTOR`(시설장), `NURSE`(간호사), `SOCIAL_WORKER`(생활지도사).
- **서비스** (`src/services/`):
  - `healthScore.ts` — 100점 감점 방식 건강 점수 + 추이 분석
  - `guideEngine.ts` — 규칙 기반 식단·운동·생활습관 가이드 자동 생성
  - `recommendationEngine.ts` — 프로그램 추천 점수 산출

### 프론트엔드 (client/)

- **진입점**: `src/main.tsx` → `src/App.tsx`, React Router v6.
- **컨텍스트**: `AuthContext`, `SocketContext` (App 루트 제공). `useAuth` 훅 (JWT/localStorage), `useSocket` 훅 (Socket.IO).
- **API 클라이언트**: `src/services/api.ts` — Axios, Bearer 토큰 자동 주입, 401 시 로그인 리다이렉트.
- **페이지**: Dashboard, ResidentList/Detail/Form, HealthRecords, FallEvents, Programs, HealthGuidePage, IoTDevices, DailyTasks(스마트 추천), ManagementStats(시설장), AdminManagement(시설장). 모두 `PrivateRoute`.
- **브랜딩**: 케어닥 케어홈 (#F0835A 주황색), 사이드바/로그인 페이지.

### 데이터베이스 (prisma/)

- 로컬: SQLite (`prisma/dev.db`), 프로덕션: PostgreSQL (Railway).
- 주요 모델: Resident(월 생활비/보증금 포함), HealthRecord, FallEvent, IotDevice, Program, DailyTask, Admin, HealthGuide 등.
- 시드: 케어닥 직원 5명, 입주자 25명(2층/3층/4층), 30일 바이탈, 프로그램 10개, IoT 24대.

### 실시간 흐름 (낙상 감지)

IoT → Socket.IO → `fallEvents.ts` (DB 저장) → 브로드캐스트 → `NotificationCenter.tsx`.

### 스마트 업무 추천 (`/api/daily-tasks/recommendations`)

DB 분석 기반 자동 추천: 건강체크 미실시, 투약 확인, IoT 이상, 미처리 낙상, 건강 이상 수치, 프로그램 진행. 우선순위 HIGH/MEDIUM/LOW 자동 분류.

## 주요 컨벤션

- 모든 UI 텍스트는 한국어.
- 모든 PK는 UUID.
- 건강 점수: 100점 감점 방식.
- 인지 능력: `NORMAL`, `MILD`, `MODERATE`, `SEVERE`.
- 운동 능력: 1(자유보행) ~ 4(거동불편).
- 입주자 상태: `ACTIVE`, `OUTING`, `HOSPITALIZED`, `DISCHARGED`.
- 프로그램 상태: `RECRUITING`, `ONGOING`, `ENDED`, `SUSPENDED`.
- 시설장 전용 메뉴: 경영통계, 직원 관리 (`directorOnly: true` in Sidebar).

## 시드 데이터 로그인 정보 (케어닥 케어홈 송추점)

- 시설장: `director` / `caredoc2024!`
- 간호사: `nurse_kim` / `caredoc2024!`
- 간호사: `nurse_lee` / `caredoc2024!`
- 생활지도사: `social_choi` / `caredoc2024!`
- 생활지도사: `social_park` / `caredoc2024!`
- 기본 JWT 시크릿: `senior-care-secret-key-2024`

## 배포

- **플랫폼**: Railway (https://railway.app)
- **URL**: https://seniorcare-production-9a91.up.railway.app
- **GitHub**: https://github.com/jhpark-pixel/seniorcare
- **배포 명령**: `railway up --detach`
- **환경변수**: `DATABASE_URL` (PostgreSQL, Railway 자동), `NODE_ENV=production`, `JWT_SECRET`, `PORT=4000`
- **DB 시드 (프로덕션)**: `node scripts/prepare-prod.js` 후 PostgreSQL URL로 `run-seed.ts` 실행
