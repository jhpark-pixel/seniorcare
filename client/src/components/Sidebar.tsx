import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthContext, useSocketContext } from '../App';

const navItems: {
  path: string;
  icon: string;
  label: string;
  badge?: boolean;
  directorOnly?: boolean;
}[] = [
  { path: '/dashboard', icon: '📊', label: '대시보드' },
  { path: '/residents', icon: '👥', label: '입주자 관리' },
  { path: '/health-records', icon: '🩺', label: '건강 기록' },
  { path: '/fall-events', icon: '🚨', label: '낙상 알림', badge: true },
  { path: '/programs', icon: '🎯', label: '프로그램 관리' },
  { path: '/guides', icon: '📋', label: '건강 가이드' },
  { path: '/iot-devices', icon: '📡', label: 'IoT 기기 관리' },
  { path: '/daily-tasks', icon: '✅', label: '일일 업무' },
  { path: '/management', icon: '📈', label: '경영통계', directorOnly: true },
  { path: '/admin-management', icon: '👤', label: '직원 관리', directorOnly: true },
];

export default function Sidebar() {
  const { admin } = useAuthContext();
  const { fallNotifications } = useSocketContext();
  const location = useLocation();

  const roleLabel = {
    DIRECTOR: '시설장',
    NURSE: '간호사',
    SOCIAL_WORKER: '생활지도사',
  }[admin?.role || ''] || admin?.role;

  const unreadCount = fallNotifications.filter(n => !n.read).length;

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full">
      {/* 로고 */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: '#F0835A' }}>
            C
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">케어닥 케어홈</h1>
            <p className="text-xs text-slate-400">배곧신도시점</p>
          </div>
        </div>
      </div>

      {/* 관리자 정보 */}
      <div className="px-4 py-3 bg-slate-800 mx-3 mt-3 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
            {admin?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{admin?.name}</p>
            <p className="text-xs text-slate-400">{roleLabel}</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-3 mt-2 space-y-1 overflow-y-auto">
        {navItems.filter(item => !item.directorOnly || admin?.role === 'DIRECTOR').map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.badge && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 버전 */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">v1.0.0 · 시니어 케어 시스템</p>
      </div>
    </div>
  );
}
