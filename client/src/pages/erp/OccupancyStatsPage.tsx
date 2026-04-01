import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useRooms, useResidents } from '../../context/AppStateContext';

const tabs = [
  { id: 'overview', label: '거주자 종합현황', path: '/erp/occupancy-stats/overview' },
  { id: 'trend', label: '입퇴소 추이', path: '/erp/occupancy-stats/trend' },
  { id: 'pipeline', label: '계약/청약 현황', path: '/erp/occupancy-stats/pipeline' },
  { id: 'demographics', label: '인구통계', path: '/erp/occupancy-stats/demographics' },
];

export default function OccupancyStatsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [rooms] = useRooms();
  const [residents] = useResidents();

  const totalRooms = rooms.length;
  const occupiedRooms = useMemo(() => rooms.filter(r => r.status === '사용중').length, [rooms]);
  const emptyRooms = useMemo(() => rooms.filter(r => r.status === '빈방').length, [rooms]);
  const activeResidentsCount = useMemo(() => residents.filter(r => r.status !== 'DISCHARGED').length, [residents]);
  const occupancyRate = useMemo(() => ((occupiedRooms / totalRooms) * 100).toFixed(1), [occupiedRooms, totalRooms]);

  const buildingData = useMemo(() => {
    const bldg1Rooms = rooms.filter(r => r.building === '1관');
    const bldg2Rooms = rooms.filter(r => r.building === '2관');
    return [
      { building: '1관', total: bldg1Rooms.length, single: bldg1Rooms.filter(r => r.type === '1인실').length, double: bldg1Rooms.filter(r => r.type === '2인실').length, contracted: bldg1Rooms.filter(r => r.status === '사용중').length, occupied: bldg1Rooms.filter(r => r.status === '사용중').length, vacancy: bldg1Rooms.filter(r => r.status !== '사용중').length },
      { building: '2관', total: bldg2Rooms.length, single: bldg2Rooms.filter(r => r.type === '1인실').length, double: bldg2Rooms.filter(r => r.type === '2인실').length, contracted: bldg2Rooms.filter(r => r.status === '사용중').length, occupied: bldg2Rooms.filter(r => r.status === '사용중').length, vacancy: bldg2Rooms.filter(r => r.status !== '사용중').length },
    ];
  }, [rooms]);

  const kpiCards = useMemo(() => [
    { label: '총 호실수', value: String(totalRooms), unit: '실', color: 'bg-blue-50 text-blue-700', icon: '🏠' },
    { label: '계약세대', value: String(occupiedRooms), unit: '세대', color: 'bg-green-50 text-green-700', icon: '📝' },
    { label: '입주세대', value: String(activeResidentsCount), unit: '세대', color: 'bg-indigo-50 text-indigo-700', icon: '🧑‍🤝‍🧑' },
    { label: '공실', value: String(emptyRooms), unit: '실', color: 'bg-red-50 text-red-700', icon: '🚪' },
    { label: '입주율', value: occupancyRate, unit: '%', color: 'bg-amber-50 text-amber-700', icon: '📊' },
  ], [totalRooms, occupiedRooms, activeResidentsCount, emptyRooms, occupancyRate]);

  const trendData = useMemo(() => [
    { month: '2025.04', 입주율: 18.5, 입소: 2, 퇴소: 1 },
    { month: '2025.05', 입주율: 20.2, 입소: 3, 퇴소: 1 },
    { month: '2025.06', 입주율: 21.0, 입소: 2, 퇴소: 2 },
    { month: '2025.07', 입주율: 19.8, 입소: 1, 퇴소: 2 },
    { month: '2025.08', 입주율: 22.5, 입소: 4, 퇴소: 1 },
    { month: '2025.09', 입주율: 23.1, 입소: 2, 퇴소: 1 },
    { month: '2025.10', 입주율: 24.0, 입소: 3, 퇴소: 1 },
    { month: '2025.11', 입주율: 22.8, 입소: 1, 퇴소: 2 },
    { month: '2025.12', 입주율: 23.5, 입소: 2, 퇴소: 1 },
    { month: '2026.01', 입주율: 24.2, 입소: 3, 퇴소: 2 },
    { month: '2026.02', 입주율: 25.1, 입소: 2, 퇴소: 1 },
    { month: '2026.03', 입주율: parseFloat(occupancyRate), 입소: 1, 퇴소: 0 },
  ], [occupancyRate]);

  const funnelSteps = useMemo(() => [
    { label: '상담', value: 18, color: 'bg-blue-500' },
    { label: '청약', value: 14, color: 'bg-indigo-500' },
    { label: '계약', value: 11, color: 'bg-purple-500' },
    { label: '입소', value: activeResidentsCount, color: 'bg-green-500' },
  ], [activeResidentsCount]);

  const ageGroups = useMemo(() => [
    { range: '65-69세', count: residents.filter(r => r.age >= 65 && r.age < 70).length },
    { range: '70-74세', count: residents.filter(r => r.age >= 70 && r.age < 75).length },
    { range: '75-79세', count: residents.filter(r => r.age >= 75 && r.age < 80).length },
    { range: '80-84세', count: residents.filter(r => r.age >= 80 && r.age < 85).length },
    { range: '85세 이상', count: residents.filter(r => r.age >= 85).length },
  ], [residents]);

  const genderCount = useMemo(() => ({
    male: residents.filter(r => r.gender === 'MALE').length,
    female: residents.filter(r => r.gender === 'FEMALE').length,
  }), [residents]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">입소현황 통계</h1>
        <p className="mt-1 text-sm text-gray-500">세대별 입주 현황과 입소 파이프라인을 확인합니다.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* overview: 거주자 종합현황 */}
      {segment === 'overview' && (
        <div className="space-y-6">
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
                    <td className="px-4 py-3 text-center">{totalRooms}실</td>
                    <td className="px-4 py-3 text-center">{rooms.filter(r => r.type === '1인실').length}실</td>
                    <td className="px-4 py-3 text-center">{rooms.filter(r => r.type === '2인실').length}실</td>
                    <td className="px-4 py-3 text-center">{occupiedRooms}세대</td>
                    <td className="px-4 py-3 text-center">{activeResidentsCount}세대</td>
                    <td className="px-4 py-3 text-center text-red-600">{emptyRooms}실</td>
                    <td className="px-4 py-3 text-center text-blue-600">{occupancyRate}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* trend: 입퇴소 추이 차트 */}
      {segment === 'trend' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">12개월 입주율 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 50]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip formatter={(value: number) => [`${value}%`, '입주율']} />
                <Legend />
                <Line type="monotone" dataKey="입주율" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">월별 입소/퇴소 현황</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(value: number, name: string) => [`${value}명`, name]} />
                <Legend />
                <Bar dataKey="입소" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="퇴소" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* pipeline: 계약/청약 현황 */}
      {segment === 'pipeline' && (
        <div className="space-y-6">
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

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">청약/계약 대기자 현황</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">대기자명</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">단계</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">희망 호실</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">상담일</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">담당자</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '김대성', step: '청약', room: '1인실 희망', date: '2026-03-20', staff: '최민정' },
                  { name: '이순희', step: '계약', room: '2관 2인실', date: '2026-03-25', staff: '최민정' },
                  { name: '박정수', step: '상담', room: '미정', date: '2026-03-29', staff: '박준혁' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700">{row.step}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.room}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.date}</td>
                    <td className="px-4 py-3 text-gray-700">{row.staff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* demographics: 입주자 인구통계 */}
      {segment === 'demographics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">성별 분포</h3>
              <div className="flex items-center gap-6 justify-center py-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-blue-700">{genderCount.male}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">남성</p>
                  <p className="text-xs text-gray-500">{Math.round(genderCount.male / residents.length * 100)}%</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-pink-700">{genderCount.female}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">여성</p>
                  <p className="text-xs text-gray-500">{Math.round(genderCount.female / residents.length * 100)}%</p>
                </div>
              </div>
              <div className="flex h-4 rounded-full overflow-hidden mt-2">
                <div className="bg-blue-400" style={{ width: `${Math.round(genderCount.male / residents.length * 100)}%` }} />
                <div className="bg-pink-400" style={{ width: `${Math.round(genderCount.female / residents.length * 100)}%` }} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">연령대별 분포</h3>
              <div className="space-y-2">
                {ageGroups.map(group => (
                  <div key={group.range} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-16">{group.range}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-blue-400 h-4 rounded-full flex items-center justify-end pr-1"
                        style={{ width: `${(group.count / residents.length) * 100}%` }}
                      >
                        {group.count > 0 && <span className="text-[10px] text-white font-bold">{group.count}</span>}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-6">{group.count}명</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">인지/운동 능력 분포</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">나이</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">성별</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">인지능력</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">운동능력</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">건강점수</th>
                </tr>
              </thead>
              <tbody>
                {residents.filter(r => r.status !== 'DISCHARGED').map(r => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{r.age}세</td>
                    <td className="px-4 py-3 text-center text-gray-700">{r.gender === 'MALE' ? '남' : '여'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        r.cognitiveLevel === 'NORMAL' ? 'bg-green-100 text-green-800' :
                        r.cognitiveLevel === 'MILD' ? 'bg-yellow-100 text-yellow-800' :
                        r.cognitiveLevel === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>{r.cognitiveLabelKo}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{r.mobilityLabel}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${r.healthScore >= 70 ? 'text-green-600' : r.healthScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {r.healthScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
