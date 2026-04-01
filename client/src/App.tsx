import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';
import { AppStateProvider } from './context/AppStateContext';
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
// ERP Pages
import CounselingPage from './pages/erp/CounselingPage';
import SubscriptionPage from './pages/erp/SubscriptionPage';
import ContractPage from './pages/erp/ContractPage';
import BillingPage from './pages/erp/BillingPage';
import LeavePage from './pages/erp/LeavePage';
import SettlementPage from './pages/erp/SettlementPage';
import HealthCounselingPage from './pages/erp/HealthCounselingPage';
import MedicalCheckupPage from './pages/erp/MedicalCheckupPage';
import MedicationPage from './pages/erp/MedicationPage';
import IntensiveCarePage from './pages/erp/IntensiveCarePage';
import ServiceRequestPage from './pages/erp/ServiceRequestPage';
import HospitalVisitPage from './pages/erp/HospitalVisitPage';
import ComplaintPage from './pages/erp/ComplaintPage';
import NoticePage from './pages/erp/NoticePage';
import EventPage from './pages/erp/EventPage';
import MealPlanPage from './pages/erp/MealPlanPage';
import SpecialDietPage from './pages/erp/SpecialDietPage';
import MealStatsPage from './pages/erp/MealStatsPage';
import RoomStatusPage from './pages/erp/RoomStatusPage';
import MaintenancePage from './pages/erp/MaintenancePage';
import ProgramCalendarPage from './pages/erp/ProgramCalendarPage';
import OccupancyStatsPage from './pages/erp/OccupancyStatsPage';
import FinanceStatsPage from './pages/erp/FinanceStatsPage';
import OperationStatsPage from './pages/erp/OperationStatsPage';
import HealthStatsPage from './pages/erp/HealthStatsPage';
import StaffManagementPage from './pages/erp/StaffManagementPage';
import SystemSettingsPage from './pages/erp/SystemSettingsPage';
import ResidentComparisonPage from './pages/erp/ResidentComparisonPage';
import ReportPage from './pages/erp/ReportPage';
import AdmissionStatusPage from './pages/erp/AdmissionStatusPage';
import RenewalPage from './pages/erp/RenewalPage';
import DischargePage from './pages/erp/DischargePage';
import HealthRecordHistoryPage from './pages/erp/HealthRecordHistoryPage';
import HealthRecordBatchPage from './pages/erp/HealthRecordBatchPage';
import PersonalHealthAnalysisPage from './pages/erp/PersonalHealthAnalysisPage';
import HealthDashboardPage from './pages/erp/HealthDashboardPage';
import ProgramAttendancePage from './pages/erp/ProgramAttendancePage';
import ProgramRecommendPage from './pages/erp/ProgramRecommendPage';
import IoTMonitorPage from './pages/erp/IoTMonitorPage';
import IoTAlertSettingsPage from './pages/erp/IoTAlertSettingsPage';
import ResidentDataPage from './pages/erp/ResidentDataPage';
import ExcelExportPage from './pages/erp/ExcelExportPage';
import PermissionsPage from './pages/erp/PermissionsPage';
import AdmissionCounselingPage from './pages/erp/AdmissionCounselingPage';

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
    <AppStateProvider>
    <AuthContext.Provider value={auth}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><ERPLayout /></PrivateRoute>}>
              {/* HOME */}
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<ERPHome />} />

              {/* 입주상담 */}
              <Route path="consultation">
                <Route index element={<Navigate to="/consultation/phone/register" replace />} />
                <Route path="phone/register" element={<AdmissionCounselingPage />} />
                <Route path="phone/list" element={<AdmissionCounselingPage />} />
                <Route path="phone/callback" element={<AdmissionCounselingPage />} />
                <Route path="visit/schedule" element={<AdmissionCounselingPage />} />
                <Route path="visit/list" element={<AdmissionCounselingPage />} />
                <Route path="visit/tour" element={<AdmissionCounselingPage />} />
                <Route path="status/pipeline" element={<AdmissionCounselingPage />} />
                <Route path="status/stats" element={<AdmissionCounselingPage />} />
              </Route>

              {/* 입소자관리 */}
              <Route path="resident">
                <Route index element={<Navigate to="/resident/counseling/register" replace />} />
                <Route path="counseling/register" element={<CounselingPage />} />
                <Route path="counseling/schedule" element={<CounselingPage />} />
                <Route path="counseling/history" element={<CounselingPage />} />
                <Route path="counseling/stats" element={<CounselingPage />} />
                <Route path="subscription/register" element={<SubscriptionPage />} />
                <Route path="subscription/payment" element={<SubscriptionPage />} />
                <Route path="subscription/status" element={<SubscriptionPage />} />
                <Route path="contract/register" element={<ContractPage />} />
                <Route path="contract/deposit" element={<ContractPage />} />
                <Route path="contract/status" element={<ContractPage />} />
                <Route path="admission/register" element={<ResidentForm />} />
                <Route path="admission/status" element={<AdmissionStatusPage />} />
                <Route path="admission/list" element={<ResidentList />} />
                <Route path="admission/:id" element={<ResidentDetail />} />
                <Route path="admission/:id/edit" element={<ResidentForm />} />
                <Route path="billing/monthly" element={<BillingPage />} />
                <Route path="billing/management" element={<BillingPage />} />
                <Route path="billing/meal" element={<BillingPage />} />
                <Route path="billing/utility" element={<BillingPage />} />
                <Route path="billing/status" element={<BillingPage />} />
                <Route path="leave/register" element={<LeavePage />} />
                <Route path="asset/list" element={<MaintenancePage />} />
                <Route path="asset/maintenance" element={<MaintenancePage />} />
                <Route path="renewal/search" element={<RenewalPage />} />
                <Route path="discharge/apply" element={<DischargePage />} />
                <Route path="settlement/deposit" element={<SettlementPage />} />
                <Route path="settlement/payment" element={<SettlementPage />} />
              </Route>

              {/* 건강관리 */}
              <Route path="health">
                <Route index element={<Navigate to="/health/records/daily" replace />} />
                <Route path="records/daily" element={<HealthRecords />} />
                <Route path="records/history" element={<HealthRecordHistoryPage />} />
                <Route path="records/batch" element={<HealthRecordBatchPage />} />
                <Route path="counseling/register" element={<HealthCounselingPage />} />
                <Route path="counseling/schedule" element={<HealthCounselingPage />} />
                <Route path="counseling/history" element={<HealthCounselingPage />} />
                <Route path="checkup/schedule" element={<MedicalCheckupPage />} />
                <Route path="checkup/result" element={<MedicalCheckupPage />} />
                <Route path="checkup/history" element={<MedicalCheckupPage />} />
                <Route path="medication/register" element={<MedicationPage />} />
                <Route path="medication/schedule" element={<MedicationPage />} />
                <Route path="medication/history" element={<MedicationPage />} />
                <Route path="intensive/register" element={<IntensiveCarePage />} />
                <Route path="intensive/status" element={<IntensiveCarePage />} />
                <Route path="intensive/device" element={<IntensiveCarePage />} />
                <Route path="analysis/personal" element={<PersonalHealthAnalysisPage />} />
                <Route path="analysis/dashboard" element={<HealthDashboardPage />} />
                <Route path="analysis/guide" element={<HealthGuidePage />} />
              </Route>

              {/* 컨시어지 */}
              <Route path="concierge">
                <Route index element={<Navigate to="/concierge/service/register" replace />} />
                <Route path="service/register" element={<ServiceRequestPage />} />
                <Route path="service/status" element={<ServiceRequestPage />} />
                <Route path="service/types" element={<ServiceRequestPage />} />
                <Route path="hospital/apply" element={<HospitalVisitPage />} />
                <Route path="hospital/schedule" element={<HospitalVisitPage />} />
                <Route path="hospital/history" element={<HospitalVisitPage />} />
                <Route path="complaint/register" element={<ComplaintPage />} />
                <Route path="complaint/status" element={<ComplaintPage />} />
                <Route path="complaint/stats" element={<ComplaintPage />} />
              </Route>

              {/* 커뮤니티 */}
              <Route path="community">
                <Route index element={<Navigate to="/community/program/manage" replace />} />
                <Route path="program/manage" element={<Programs />} />
                <Route path="program/calendar" element={<ProgramCalendarPage />} />
                <Route path="program/attendance" element={<ProgramAttendancePage />} />
                <Route path="program/recommend" element={<ProgramRecommendPage />} />
                <Route path="notice/register" element={<NoticePage />} />
                <Route path="notice/list" element={<NoticePage />} />
                <Route path="event/register" element={<EventPage />} />
                <Route path="event/status" element={<EventPage />} />
              </Route>

              {/* 식사관리 */}
              <Route path="meal">
                <Route index element={<Navigate to="/meal/plan/register" replace />} />
                <Route path="plan/register" element={<MealPlanPage />} />
                <Route path="plan/view" element={<MealPlanPage />} />
                <Route path="plan/ai" element={<MealPlanPage />} />
                <Route path="special/targets" element={<SpecialDietPage />} />
                <Route path="special/types" element={<SpecialDietPage />} />
                <Route path="special/status" element={<SpecialDietPage />} />
                <Route path="stats/daily" element={<MealStatsPage />} />
                <Route path="stats/monthly" element={<MealStatsPage />} />
              </Route>

              {/* 시설관리 */}
              <Route path="facility">
                <Route index element={<Navigate to="/facility/room/status" replace />} />
                <Route path="room/status" element={<RoomStatusPage />} />
                <Route path="room/assign" element={<RoomStatusPage />} />
                <Route path="room/inspection" element={<RoomStatusPage />} />
                <Route path="maintenance/register" element={<MaintenancePage />} />
                <Route path="maintenance/status" element={<MaintenancePage />} />
                <Route path="maintenance/history" element={<MaintenancePage />} />
                <Route path="iot/register" element={<IoTDevices />} />
                <Route path="iot/monitor" element={<IoTMonitorPage />} />
                <Route path="iot/alert" element={<IoTAlertSettingsPage />} />
              </Route>

              {/* 경영통계 */}
              <Route path="stats">
                <Route index element={<Navigate to="/stats/occupancy/overview" replace />} />
                <Route path="occupancy/overview" element={<ManagementStats />} />
                <Route path="occupancy/trend" element={<OccupancyStatsPage />} />
                <Route path="occupancy/pipeline" element={<OccupancyStatsPage />} />
                <Route path="occupancy/demographics" element={<OccupancyStatsPage />} />
                <Route path="finance/revenue" element={<FinanceStatsPage />} />
                <Route path="finance/breakdown" element={<FinanceStatsPage />} />
                <Route path="finance/unpaid" element={<FinanceStatsPage />} />
                <Route path="finance/deposit" element={<FinanceStatsPage />} />
                <Route path="finance/collection" element={<FinanceStatsPage />} />
                <Route path="finance/forecast" element={<FinanceStatsPage />} />
                <Route path="operation/service" element={<OperationStatsPage />} />
                <Route path="operation/program" element={<OperationStatsPage />} />
                <Route path="operation/staff" element={<OperationStatsPage />} />
                <Route path="operation/complaint" element={<OperationStatsPage />} />
                <Route path="operation/leave" element={<OperationStatsPage />} />
                <Route path="health/disease" element={<HealthStatsPage />} />
                <Route path="health/counseling" element={<HealthStatsPage />} />
                <Route path="health/fall" element={<FallEvents />} />
                <Route path="health/risk" element={<HealthStatsPage />} />
                <Route path="health/medication" element={<HealthStatsPage />} />
                <Route path="health/iot" element={<HealthStatsPage />} />
                <Route path="resident/all" element={<ResidentDataPage />} />
                <Route path="resident/compare" element={<ResidentComparisonPage />} />
                <Route path="resident/risk" element={<HealthStatsPage />} />
                <Route path="resident/export" element={<ExcelExportPage />} />
                <Route path="report/monthly" element={<ReportPage />} />
                <Route path="report/quarterly" element={<ReportPage />} />
                <Route path="report/annual" element={<ReportPage />} />
                <Route path="report/custom" element={<ReportPage />} />
              </Route>

              {/* 경영관리자 */}
              <Route path="admin">
                <Route index element={<Navigate to="/admin/staff/list" replace />} />
                <Route path="staff/list" element={<AdminManagement />} />
                <Route path="staff/schedule" element={<StaffManagementPage />} />
                <Route path="staff/permissions" element={<PermissionsPage />} />
                <Route path="settings/facility" element={<SystemSettingsPage />} />
                <Route path="settings/codes" element={<SystemSettingsPage />} />
                <Route path="settings/fees" element={<SystemSettingsPage />} />
                <Route path="settings/alerts" element={<SystemSettingsPage />} />
                <Route path="settings/backup" element={<SystemSettingsPage />} />
              </Route>

              {/* 일일업무 (quick access) */}
              <Route path="daily-tasks" element={<DailyTasks />} />

              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </AuthContext.Provider>
    </AppStateProvider>
  );
}

export default App;
