import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const kpiCards = [
  { label: '총 세대수', value: '89', unit: '실', color: 'bg-blue-50 text-blue-700', icon: '🏠' },
  { label: '계약세대', value: '72', unit: '세대', color: 'bg-green-50 text-green-700', icon: '📝' },
  { label: '입주세대', value: '68', unit: '세대', color: 'bg-indigo-50 text-indigo-700', icon: '🧑‍🤝‍🧑' },
  { label: '공실', value: '21', unit: '실', color: 'bg-red-50 text-red-700', icon: '🚪' },
  { label: '입주율', value: '76.4', unit: '%', color: 'bg-amber-50 text-amber-700', icon: '📊' },
];

const buildingData = [
  { building: '1관', total: 40, single: 24, double: 16, contracted: 33, occupied: 31, vacancy: 9 },
  { building: '2관', total: 49, single: 30, double: 19, contracted: 39, occupied: 37, vacancy: 12 },
];

const trendData = [
  { month: '2025.04', 입주율: 68.5 },
  { month: '2025.05', 입주율: 70.2 },
  { month: '2025.06', 입주율: 71.0 },
  { month: '2025.07', 입주율: 69.8 },
  { month: '2025.08', 입주율: 72.5 },
  { month: '2025.09', 입주율: 73.1 },
  { month: '2025.10', 입주율: 74.0 },
  { month: '2025.11', 입주율: 72.8 },
  { month: '2025.12', 입주율: 73.5 },
  { month: '2026.01', 입주율: 74.2 },
  { month: '2026.02', 입주율: 75.1 },
  { month: '2026.03', 입주율: 76.4 },
];

const funnelSteps = [
  { label: '상담', value: 45, color: 'bg-blue-500' },
  { label: '청약', value: 28, color: 'bg-indigo-500' },
  { label: '계약', value: 22, color: 'bg-purple-500' },
  { label: '입소', value: 18, color: 'bg-green-500' },
];

export default function OccupancyStatsPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">입소현황 통계</h1>
        <p className="mt-1 text-sm text-gray-500">세대별 입주 현황과 입소 파이프라인을 확인합니다.</p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-5 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className={`rounded-lg p-4 ${card.color} border`}>
            <div className="flex items-center gap-2 mb-1">
              <span>{card.icon}</span>
              <span className="text-xs font-medium opacity-80">{card.label}</span>
            </div>
            <div className="text-2xl font-bold">
              {card.value}<span className="text-sm font-normal ml-1">{card.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 건물별 현황 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">건물별 현황</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">건물</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">총 실수</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">1인실</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">2인실</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">계약</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">입주</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">공실</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">입주율</th>
              </tr>
            </thead>
            <tbody>
              {buildingData.map((b) => (
                <tr key={b.building} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{b.building}</td>
                  <td className="px-4 py-3 text-center">{b.total}실</td>
                  <td className="px-4 py-3 text-center">{b.single}실</td>
                  <td className="px-4 py-3 text-center">{b.double}실</td>
                  <td className="px-4 py-3 text-center">{b.contracted}세대</td>
                  <td className="px-4 py-3 text-center">{b.occupied}세대</td>
                  <td className="px-4 py-3 text-center text-red-600 font-medium">{b.vacancy}실</td>
                  <td className="px-4 py-3 text-center font-medium text-blue-600">{((b.occupied / b.total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-3 text-gray-900">합계</td>
                <td className="px-4 py-3 text-center">89실</td>
                <td className="px-4 py-3 text-center">54실</td>
                <td className="px-4 py-3 text-center">35실</td>
                <td className="px-4 py-3 text-center">72세대</td>
                <td className="px-4 py-3 text-center">68세대</td>
                <td className="px-4 py-3 text-center text-red-600">21실</td>
                <td className="px-4 py-3 text-center text-blue-600">76.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 12개월 입주율 추이 차트 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">12개월 입주율 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[60, 85]} tick={{ fontSize: 12 }} unit="%" />
            <Tooltip formatter={(value: number) => [`${value}%`, '입주율']} />
            <Legend />
            <Line type="monotone" dataKey="입주율" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 입소 파이프라인 퍼널 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">입소 파이프라인</h3>
        <div className="flex items-center justify-center gap-2">
          {funnelSteps.map((step, i) => {
            const widthPercent = 40 + (3 - i) * 15;
            const conversionRate = i > 0
              ? ((step.value / funnelSteps[i - 1].value) * 100).toFixed(1)
              : null;
            return (
              <div key={step.label} className="flex items-center gap-2">
                <div className="text-center">
                  <div
                    className={`${step.color} text-white rounded-lg py-4 px-6 mx-auto flex flex-col items-center justify-center`}
                    style={{ width: `${widthPercent * 2}px` }}
                  >
                    <span className="text-2xl font-bold">{step.value}</span>
                    <span className="text-xs mt-1 opacity-90">{step.label}</span>
                  </div>
                  {conversionRate && (
                    <span className="text-xs text-gray-500 mt-1 block">전환율 {conversionRate}%</span>
                  )}
                </div>
                {i < funnelSteps.length - 1 && (
                  <span className="text-gray-400 text-xl font-bold">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
