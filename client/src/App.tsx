import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useSocket } from './hooks/useSocket';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ResidentList from './pages/ResidentList';
import ResidentDetail from './pages/ResidentDetail';
import ResidentForm from './pages/ResidentForm';
import HealthRecords from './pages/HealthRecords';
import FallEvents from './pages/FallEvents';
import Programs from './pages/Programs';
import HealthGuide from './pages/HealthGuide';
import IoTDevices from './pages/IoTDevices';
import DailyTasks from './pages/DailyTasks';
import ManagementStats from './pages/ManagementStats';

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
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="residents" element={<ResidentList />} />
              <Route path="residents/new" element={<ResidentForm />} />
              <Route path="residents/:id" element={<ResidentDetail />} />
              <Route path="residents/:id/edit" element={<ResidentForm />} />
              <Route path="health-records" element={<HealthRecords />} />
              <Route path="fall-events" element={<FallEvents />} />
              <Route path="programs" element={<Programs />} />
              <Route path="guides" element={<HealthGuide />} />
              <Route path="iot-devices" element={<IoTDevices />} />
              <Route path="daily-tasks" element={<DailyTasks />} />
              <Route path="management" element={<ManagementStats />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
