import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyMealCount {
  date: string;
  label: string;
  breakfast: number;
  lunch: number;
  dinner: number;
}

const dailyData: DailyMealCount[] = [
  { date: '2026-03-24', label: '3/24(월)', breakfast: 38, lunch: 42, dinner: 40 },
  { date: '2026-03-25', label: '3/25(화)', breakfast: 36, lunch: 41, dinner: 39 },
  { date: '2026-03-26', label: '3/26(수)', breakfast: 39, lunch: 43, dinner: 41 },
  { date: '2026-03-27', label: '3/27(목)', breakfast: 37, lunch: 40, dinner: 38 },
  { date: '2026-03-28', label: '3/28(금)', breakfast: 40, lunch: 44, dinner: 42 },
  { date: '2026-03-29', label: '3/29(토)', breakfast: 35, lunch: 39, dinner: 37 },
  { date: '2026-03-30', label: '3/30(일)', breakfast: 34, lunch: 38, dinner: 36 },
];

const todayData = dailyData[dailyData.length - 1];
const totalResidents = 45;
const specialDietCount = 7;

const summaryCards = [
  { label: '오늘 아침 식수', value: todayData.breakfast, sub: `${totalResidents}명 중`, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  { label: '오늘 점심 식수', value: todayData.lunch, sub: `${totalResidents}명 중`, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { label: '오늘 저녁 식수', value: todayData.dinner, sub: `${totalResidents}명 중`, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  { label: '특별식 인원', value: specialDietCount, sub: '저염/저당/연하곤란 등', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
];

export default function MealStatsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">식사통계</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">최근 7일 식수 현황</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 50]} />
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

      {/* Daily Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">일별 식수 인원</h2>
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
  );
}
