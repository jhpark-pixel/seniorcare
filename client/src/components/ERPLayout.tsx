import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../App';
import TabNavigation from './TabNavigation';
import ERPSidebar from './ERPSidebar';

function getTabFromPath(pathname: string): string {
  if (pathname === '/' || pathname === '/home' || pathname === '/dashboard') return 'home';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'home';
  const first = segments[0];
  const tabIds = ['resident', 'health', 'concierge', 'community', 'meal', 'facility', 'stats', 'admin'];
  if (tabIds.includes(first)) return first;
  // Legacy route mapping
  if (first === 'residents' || first === 'health-records' || first === 'fall-events') return 'home';
  if (first === 'programs' || first === 'guides') return 'home';
  if (first === 'iot-devices' || first === 'daily-tasks') return 'home';
  if (first === 'management') return 'stats';
  if (first === 'admin-management') return 'admin';
  return 'home';
}

export default function ERPLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useAuthContext();
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'home') {
      navigate('/dashboard');
    } else {
      navigate(`/${tabId}`);
    }
  };

  const showSidebar = activeTab !== 'home';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Top navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        admin={admin}
      />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <ERPSidebar activeTab={activeTab} />}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
