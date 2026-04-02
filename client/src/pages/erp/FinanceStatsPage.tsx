import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useResidents } from '../../context/AppStateContext';

function buildUnpaidData(unpaidResidents: any[]) {
  return [
    { name: unpaidResidents[0]?.name ?? '한말순', room: `${unpaidResidents[0]?.building ?? '2관'} ${unpaidResidents[0]?.roomNumber ?? '201'}호`, amount: '320만원', period: '3개월', status: '독촉 완료' },
    { name: unpaidResidents[1]?.name ?? '송미경', room: `${unpaidResidents[1]?.building ?? '2관'} ${unpaidResidents[1]?.roomNumber ?? '205'}호`, amount: '280만원', period: '2개월', status: '납부 약속' },
    { name: unpaidResidents[2]?.name ?? '윤태식', room: `${unpaidResidents[2]?.building ?? '2관'} ${unpaidResidents[2]?.roomNumber ?? '207'}호`, amount: '250만원', period: '2개월', status: '가족 연락중' },
    { name: unpaidResidents[3]?.name ?? '이복자', room: `${unpaidResidents[3]?.building ?? '1관'} ${unpaidResidents[3]?.roomNumber ?? '103'}호`, amount: '200만원', period: '1개월', status: '미연락' },
    { name: unpaidResidents[4]?.name ?? '최순남', room: `${unpaidResidents[4]?.building ?? '1관'} ${unpaidResidents[4]?.roomNumber ?? '107'}호`, amount: '150만원', period: '1개월', status: '납부 예정' },
  ];
}

function buildDepositData(unpaidResidents: any[]) {
  return [
    { name: unpaidResidents[0]?.name ?? '-', deposit: 5000, type: '1인실(A)' },
    { name: unpaidResidents[1]?.name ?? '-', deposit: 4000, type: '1인실(B)' },
    { name: unpaidResidents[2]?.name ?? '-', deposit: 3000, type: '2인실(A)' },
    { name: unpaidResidents[3]?.name ?? '-', deposit: 2500, type: '2인실(B)' },
    { name: unpaidResidents[4]?.name ?? '-', deposit: 8000, type: '특실' },
  ];
}

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

const forecastData = [
  { month: '2026.04', 매출예측: 24100, 운영비예측: 16800 },
  { month: '2026.05', 매출예측: 24400, 운영비예측: 17000 },
  { month: '2026.06', 매출예측: 24800, 운영비예측: 17200 },
];

const tabs = [
  { id: 'revenue', label: '매출 현황', path: '/stats/finance/revenue' },
  { id: 'breakdown', label: '항목별 분석', path: '/stats/finance/breakdown' },
  { id: 'unpaid', label: '미납 현황', path: '/stats/finance/unpaid' },
  { id: 'deposit', label: '보증금 현황', path: '/stats/finance/deposit' },
  { id: 'collection', label: '수납 현황', path: '/stats/finance/collection' },
  { id: 'forecast', label: '수익 예측', path: '/stats/finance/forecast' },
];

export default function FinanceStatsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [residents] = useResidents();
  const unpaidResidents = useMemo(() =>
    residents.filter(r => r.status !== 'DISCHARGED').sort((a, b) => a.healthScore - b.healthScore).slice(0, 5),
    [residents],
  );
  const unpaidData = useMemo(() => buildUnpaidData(unpaidResidents), [unpaidResidents]);
  const depositData = useMemo(() => buildDepositData(unpaidResidents), [unpaidResidents]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">재무통계</h1>
        <p className="mt-1 text-sm text-gray-500">매출, 운영비, 미수금 현황을 확인합니다.</p>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* revenue: 매출 현황 */}
      {segment === 'revenue' && (
        <div className="space-y-6">
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
        </div>
      )}

      {/* breakdown: 항목별 분석 */}
      {segment === 'breakdown' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {kpiCards.map((card) => (
              <div key={card.label} className={`rounded-lg p-4 ${card.color} border`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{card.icon}</span>
                  <span className="text-xs font-medium opacity-80">{card.label}</span>
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
              </div>
            ))}
          </div>
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
                    <div className={`${item.color} h-3 rounded-full transition-all`} style={{ width: `${item.percent}%` }} />
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
      )}

      {/* unpaid: 미납 현황 */}
      {segment === 'unpaid' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-xs text-red-600 font-medium">총 미수금</p>
              <p className="text-2xl font-bold text-red-700">1,200만원</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-xs text-orange-600 font-medium">미납 건수</p>
              <p className="text-2xl font-bold text-orange-700">{unpaidData.length}건</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-xs text-yellow-600 font-medium">60일 초과</p>
              <p className="text-2xl font-bold text-yellow-700">3건</p>
            </div>
          </div>
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
      )}

      {/* deposit: 보증금 현황 */}
      {segment === 'deposit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">총 보증금 수탁액</p>
              <p className="text-2xl font-bold text-blue-700">22,500만원</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium">평균 보증금</p>
              <p className="text-2xl font-bold text-green-700">4,500만원</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">호실 유형별 보증금 현황</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">입주자</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">호실 유형</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">보증금</th>
                </tr>
              </thead>
              <tbody>
                {depositData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{row.type}</td>
                    <td className="px-4 py-3 text-right font-medium text-blue-700">{row.deposit.toLocaleString()}만원</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* collection: 수납 현황 */}
      {segment === 'collection' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium">이번 달 수납 완료</p>
              <p className="text-2xl font-bold text-green-700">2.26억원</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">수납률</p>
              <p className="text-2xl font-bold text-blue-700">94.9%</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-xs text-red-600 font-medium">미수납</p>
              <p className="text-2xl font-bold text-red-700">1,200만원</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">월별 수납 현황</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">월</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">청구액</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">수납액</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">미수납</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">수납률</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => {
                  const unpaid = Math.round(row.매출 * (i === monthlyData.length - 1 ? 0.05 : 0.01));
                  const collected = row.매출 - unpaid;
                  return (
                    <tr key={row.month} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.month}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.매출.toLocaleString()}만원</td>
                      <td className="px-4 py-3 text-right text-green-700 font-medium">{collected.toLocaleString()}만원</td>
                      <td className="px-4 py-3 text-right text-red-600">{unpaid.toLocaleString()}만원</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${collected / row.매출 >= 0.95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {((collected / row.매출) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* forecast: 수익 예측 */}
      {segment === 'forecast' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-1">AI 기반 수익 예측</h3>
            <p className="text-xs text-blue-700">최근 6개월 실적 데이터를 기반으로 향후 3개월 매출을 예측합니다.</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">매출/운영비 예측 (만원)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={[...monthlyData, ...forecastData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()}만원`]} />
                <Legend />
                <Line type="monotone" dataKey="매출" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="운영비" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="매출예측" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="운영비예측" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 mt-2 text-center">점선: 예측값 | 실선: 실적값</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {forecastData.map(row => (
              <div key={row.month} className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-medium mb-2">{row.month} 예측</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">매출</span>
                    <span className="font-bold text-blue-700">{row.매출예측.toLocaleString()}만원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">운영비</span>
                    <span className="font-bold text-orange-700">{row.운영비예측.toLocaleString()}만원</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-100 pt-1">
                    <span className="text-gray-600">순이익 예측</span>
                    <span className="font-bold text-green-700">{(row.매출예측 - row.운영비예측).toLocaleString()}만원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
