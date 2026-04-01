import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext, useSocketContext } from '../App';
import NotificationCenter from './NotificationCenter';

const pageTitles: Record<string, string> = {
  '/dashboard': '대시보드',
  '/residents': '입주자 관리',
  '/resident/admission/register': '입주자 등록',
  '/health-records': '건강 기록',
  '/fall-events': '낙상 알림',
  '/programs': '프로그램 관리',
  '/guides': '건강 가이드',
  '/iot-devices': 'IoT 기기 관리',
};

export default function Header() {
  const { admin, logout } = useAuthContext();
  const { isConnected } = useSocketContext();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.match(/^\/resident\/admission\/[^/]+\/edit$/)) return '입주자 정보 수정';
    if (path.match(/^\/resident\/admission\/[^/]+$/)) return '입주자 상세';
    return pageTitles[path] || '시니어 케어';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-900">{getPageTitle()}</h2>
        <span
          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
            isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isConnected ? '실시간 연결' : '오프라인'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <NotificationCenter />

        <div className="flex items-center gap-2 border-l pl-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
            <p className="text-xs text-gray-500">
              {admin?.role === 'DIRECTOR' ? '시설장' : admin?.role === 'NURSE' ? '간호사' : '생활지도사'}
            </p>
          </div>
          <button
            onClick={() => { logout(); window.location.href = '/login'; }}
            className="ml-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
