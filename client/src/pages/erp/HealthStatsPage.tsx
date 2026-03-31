import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const diseaseData = [
  { name: '고혈압', percent: 35, count: 24, color: 'bg-red-500' },
  { name: '당뇨', percent: 28, count: 19, color: 'bg-orange-500' },
  { name: '관절염', percent: 22, count: 15, color: 'bg-yellow-500' },
  { name: '치매', percent: 18, count: 12, color: 'bg-purple-500' },
  { name: '기타', percent: 12, count: 8, color: 'bg-gray-400' },
];

const fallMonthlyData = [
  { month: '2025.10', 건수: 5 },
  { month: '2025.11', 건수: 3 },
  { month: '2025.12', 건수: 7 },
  { month: '2026.01', 건수: 4 },
  { month: '2026.02', 건수: 6 },
  { month: '2026.03', 건수: 4 },
];

const fallLocations = [
  { location: '침실', percent: 40, color: 'bg-blue-500' },
  { location: '화장실', percent: 30, color: 'bg-teal-500' },
  { location: '복도', percent: 20, color: 'bg-indigo-500' },
  { location: '기타', percent: 10, color: 'bg-gray-400' },
];

const riskResidents = [
  { name: '김영순', room: '1관 301호', score: 42, risk: '낙상 고위험', disease: '고혈압, 관절염', note: '보행보조기 사용' },
  { name: '박정희', room: '1관 402호', score: 48, risk: '인지저하', disease: '치매(중등도)', note: '야간 배회 주의' },
  { name: '정미숙', room: '1관 201호', score: 52, risk: '복합질환', disease: '당뇨, 고혈압', note: '인슐린 투여 중' },
  { name: '한순이', room: '2관 302호', score: 55, risk: '심혈관', disease: '심부전, 고혈압', note: '활동 제한 필요' },
  { name: '송복순', room: '2관 405호', score: 58, risk: '낙상 위험', disease: '골다공증', note: '최근 낙상 이력' },
];

const iotStats = {
  dailyAvg: 3.2,
  falsePositiveRate: 12,
  totalAlerts: 96,
  realAlerts: 84,
};

export default function HealthStatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">건강통계</h1>
        <p className="mt-1 text-sm text-gray-500">입주자 질환 분포, 낙상 현황, 위험군 관리 및 IoT 알림 통계를 확인합니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 질환 분포 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">질환 분포</h3>
          {/* Donut-style display */}
          <div className="flex items-center gap-6">
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  const colors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#9ca3af'];
                  return diseaseData.map((d, i) => {
                    const dash = d.percent;
                    const gap = 100 - dash;
                    const el = (
                      <circle
                        key={d.name}
                        cx="18" cy="18" r="15.915"
                        fill="none"
                        stroke={colors[i]}
                        strokeWidth="3.5"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={`${-offset}`}
                      />
                    );
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">68</span>
                <span className="text-xs text-gray-500">입주자</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {diseaseData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${d.color}`} />
                    <span className="text-sm text-gray-700">{d.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{d.count}명 ({d.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 낙상 통계 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">월별 낙상 발생 건수</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fallMonthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(value: number) => [`${value}건`, '낙상']} />
              <Bar dataKey="건수" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 낙상 장소 분포 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">낙상 발생 장소 분포</h3>
          <div className="space-y-3">
            {fallLocations.map((loc) => (
              <div key={loc.location}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{loc.location}</span>
                  <span className="font-medium text-gray-900">{loc.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${loc.color} h-3 rounded-full`}
                    style={{ width: `${loc.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IoT 알림 통계 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">IoT 알림 통계</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{iotStats.dailyAvg}</div>
              <div className="text-xs text-blue-600 mt-1">일평균 알림</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{iotStats.falsePositiveRate}%</div>
              <div className="text-xs text-red-600 mt-1">오탐율</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{iotStats.realAlerts}</div>
              <div className="text-xs text-green-600 mt-1">실제 알림 (건/월)</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">{iotStats.totalAlerts}</div>
              <div className="text-xs text-gray-600 mt-1">전체 알림 (건/월)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 위험군 입주자 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">건강점수 60 미만 위험군 입주자</h3>
          <span className="text-xs text-red-600 font-medium">{riskResidents.length}명</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-600">입주자</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">건강점수</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">위험유형</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">주요질환</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">비고</th>
            </tr>
          </thead>
          <tbody>
            {riskResidents.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-gray-700">{r.room}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${r.score < 50 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {r.score}점
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-600">{r.risk}</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{r.disease}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
