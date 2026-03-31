import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  path: string;
  label: string;
}

interface MenuGroup {
  title: string;
  icon: string;
  items: MenuItem[];
}

const menuStructure: Record<string, MenuGroup[]> = {
  home: [],
  resident: [
    { title: '상담관리', icon: '📋', items: [
      { path: '/resident/counseling/register', label: '상담등록' },
      { path: '/resident/counseling/schedule', label: '상담일정조회' },
      { path: '/resident/counseling/history', label: '상담내역조회' },
      { path: '/resident/counseling/stats', label: '상담유형별 현황' },
    ]},
    { title: '청약관리', icon: '📝', items: [
      { path: '/resident/subscription/register', label: '청약서등록 및 조회' },
      { path: '/resident/subscription/payment', label: '청약금입금 및 조회' },
      { path: '/resident/subscription/status', label: '청약자가입현황' },
    ]},
    { title: '계약관리', icon: '📄', items: [
      { path: '/resident/contract/register', label: '계약서등록 및 조회' },
      { path: '/resident/contract/deposit', label: '보증금입금 및 조회' },
      { path: '/resident/contract/status', label: '계약자현황' },
    ]},
    { title: '입소관리', icon: '🏠', items: [
      { path: '/resident/admission/register', label: '입소자등록' },
      { path: '/resident/admission/status', label: '입퇴소자현황' },
      { path: '/resident/admission/list', label: '입소자 목록' },
    ]},
    { title: '청구관리', icon: '💰', items: [
      { path: '/resident/billing/monthly', label: '월청구내역' },
      { path: '/resident/billing/management', label: '월청구산출(관리비)' },
      { path: '/resident/billing/meal', label: '월청구산출(식사비)' },
      { path: '/resident/billing/utility', label: '월청구산출(수도광열비)' },
      { path: '/resident/billing/status', label: '월청구내역현황' },
    ]},
    { title: '장기외출', icon: '🚗', items: [
      { path: '/resident/leave/register', label: '장기외출신청등록' },
    ]},
    { title: '시설자산관리', icon: '🏢', items: [
      { path: '/resident/asset/list', label: '비품/자산대장' },
      { path: '/resident/asset/maintenance', label: '유지보수 요청서' },
    ]},
    { title: '재계약관리', icon: '🔄', items: [
      { path: '/resident/renewal/search', label: '재계약대상자조회' },
    ]},
    { title: '퇴소관리', icon: '🚪', items: [
      { path: '/resident/discharge/apply', label: '퇴소신청' },
    ]},
    { title: '정산관리', icon: '💳', items: [
      { path: '/resident/settlement/deposit', label: '보증금 정산관리' },
      { path: '/resident/settlement/payment', label: '보증금 입금관리' },
    ]},
  ],
  health: [
    { title: '건강기록', icon: '❤️', items: [
      { path: '/health/records/daily', label: '일일 바이탈사인 입력' },
      { path: '/health/records/history', label: '건강기록 이력조회' },
      { path: '/health/records/batch', label: '건강기록 일괄입력' },
    ]},
    { title: '건강상담', icon: '🏥', items: [
      { path: '/health/counseling/register', label: '건강상담 예약등록' },
      { path: '/health/counseling/schedule', label: '건강상담 예약현황' },
      { path: '/health/counseling/history', label: '건강상담 내역조회' },
    ]},
    { title: '정기검진', icon: '🔬', items: [
      { path: '/health/checkup/schedule', label: '검진일정 관리' },
      { path: '/health/checkup/result', label: '검진결과 입력' },
      { path: '/health/checkup/history', label: '검진이력 조회' },
    ]},
    { title: '투약관리', icon: '💊', items: [
      { path: '/health/medication/register', label: '처방약물 등록' },
      { path: '/health/medication/schedule', label: '투약스케줄 관리' },
      { path: '/health/medication/history', label: '투약이력 조회' },
    ]},
    { title: '집중케어', icon: '🩺', items: [
      { path: '/health/intensive/register', label: '집중케어대상자 등록' },
      { path: '/health/intensive/status', label: '집중케어대상자 현황' },
      { path: '/health/intensive/device', label: '집중케어 디바이스 관리' },
    ]},
    { title: '건강분석(AI)', icon: '📊', items: [
      { path: '/health/analysis/personal', label: '개인 건강분석표' },
      { path: '/health/analysis/dashboard', label: '전체 건강 대시보드' },
      { path: '/health/analysis/guide', label: 'AI 맞춤 가이드' },
    ]},
  ],
  concierge: [
    { title: '서비스신청', icon: '🛎️', items: [
      { path: '/concierge/service/register', label: '서비스 신청등록' },
      { path: '/concierge/service/status', label: '서비스 신청현황' },
      { path: '/concierge/service/types', label: '서비스 유형관리' },
    ]},
    { title: '병원동행', icon: '🏥', items: [
      { path: '/concierge/hospital/apply', label: '병원동행 신청' },
      { path: '/concierge/hospital/schedule', label: '병원동행 일정' },
      { path: '/concierge/hospital/history', label: '병원동행 이력' },
    ]},
    { title: '민원관리', icon: '📮', items: [
      { path: '/concierge/complaint/register', label: '민원접수' },
      { path: '/concierge/complaint/status', label: '민원처리현황' },
      { path: '/concierge/complaint/stats', label: '민원통계' },
    ]},
  ],
  community: [
    { title: '프로그램관리', icon: '📅', items: [
      { path: '/community/program/manage', label: '프로그램 등록/관리' },
      { path: '/community/program/calendar', label: '프로그램 일정표' },
      { path: '/community/program/attendance', label: '참여자 관리 및 출석' },
      { path: '/community/program/recommend', label: 'AI 프로그램 추천' },
    ]},
    { title: '공지사항', icon: '📢', items: [
      { path: '/community/notice/register', label: '공지사항 등록' },
      { path: '/community/notice/list', label: '공지사항 목록' },
    ]},
    { title: '월간행사', icon: '🎉', items: [
      { path: '/community/event/register', label: '행사계획 등록' },
      { path: '/community/event/status', label: '행사계획 현황' },
    ]},
  ],
  meal: [
    { title: '식단관리', icon: '🍽️', items: [
      { path: '/meal/plan/register', label: '주간식단 등록' },
      { path: '/meal/plan/view', label: '식단표 조회' },
      { path: '/meal/plan/ai', label: 'AI 맞춤식단 추천' },
    ]},
    { title: '특별식 관리', icon: '🥗', items: [
      { path: '/meal/special/targets', label: '특별식 대상자' },
      { path: '/meal/special/types', label: '특별식 유형 관리' },
      { path: '/meal/special/status', label: '특별식 신청현황' },
    ]},
    { title: '식사통계', icon: '📊', items: [
      { path: '/meal/stats/daily', label: '일별 식수인원' },
      { path: '/meal/stats/monthly', label: '월별 식사비 산출' },
    ]},
  ],
  facility: [
    { title: '호실관리', icon: '🏗️', items: [
      { path: '/facility/room/status', label: '동/호실 현황' },
      { path: '/facility/room/assign', label: '호실배정 관리' },
      { path: '/facility/room/inspection', label: '호실점검 이력' },
    ]},
    { title: '유지보수', icon: '🔧', items: [
      { path: '/facility/maintenance/register', label: '보수요청 등록' },
      { path: '/facility/maintenance/status', label: '보수진행 현황' },
      { path: '/facility/maintenance/history', label: '보수이력 조회' },
    ]},
    { title: 'IoT 장치관리', icon: '📡', items: [
      { path: '/facility/iot/register', label: '장치등록 및 현황' },
      { path: '/facility/iot/monitor', label: '장치상태 모니터링' },
      { path: '/facility/iot/alert', label: '장치알림 설정' },
    ]},
  ],
  stats: [
    { title: '입소현황 통계', icon: '📈', items: [
      { path: '/stats/occupancy/overview', label: '거주자 종합현황' },
      { path: '/stats/occupancy/trend', label: '입퇴소 추이' },
      { path: '/stats/occupancy/pipeline', label: '계약/청약 현황' },
      { path: '/stats/occupancy/demographics', label: '입주자 인구통계' },
    ]},
    { title: '재무통계', icon: '💰', items: [
      { path: '/stats/finance/revenue', label: '월별 매출현황' },
      { path: '/stats/finance/breakdown', label: '항목별 매출 분석' },
      { path: '/stats/finance/unpaid', label: '미수금 현황' },
      { path: '/stats/finance/deposit', label: '보증금 현황' },
      { path: '/stats/finance/collection', label: '수납률 추이' },
      { path: '/stats/finance/forecast', label: '매출 예측' },
    ]},
    { title: '운영통계', icon: '📊', items: [
      { path: '/stats/operation/service', label: '서비스 신청 통계' },
      { path: '/stats/operation/program', label: '프로그램 운영 현황' },
      { path: '/stats/operation/staff', label: '직원 업무량 분석' },
      { path: '/stats/operation/complaint', label: '민원 분석' },
      { path: '/stats/operation/leave', label: '장기외출/입원 현황' },
    ]},
    { title: '건강통계', icon: '🏥', items: [
      { path: '/stats/health/disease', label: '질환별 분포' },
      { path: '/stats/health/counseling', label: '건강상담 실적' },
      { path: '/stats/health/fall', label: '낙상사고 통계' },
      { path: '/stats/health/risk', label: '위험군 현황' },
      { path: '/stats/health/medication', label: '투약 현황' },
      { path: '/stats/health/iot', label: 'IoT 알림 분석' },
    ]},
    { title: '입주자 종합 분석', icon: '📋', items: [
      { path: '/stats/resident/all', label: '입주자 전체 데이터' },
      { path: '/stats/resident/compare', label: '입주자 비교 분석' },
      { path: '/stats/resident/risk', label: '고위험군 리포트' },
      { path: '/stats/resident/export', label: '엑셀 일괄 다운로드' },
    ]},
    { title: '경영 리포트', icon: '📑', items: [
      { path: '/stats/report/monthly', label: '월간 경영보고서' },
      { path: '/stats/report/quarterly', label: '분기 경영보고서' },
      { path: '/stats/report/annual', label: '연간 경영보고서' },
      { path: '/stats/report/custom', label: '커스텀 리포트' },
    ]},
  ],
  admin: [
    { title: '직원관리', icon: '👤', items: [
      { path: '/admin/staff/list', label: '직원등록/조회' },
      { path: '/admin/staff/schedule', label: '근무스케줄' },
      { path: '/admin/staff/permissions', label: '권한관리' },
    ]},
    { title: '시스템설정', icon: '⚙️', items: [
      { path: '/admin/settings/facility', label: '기본정보 설정' },
      { path: '/admin/settings/codes', label: '코드관리' },
      { path: '/admin/settings/fees', label: '요금설정' },
      { path: '/admin/settings/alerts', label: '알림설정' },
      { path: '/admin/settings/backup', label: '데이터 백업/복원' },
    ]},
  ],
};

interface ERPSidebarProps {
  activeTab: string;
}

export default function ERPSidebar({ activeTab }: ERPSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const groups = menuStructure[activeTab] || [];

  if (groups.length === 0) return null;

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="py-2">
        {groups.map((group) => {
          const isExpanded = expandedGroups[group.title] ?? false;
          const hasActiveItem = group.items.some((item) => location.pathname === item.path);

          return (
            <div key={group.title} className="mb-1">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.title)}
                className={`
                  w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold
                  transition-colors hover:bg-gray-50
                  ${hasActiveItem ? 'text-[#F0835A]' : 'text-gray-700'}
                `}
              >
                <span>{group.icon}</span>
                <span className="flex-1 text-left">{group.title}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menu items */}
              {isExpanded && (
                <div className="ml-4">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`
                          w-full text-left px-4 py-1.5 text-sm transition-colors
                          ${isActive
                            ? 'border-l-3 text-[#F0835A] font-medium bg-orange-50'
                            : 'border-l-3 border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }
                        `}
                        style={isActive ? { borderLeftColor: '#F0835A', borderLeftWidth: '3px' } : { borderLeftWidth: '3px', borderLeftColor: 'transparent' }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
