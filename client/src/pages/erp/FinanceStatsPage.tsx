import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const kpiCards = [
  { label: '월 매출', value: '2.38억', color: 'bg-blue-50 text-blue-700', icon: '💰', sub: '전월 대비 +3.2%' },
  { label: '운영비', value: '1.67억', color: 'bg-orange-50 text-orange-700', icon: '📋', sub: '전월 대비 -1.5%' },
  { label: '순이익', value: '7,140만', color: 'bg-green-50 text-green-700', icon: '📈', sub: '영업이익률 30.0%' },
  { label: '미수금', value: '1,200만', color: 'bg-red-50 text-red-700', icon: '⚠️', sub: '3건 60일 초과' },
];

const monthlyData = [
  { month: '2025.10', 매출: 22100, 운영비: 16200 },
  { month: '2025.11', 매출: 22800, 운영비: 16500 },
  { month: '2025.12', 매출: 23000, 운영비: 17100 },
  { month: '2026.01', 매출: 23200, 운영비: 16800 },
  { month: '2026.02', 매출: 23500, 운영비: 16900 },
  { month: '2026.03', 매출: 23800, 운영비: 16700 },
];

const revenueBreakdown = [
  { label: '관리비', percent: 55, amount: '1.31억', color: 'bg-blue-500' },
  { label: '식사비', percent: 25, amount: '5,950만', color: 'bg-green-500' },
  { label: '수도광열비', percent: 10, amount: '2,380만', color: 'bg-amber-500' },
  { label: '서비스비', percent: 10, amount: '2,380만', color: 'bg-purple-500' },
];

const unpaidData = [
  { name: '김영순', room: '1관 301호', amount: '320만원', period: '3개월', status: '독촉 완료' },
  { name: '이순자', room: '2관 205호', amount: '280만원', period: '2개월', status: '납부 약속' },
  { name: '박정희', room: '1관 402호', amount: '250만원', period: '2개월', status: '가족 연락중' },
  { name: '최옥순', room: '2관 103호', amount: '200만원', period: '1개월', status: '미연락' },
  { name: '정미숙', room: '1관 201호', amount: '150만원', period: '1개월', status: '납부 예정' },
];

export default function FinanceStatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">재무통계</h1>
        <p className="mt-1 text-sm text-gray-500">매출, 운영비, 미수금 현황을 확인합니다.</p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className={`rounded-lg p-4 ${card.color} border`}>
            <div className="flex items-center gap-2 mb-1">
              <span>{card.icon}</span>
              <span className="text-xs font-medium opacity-80">{card.label}</span>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-xs mt-1 opacity-70">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 6개월 매출/운영비 차트 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">6개월 매출/운영비 추이 (만원)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}만원`]} />
              <Legend />
              <Bar dataKey="매출" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="운영비" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 항목별 매출 비율 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">항목별 매출 비율</h3>
          <div className="space-y-4 mt-6">
            {revenueBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-500">{item.amount} ({item.percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full transition-all`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 justify-center">
            {revenueBreakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                {item.label} {item.percent}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 미납 현황 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">미납 현황</h3>
          <span className="text-xs text-red-600 font-medium">총 미수금 1,200만원</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">입주자</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">미납금액</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">미납기간</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {unpaidData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.room}</td>
                  <td className="px-4 py-3 text-right text-red-600 font-medium">{row.amount}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{row.period}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
