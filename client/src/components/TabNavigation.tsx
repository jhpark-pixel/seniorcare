import React from 'react';
import { Admin } from '../types';

interface Tab {
  id: string;
  label: string;
  icon: string;
  roles?: string[];
}

const tabs: Tab[] = [
  { id: 'home', label: 'HOME', icon: '🏠' },
  { id: 'resident', label: '입소자관리', icon: '📋' },
  { id: 'health', label: '건강관리', icon: '❤️' },
  { id: 'concierge', label: '컨시어지', icon: '🛎️' },
  { id: 'community', label: '커뮤니티', icon: '📅' },
  { id: 'meal', label: '식사관리', icon: '🍽️' },
  { id: 'facility', label: '시설관리', icon: '🏗️' },
  { id: 'stats', label: '경영통계', icon: '📈', roles: ['DIRECTOR', 'MANAGER'] },
  { id: 'admin', label: '경영관리자', icon: '⚙️', roles: ['DIRECTOR'] },
];

const actionButtons = [
  { label: '신규', shortcut: 'F2' },
  { label: '조회', shortcut: 'F3' },
  { label: '저장', shortcut: 'F4' },
  { label: '인쇄', shortcut: 'F6' },
  { label: '엑셀', shortcut: 'F7' },
];

function getRoleLabel(role: string): string {
  switch (role) {
    case 'DIRECTOR': return '시설장';
    case 'NURSE': return '간호사';
    case 'SOCIAL_WORKER': return '생활지도사';
    case 'MANAGER': return '관리자';
    default: return role;
  }
}

function formatDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  admin: Admin | null;
}

export default function TabNavigation({ activeTab, onTabChange, admin }: TabNavigationProps) {
  const visibleTabs = tabs.filter((tab) => {
    if (!tab.roles) return true;
    if (!admin) return false;
    return tab.roles.includes(admin.role);
  });

  return (
    <div className="flex-shrink-0">
      {/* Top tab bar */}
      <div className="flex items-center bg-white border-b border-gray-200">
        {/* Tabs */}
        <div className="flex items-center flex-1 overflow-x-auto">
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap
                  transition-colors duration-150 border-b-2
                  ${isActive
                    ? 'text-white border-transparent'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                style={isActive ? { backgroundColor: '#F0835A', borderColor: '#F0835A' } : undefined}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side: date + action buttons */}
        <div className="flex items-center gap-2 px-4 flex-shrink-0">
          <span className="text-sm text-gray-500 mr-2">{formatDate()}</span>
          <div className="flex items-center divide-x divide-gray-300 border border-gray-300 rounded">
            {actionButtons.map((btn) => (
              <button
                key={btn.shortcut}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                title={`${btn.label} (${btn.shortcut})`}
              >
                {btn.label}[{btn.shortcut}]
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-100 border-b border-gray-200 text-xs text-gray-500">
        <span>
          케어닥 케어홈 배곧신도시점
          {admin && ` | ${admin.name} (${getRoleLabel(admin.role)})`}
        </span>
        <span>v2.0.0</span>
      </div>
    </div>
  );
}
