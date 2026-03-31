import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';
import ERPLayout from './components/ERPLayout';
import Login from './pages/Login';
import LegacyDashboard from './pages/Dashboard';
import ResidentList from './pages/ResidentList';
import ResidentDetail from './pages/ResidentDetail';
import ResidentForm from './pages/ResidentForm';
import HealthRecords from './pages/HealthRecords';
import FallEvents from './pages/FallEvents';
import Programs from './pages/Programs';
import HealthGuidePage from './pages/HealthGuide';
import IoTDevices from './pages/IoTDevices';
import DailyTasks from './pages/DailyTasks';
import ManagementStats from './pages/ManagementStats';
import AdminManagement from './pages/AdminManagement';
import ERPHome from './pages/ERPHome';
import PlaceholderPage from './pages/PlaceholderPage';

export const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);
export const SocketContext = createContext<ReturnType<typeof useSocket> | null>(null);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not found');
  return ctx;
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('SocketContext not found');
  return ctx;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const auth = useAuth();
  const socket = useSocket();

  return (
    <AuthContext.Provider value={auth}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><ERPLayout /></PrivateRoute>}>
              {/* HOME */}
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<ERPHome />} />

              {/* 입소자관리 */}
              <Route path="resident">
                <Route path="counseling/register" element={<PlaceholderPage title="상담등록" />} />
                <Route path="counseling/schedule" element={<PlaceholderPage title="상담일정조회" />} />
                <Route path="counseling/history" element={<PlaceholderPage title="상담내역조회" />} />
                <Route path="counseling/stats" element={<PlaceholderPage title="상담유형별 현황" />} />
                <Route path="subscription/register" element={<PlaceholderPage title="청약서등록 및 조회" />} />
                <Route path="subscription/payment" element={<PlaceholderPage title="청약금입금 및 조회" />} />
                <Route path="subscription/status" element={<PlaceholderPage title="청약자가입현황" />} />
                <Route path="contract/register" element={<PlaceholderPage title="계약서등록 및 조회" />} />
                <Route path="contract/deposit" element={<PlaceholderPage title="보증금입금 및 조회" />} />
                <Route path="contract/status" element={<PlaceholderPage title="계약자현황" />} />
                <Route path="admission/register" element={<ResidentForm />} />
                <Route path="admission/status" element={<PlaceholderPage title="입퇴소자현황" />} />
                <Route path="admission/list" element={<ResidentList />} />
                <Route path="admission/:id" element={<ResidentDetail />} />
                <Route path="admission/:id/edit" element={<ResidentForm />} />
                <Route path="billing/monthly" element={<PlaceholderPage title="월청구내역" />} />
                <Route path="billing/management" element={<PlaceholderPage title="월청구산출(관리비)" />} />
                <Route path="billing/meal" element={<PlaceholderPage title="월청구산출(식사비)" />} />
                <Route path="billing/utility" element={<PlaceholderPage title="월청구산출(수도광열비)" />} />
                <Route path="billing/status" element={<PlaceholderPage title="월청구내역현황" />} />
                <Route path="leave/register" element={<PlaceholderPage title="장기외출신청등록" />} />
                <Route path="asset/list" element={<PlaceholderPage title="비품/자산대장" />} />
                <Route path="asset/maintenance" element={<PlaceholderPage title="유지보수 요청서" />} />
                <Route path="renewal/search" element={<PlaceholderPage title="재계약대상자조회" />} />
                <Route path="discharge/apply" element={<PlaceholderPage title="퇴소신청" />} />
                <Route path="settlement/deposit" element={<PlaceholderPage title="보증금 정산관리" />} />
                <Route path="settlement/payment" element={<PlaceholderPage title="보증금 입금관리" />} />
              </Route>

              {/* 건강관리 */}
              <Route path="health">
                <Route path="records/daily" element={<HealthRecords />} />
                <Route path="records/history" element={<PlaceholderPage title="건강기록 이력조회" />} />
                <Route path="records/batch" element={<PlaceholderPage title="건강기록 일괄입력" />} />
                <Route path="counseling/register" element={<PlaceholderPage title="건강상담 예약등록" />} />
                <Route path="counseling/schedule" element={<PlaceholderPage title="건강상담 예약현황" />} />
                <Route path="counseling/history" element={<PlaceholderPage title="건강상담 내역조회" />} />
                <Route path="checkup/schedule" element={<PlaceholderPage title="검진일정 관리" />} />
                <Route path="checkup/result" element={<PlaceholderPage title="검진결과 입력" />} />
                <Route path="checkup/history" element={<PlaceholderPage title="검진이력 조회" />} />
                <Route path="medication/register" element={<PlaceholderPage title="처방약물 등록" />} />
                <Route path="medication/schedule" element={<PlaceholderPage title="투약스케줄 관리" />} />
                <Route path="medication/history" element={<PlaceholderPage title="투약이력 조회" />} />
                <Route path="intensive/register" element={<PlaceholderPage title="집중케어대상자 등록" />} />
                <Route path="intensive/status" element={<PlaceholderPage title="집중케어대상자 현황" />} />
                <Route path="intensive/device" element={<PlaceholderPage title="집중케어 디바이스 관리" />} />
                <Route path="analysis/personal" element={<PlaceholderPage title="개인 건강분석표" />} />
                <Route path="analysis/dashboard" element={<PlaceholderPage title="전체 건강 대시보드" />} />
                <Route path="analysis/guide" element={<HealthGuidePage />} />
              </Route>

              {/* 컨시어지 */}
              <Route path="concierge">
                <Route path="service/register" element={<PlaceholderPage title="서비스 신청등록" />} />
                <Route path="service/status" element={<PlaceholderPage title="서비스 신청현황" />} />
                <Route path="service/types" element={<PlaceholderPage title="서비스 유형관리" />} />
                <Route path="hospital/apply" element={<PlaceholderPage title="병원동행 신청" />} />
                <Route path="hospital/schedule" element={<PlaceholderPage title="병원동행 일정" />} />
                <Route path="hospital/history" element={<PlaceholderPage title="병원동행 이력" />} />
                <Route path="complaint/register" element={<PlaceholderPage title="민원접수" />} />
                <Route path="complaint/status" element={<PlaceholderPage title="민원처리현황" />} />
                <Route path="complaint/stats" element={<PlaceholderPage title="민원통계" />} />
              </Route>

              {/* 커뮤니티 */}
              <Route path="community">
                <Route path="program/manage" element={<Programs />} />
                <Route path="program/calendar" element={<PlaceholderPage title="프로그램 일정표" />} />
                <Route path="program/attendance" element={<PlaceholderPage title="참여자 관리 및 출석" />} />
                <Route path="program/recommend" element={<PlaceholderPage title="AI 프로그램 추천" />} />
                <Route path="notice/register" element={<PlaceholderPage title="공지사항 등록" />} />
                <Route path="notice/list" element={<PlaceholderPage title="공지사항 목록" />} />
                <Route path="event/register" element={<PlaceholderPage title="행사계획 등록" />} />
                <Route path="event/status" element={<PlaceholderPage title="행사계획 현황" />} />
              </Route>

              {/* 식사관리 */}
              <Route path="meal">
                <Route path="plan/register" element={<PlaceholderPage title="주간식단 등록" />} />
                <Route path="plan/view" element={<PlaceholderPage title="식단표 조회" />} />
                <Route path="plan/ai" element={<PlaceholderPage title="AI 맞춤식단 추천" />} />
                <Route path="special/targets" element={<PlaceholderPage title="특별식 대상자" />} />
                <Route path="special/types" element={<PlaceholderPage title="특별식 유형 관리" />} />
                <Route path="special/status" element={<PlaceholderPage title="특별식 신청현황" />} />
                <Route path="stats/daily" element={<PlaceholderPage title="일별 식수인원" />} />
                <Route path="stats/monthly" element={<PlaceholderPage title="월별 식사비 산출" />} />
              </Route>

              {/* 시설관리 */}
              <Route path="facility">
                <Route path="room/status" element={<PlaceholderPage title="동/호실 현황" />} />
                <Route path="room/assign" element={<PlaceholderPage title="호실배정 관리" />} />
                <Route path="room/inspection" element={<PlaceholderPage title="호실점검 이력" />} />
                <Route path="maintenance/register" element={<PlaceholderPage title="보수요청 등록" />} />
                <Route path="maintenance/status" element={<PlaceholderPage title="보수진행 현황" />} />
                <Route path="maintenance/history" element={<PlaceholderPage title="보수이력 조회" />} />
                <Route path="iot/register" element={<IoTDevices />} />
                <Route path="iot/monitor" element={<PlaceholderPage title="장치상태 모니터링" />} />
                <Route path="iot/alert" element={<PlaceholderPage title="장치알림 설정" />} />
              </Route>

              {/* 경영통계 */}
              <Route path="stats">
                <Route path="occupancy/overview" element={<ManagementStats />} />
                <Route path="occupancy/trend" element={<PlaceholderPage title="입퇴소 추이" />} />
                <Route path="occupancy/pipeline" element={<PlaceholderPage title="계약/청약 현황" />} />
                <Route path="occupancy/demographics" element={<PlaceholderPage title="입주자 인구통계" />} />
                <Route path="finance/revenue" element={<PlaceholderPage title="월별 매출현황" />} />
                <Route path="finance/breakdown" element={<PlaceholderPage title="항목별 매출 분석" />} />
                <Route path="finance/unpaid" element={<PlaceholderPage title="미수금 현황" />} />
                <Route path="finance/deposit" element={<PlaceholderPage title="보증금 현황" />} />
                <Route path="finance/collection" element={<PlaceholderPage title="수납률 추이" />} />
                <Route path="finance/forecast" element={<PlaceholderPage title="매출 예측" />} />
                <Route path="operation/service" element={<PlaceholderPage title="서비스 신청 통계" />} />
                <Route path="operation/program" element={<PlaceholderPage title="프로그램 운영 현황" />} />
                <Route path="operation/staff" element={<PlaceholderPage title="직원 업무량 분석" />} />
                <Route path="operation/complaint" element={<PlaceholderPage title="민원 분석" />} />
                <Route path="operation/leave" element={<PlaceholderPage title="장기외출/입원 현황" />} />
                <Route path="health/disease" element={<PlaceholderPage title="질환별 분포" />} />
                <Route path="health/counseling" element={<PlaceholderPage title="건강상담 실적" />} />
                <Route path="health/fall" element={<FallEvents />} />
                <Route path="health/risk" element={<PlaceholderPage title="위험군 현황" />} />
                <Route path="health/medication" element={<PlaceholderPage title="투약 현황" />} />
                <Route path="health/iot" element={<PlaceholderPage title="IoT 알림 분석" />} />
                <Route path="resident/all" element={<PlaceholderPage title="입주자 전체 데이터" />} />
                <Route path="resident/compare" element={<PlaceholderPage title="입주자 비교 분석" />} />
                <Route path="resident/risk" element={<PlaceholderPage title="고위험군 리포트" />} />
                <Route path="resident/export" element={<PlaceholderPage title="엑셀 일괄 다운로드" />} />
                <Route path="report/monthly" element={<PlaceholderPage title="월간 경영보고서" />} />
                <Route path="report/quarterly" element={<PlaceholderPage title="분기 경영보고서" />} />
                <Route path="report/annual" element={<PlaceholderPage title="연간 경영보고서" />} />
                <Route path="report/custom" element={<PlaceholderPage title="커스텀 리포트" />} />
              </Route>

              {/* 경영관리자 */}
              <Route path="admin">
                <Route path="staff/list" element={<AdminManagement />} />
                <Route path="staff/schedule" element={<PlaceholderPage title="근무스케줄" />} />
                <Route path="staff/permissions" element={<PlaceholderPage title="권한관리" />} />
                <Route path="settings/facility" element={<PlaceholderPage title="기본정보 설정" />} />
                <Route path="settings/codes" element={<PlaceholderPage title="코드관리" />} />
                <Route path="settings/fees" element={<PlaceholderPage title="요금설정" />} />
                <Route path="settings/alerts" element={<PlaceholderPage title="알림설정" />} />
                <Route path="settings/backup" element={<PlaceholderPage title="데이터 백업/복원" />} />
              </Route>

              {/* 일일업무 (quick access) */}
              <Route path="daily-tasks" element={<DailyTasks />} />

              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
