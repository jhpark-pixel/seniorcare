import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { dashboardApi, reportsApi } from '../services/api';
import { DashboardStats } from '../types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const categoryLabel: Record<string, string> = {
  HEALTH_REHAB: '건강재활', EXERCISE: '운동', COGNITIVE: '인지', CULTURE: '문화', SOCIAL: '사회', EXTERNAL: '외부'
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [healthAlerts, setHealthAlerts] = useState<any[]>([]);
  const [recentFalls, setRecentFalls] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [programStats, setProgramStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, alertsRes, fallsRes, monthlyRes, programRes] = await Promise.all([
        dashboardApi.stats(),
        dashboardApi.healthAlerts(),
        dashboardApi.recentFalls(),
        dashboardApi.monthlyStats(),
        dashboardApi.programStats(),
      ]);
      setStats(statsRes.data);
      setHealthAlerts(alertsRes.data.slice(0, 5));
      setRecentFalls(fallsRes.data.slice(0, 5));
      setMonthlyStats(monthlyRes.data);
      setProgramStats(programRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityReport = async () => {
    try {
      const res = await reportsApi.facilityReport();
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facility-report-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const statusCards = [
    {
      title: '총 입주자', value: stats?.residents.total || 0, icon: '👥',
      sub: `재실: ${stats?.residents.active || 0}명`, color: 'blue',
      onClick: () => navigate('/residents'),
    },
    {
      title: '입원 중', value: stats?.residents.hospitalized || 0, icon: '🏥',
      sub: '병원 입원 중', color: 'orange',
      onClick: () => navigate('/residents?status=HOSPITALIZED'),
    },
    {
      title: '미처리 낙상', value: stats?.falls.unhandled || 0, icon: '🚨',
      sub: `미열람: ${stats?.falls.unread || 0}건`, color: 'red',
      onClick: () => navigate('/fall-events'),
    },
    {
      title: '기기 이상', value: stats?.devices.lowBattery || 0, icon: '📡',
      sub: '배터리 부족/연결 끊김', color: 'yellow',
      onClick: () => navigate('/iot-devices'),
    },
    {
      title: '운영 프로그램', value: stats?.programs.active || 0, icon: '🎯',
      sub: `전체: ${stats?.programs.total || 0}개`, color: 'green',
      onClick: () => navigate('/programs'),
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };

  const programPieData = programStats?.categoryStats
    ? Object.entries(programStats.categoryStats).map(([key, val]: any) => ({
        name: categoryLabel[key] || key,
        value: val.enrolled,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-5 gap-4">
        {statusCards.map((card, i) => (
          <div
            key={i}
            onClick={card.onClick}
            className={`card cursor-pointer hover:shadow-md transition-shadow border ${colorMap[card.color]}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-2xl font-bold">{card.value}</span>
            </div>
            <p className="text-sm font-semibold">{card.title}</p>
            <p className="text-xs mt-1 opacity-70">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 월별 통계 차트 */}
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">월별 건강기록 및 낙상 현황</h3>
            <button onClick={handleFacilityReport} className="text-sm text-blue-600 hover:text-blue-800">
              📄 리포트 다운로드
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="recordCount" name="건강기록 수" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fallCount" name="낙상 건수" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 프로그램 분포 */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">프로그램 참여 현황</h3>
          {programPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={programPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {programPieData.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400">
              <p className="text-sm">데이터 없음</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 건강 이상 입주자 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">건강 주의 입주자</h3>
            <button onClick={() => navigate('/health-records')} className="text-sm text-blue-600 hover:text-blue-800">
              전체 보기 →
            </button>
          </div>
          {healthAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm">이상 입주자가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {healthAlerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => navigate(`/resident/admission/${alert.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-100"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    alert.healthScore < 40 ? 'bg-red-100 text-red-700' :
                    alert.healthScore < 70 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {alert.healthScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.name} ({alert.roomNumber}호)</p>
                    {alert.issues.length > 0 && (
                      <p className="text-xs text-red-600 truncate">{alert.issues.join(', ')}</p>
                    )}
                  </div>
                  <span className={`badge ${
                    alert.healthStatus?.color === 'red' ? 'badge-red' :
                    alert.healthStatus?.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                    'badge-yellow'
                  }`}>
                    {alert.healthStatus?.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 최근 낙상 이벤트 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">최근 낙상 이벤트</h3>
            <button onClick={() => navigate('/fall-events')} className="text-sm text-blue-600 hover:text-blue-800">
              전체 보기 →
            </button>
          </div>
          {recentFalls.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm">최근 낙상 이벤트가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFalls.map(fall => (
                <div
                  key={fall.id}
                  onClick={() => navigate('/fall-events')}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border ${
                    fall.severity === 'CRITICAL' ? 'bg-red-50 border-red-100' :
                    fall.status === 'UNHANDLED' ? 'bg-yellow-50 border-yellow-100' :
                    'bg-gray-50 border-gray-100'
                  }`}
                >
                  <span className="text-xl">{fall.severity === 'CRITICAL' ? '🚨' : '⚠️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {fall.resident?.name} ({fall.resident?.roomNumber}호)
                    </p>
                    <p className="text-xs text-gray-500">
                      {fall.location || '위치 미상'} · {new Date(fall.occurredAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <span className={`badge ${
                    fall.status === 'UNHANDLED' ? 'badge-red' :
                    fall.status === 'HANDLING' ? 'badge-yellow' : 'badge-green'
                  }`}>
                    {fall.status === 'UNHANDLED' ? '미처리' : fall.status === 'HANDLING' ? '처리중' : '완료'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
