import React, { useState, useEffect } from 'react';
import { managementApi } from '../services/api';
import { ManagementStats as ManagementStatsType } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: '입주중',
  HOSPITALIZED: '입원중',
  OUTING: '외출중',
  DISCHARGED: '퇴소',
};

const MOBILITY_LABELS: Record<string, string> = {
  '1': '자유보행',
  '2': '보조기구',
  '3': '휠체어',
  '4': '거동불편',
};

const COGNITIVE_LABELS: Record<string, string> = {
  NORMAL: '정상',
  MILD: '경도',
  MODERATE: '중등도',
  SEVERE: '중증',
};

const GENDER_LABELS: Record<string, string> = {
  MALE: '남성',
  FEMALE: '여성',
};

const BREAKDOWN_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
];

function BreakdownBar({ data, labels }: { data: Record<string, number>; labels: Record<string, string> }) {
  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  if (total === 0) return <p className="text-sm text-gray-400">데이터 없음</p>;

  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-4 mb-3">
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`${BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length]} transition-all`}
            style={{ width: `${(value / total) * 100}%` }}
            title={`${labels[key] || key}: ${value}명`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {entries.map(([key, value], i) => (
          <div key={key} className="flex items-center gap-1.5 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length]}`} />
            <span className="text-gray-600">{labels[key] || key}</span>
            <span className="font-semibold text-gray-900">{value}명</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ManagementStats() {
  const [stats, setStats] = useState<ManagementStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await managementApi.getStats();
        setStats(res.data);
      } catch (err) {
        console.error('경영통계 조회 실패:', err);
        setError('통계 데이터를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-red-500">{error || '데이터를 불러올 수 없습니다'}</p>
      </div>
    );
  }

  const { kpi, monthlyTrends, residentBreakdown, financial } = stats;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">경영통계</h1>
        <p className="text-sm text-gray-500 mt-1">시설 운영 현황 및 주요 지표를 확인합니다</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">👥</div>
            <div>
              <p className="text-xs text-gray-500">총 입주자 / 활성</p>
              <p className="text-xl font-bold text-gray-900">
                {kpi.totalResidents} <span className="text-sm font-normal text-blue-600">/ {kpi.activeResidents}명</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">❤️</div>
            <div>
              <p className="text-xs text-gray-500">평균 건강점수</p>
              <p className="text-xl font-bold text-gray-900">
                {kpi.averageHealthScore?.toFixed(1) ?? '-'}<span className="text-sm font-normal text-gray-400">/100</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">⚠️</div>
            <div>
              <p className="text-xs text-gray-500">이번달 낙상사고</p>
              <p className="text-xl font-bold text-gray-900">
                {kpi.fallEventsThisMonth}<span className="text-sm font-normal text-gray-400">건</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">📈</div>
            <div>
              <p className="text-xs text-gray-500">입소율</p>
              <p className="text-xl font-bold text-gray-900">
                {(kpi.occupancyRate * 100).toFixed(1)}<span className="text-sm font-normal text-gray-400">%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">월별 추이</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="residents" name="입주자" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="falls" name="낙상" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="admissions" name="신규입소" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resident Breakdown */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">거주자 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">상태별</h3>
            <BreakdownBar data={residentBreakdown.byStatus} labels={STATUS_LABELS} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">이동능력별</h3>
            <BreakdownBar data={residentBreakdown.byMobility} labels={MOBILITY_LABELS} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">인지능력별</h3>
            <BreakdownBar data={residentBreakdown.byCognitive} labels={COGNITIVE_LABELS} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">성별</h3>
            <BreakdownBar data={residentBreakdown.byGender} labels={GENDER_LABELS} />
          </div>
        </div>
      </div>

      {/* Financial Stats */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">재무통계</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">월 매출</p>
            <p className="text-xl font-bold text-blue-600">
              {financial.monthlyRevenue.toLocaleString('ko-KR')}<span className="text-sm font-normal text-gray-400">원</span>
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">월 비용</p>
            <p className="text-xl font-bold text-red-500">
              {(financial.operatingCosts + financial.staffCosts).toLocaleString('ko-KR')}<span className="text-sm font-normal text-gray-400">원</span>
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">이익률</p>
            <p className={`text-xl font-bold ${financial.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(financial.profitMargin * 100).toFixed(1)}<span className="text-sm font-normal text-gray-400">%</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">월별 재무 현황</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financial.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
                <Tooltip formatter={(value: number) => value.toLocaleString('ko-KR') + '원'} />
                <Legend />
                <Bar dataKey="revenue" name="매출" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costs" name="비용" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="이익" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
