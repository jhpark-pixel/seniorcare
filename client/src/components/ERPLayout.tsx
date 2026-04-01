import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../App';
import TabNavigation from './TabNavigation';
import ERPSidebar from './ERPSidebar';
import TodoNotification from './TodoNotification';

function getTabFromPath(pathname: string): string {
  if (pathname === '/' || pathname === '/home' || pathname === '/dashboard') return 'home';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'home';
  const first = segments[0];
  const tabIds = ['resident', 'health', 'concierge', 'community', 'meal', 'facility', 'stats', 'admin'];
  if (tabIds.includes(first)) return first;
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
  const [showTodo, setShowTodo] = useState(false);
  const todoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // 팝업 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (todoRef.current && !todoRef.current.contains(e.target as Node)) {
        setShowTodo(false);
      }
    }
    if (showTodo) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTodo]);

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
      <div className="flex flex-1 overflow-hidden relative">
        {showSidebar && <ERPSidebar activeTab={activeTab} />}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        {/* To-Do 플로팅 버튼 */}
        {admin && (
          <div ref={todoRef} className="fixed bottom-6 left-6 z-50">
            {/* 팝업 */}
            {showTodo && (
              <div className="absolute bottom-14 left-0 w-[420px] max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-200 animate-in">
                <TodoNotification role={admin.role} name={admin.name} />
              </div>
            )}

            {/* 버튼 */}
            <button
              onClick={() => setShowTodo(!showTodo)}
              className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white text-lg transition-all hover:scale-110 active:scale-95"
              style={{ backgroundColor: '#F0835A' }}
              title="오늘의 업무"
            >
              {showTodo ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <span>📋</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
