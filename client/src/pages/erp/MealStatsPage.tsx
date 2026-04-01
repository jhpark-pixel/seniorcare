import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { daysAgo } from '../../data/mockData';
import { useResidents } from '../../context/AppStateContext';

const monthlyData = [
  { month: '2025.10', mealCost: 3850 },
  { month: '2025.11', mealCost: 3720 },
  { month: '2025.12', mealCost: 4010 },
  { month: '2026.01', mealCost: 3900 },
  { month: '2026.02', mealCost: 3680 },
  { month: '2026.03', mealCost: 3950 },
];

const tabs = [
  { id: 'daily', label: '일별 식수인원', path: '/erp/meal-stats/daily' },
  { id: 'monthly', label: '월별 식사비 산출', path: '/erp/meal-stats/monthly' },
];

export default function MealStatsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [residents] = useResidents();

  const totalResidents = useMemo(() => residents.filter(r => r.status === 'ACTIVE').length, [residents]);
  const specialDietCount = useMemo(() => residents.filter(r => r.status !== 'DISCHARGED' && r.dietaryRestrictions.length > 0).length, [residents]);

  const makeCount = (base: number) => Math.min(totalResidents, Math.max(totalResidents - 3, base));

  const dailyData = useMemo(() => [
    { date: daysAgo(6), label: `${daysAgo(6).slice(5).replace('-', '/')}(월)`, breakfast: makeCount(8), lunch: makeCount(9), dinner: makeCount(9) },
    { date: daysAgo(5), label: `${daysAgo(5).slice(5).replace('-', '/')}(화)`, breakfast: makeCount(7), lunch: makeCount(9), dinner: makeCount(8) },
    { date: daysAgo(4), label: `${daysAgo(4).slice(5).replace('-', '/')}(수)`, breakfast: makeCount(9), lunch: makeCount(9), dinner: makeCount(9) },
    { date: daysAgo(3), label: `${daysAgo(3).slice(5).replace('-', '/')}(목)`, breakfast: makeCount(8), lunch: makeCount(9), dinner: makeCount(8) },
    { date: daysAgo(2), label: `${daysAgo(2).slice(5).replace('-', '/')}(금)`, breakfast: makeCount(9), lunch: makeCount(9), dinner: makeCount(9) },
    { date: daysAgo(1), label: `${daysAgo(1).slice(5).replace('-', '/')}(토)`, breakfast: makeCount(7), lunch: makeCount(8), dinner: makeCount(8) },
    { date: daysAgo(0), label: `${daysAgo(0).slice(5).replace('-', '/')}(일)`, breakfast: makeCount(7), lunch: makeCount(8), dinner: makeCount(7) },
  ], [totalResidents]);

  const todayData = dailyData[dailyData.length - 1];

  const [selectedDate, setSelectedDate] = useState(todayData.date);
  const selectedRow = dailyData.find(d => d.date === selectedDate) ?? todayData;

  const summaryCards = [
    { label: '오늘 아침 식수', value: todayData.breakfast, sub: `${totalResidents}명 중`, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    { label: '오늘 점심 식수', value: todayData.lunch, sub: `${totalResidents}명 중`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { label: '오늘 저녁 식수', value: todayData.dinner, sub: `${totalResidents}명 중`, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
    { label: '특별식 인원', value: specialDietCount, sub: '저염/저당/연하식 등', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">식사통계</h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* daily: 일별 식수인원 */}
      {segment === 'daily' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map(card => (
              <div key={card.label} className={`rounded-xl border p-4 ${card.bg}`}>
                <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                <p className={`text-3xl font-bold ${card.color}`}>
                  {card.value}<span className="text-base font-normal text-gray-500">명</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 7일 식수 현황</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, totalResidents + 2]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value: number, name: string) => {
                      const labelMap: Record<string, string> = { breakfast: '아침', lunch: '점심', dinner: '저녁' };
                      return [`${value}명`, labelMap[name] || name];
                    }}
                  />
                  <Bar dataKey="breakfast" name="breakfast" fill="#f97316" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="lunch" name="lunch" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="dinner" name="dinner" fill="#6366f1" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded bg-orange-500"></span> 아침
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded bg-blue-500"></span> 점심
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded bg-indigo-500"></span> 저녁
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">일별 식수 인원</h2>
              <p className="text-xs text-gray-400">총 입소자(활성): {totalResidents}명 기준</p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">날짜</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-600">아침</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-600">점심</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-600">저녁</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-600">합계</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-600">평균 식수율</th>
                </tr>
              </thead>
              <tbody>
                {dailyData.map(row => {
                  const total = row.breakfast + row.lunch + row.dinner;
                  const avgRate = Math.round((total / (totalResidents * 3)) * 100);
                  return (
                    <tr key={row.date} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-medium text-gray-900">{row.label}</td>
                      <td className="px-5 py-3 text-sm text-gray-700 text-center">{row.breakfast}명</td>
                      <td className="px-5 py-3 text-sm text-gray-700 text-center">{row.lunch}명</td>
                      <td className="px-5 py-3 text-sm text-gray-700 text-center">{row.dinner}명</td>
                      <td className="px-5 py-3 text-sm text-gray-900 text-center font-medium">{total}명</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          avgRate >= 85 ? 'bg-green-100 text-green-800' :
                          avgRate >= 75 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {avgRate}%
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

      {/* monthly: 월별 식사비 산출 */}
      {segment === 'monthly' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600">이번 달 식사비 총액</p>
              <p className="text-2xl font-bold text-blue-700">3,950만<span className="text-base font-normal">원</span></p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-600">1인당 월 식사비</p>
              <p className="text-2xl font-bold text-green-700">45만<span className="text-base font-normal">원</span></p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
              <p className="text-sm text-orange-600">식재료비</p>
              <p className="text-2xl font-bold text-orange-700">2,800만<span className="text-base font-normal">원</span></p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
              <p className="text-sm text-purple-600">인건비(조리)</p>
              <p className="text-2xl font-bold text-purple-700">1,150만<span className="text-base font-normal">원</span></p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">월별 식사비 추이 (만원)</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[3000, 4500]} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value: number) => [`${value.toLocaleString()}만원`, '식사비']}
                  />
                  <Bar dataKey="mealCost" name="식사비" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">월별 식사비 상세</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-sm font-medium text-gray-600">월</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">식재료비</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">인건비</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">총 식사비</th>
                  <th className="text-right px-5 py-3 text-sm font-medium text-gray-600">1인당</th>
                  <th className="text-center px-5 py-3 text-sm font-medium text-gray-600">전월 대비</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => {
                  const prev = monthlyData[i - 1];
                  const diff = prev ? row.mealCost - prev.mealCost : 0;
                  return (
                    <tr key={row.month} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm font-medium text-gray-900">{row.month}</td>
                      <td className="px-5 py-3 text-sm text-gray-700 text-right">{Math.round(row.mealCost * 0.71).toLocaleString()}만원</td>
                      <td className="px-5 py-3 text-sm text-gray-700 text-right">{Math.round(row.mealCost * 0.29).toLocaleString()}만원</td>
                      <td className="px-5 py-3 text-sm text-gray-900 text-right font-medium">{row.mealCost.toLocaleString()}만원</td>
                      <td className="px-5 py-3 text-sm text-gray-700 text-right">{Math.round(row.mealCost / totalResidents)}만원</td>
                      <td className="px-5 py-3 text-center">
                        {i === 0 ? <span className="text-xs text-gray-400">-</span> : (
                          <span className={`text-xs font-medium ${diff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {diff > 0 ? '+' : ''}{diff}만
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">특별식 대상자 현황</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {residents.filter(r => r.status !== 'DISCHARGED' && r.dietaryRestrictions.length > 0).map(r => (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-700">{r.roomNumber}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{r.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {r.dietaryRestrictions.map(d => (
                        <span key={d} className="px-1.5 py-0.5 text-[10px] bg-orange-100 text-orange-800 rounded font-medium">{d}</span>
                      ))}
                    </div>
                  </div>
                  {r.status === 'HOSPITALIZED' && (
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-medium">입원중</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
