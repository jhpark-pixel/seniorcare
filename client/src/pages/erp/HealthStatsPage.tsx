import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useResidents } from '../../context/AppStateContext';

const diseaseGroups = [
  { name: '고혈압', aliases: ['고혈압'] },
  { name: '당뇨병', aliases: ['당뇨병', '당뇨'] },
  { name: '관절염', aliases: ['관절염'] },
  { name: '치매', aliases: ['치매'] },
  { name: '기타', aliases: [] as string[] },
];
const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-purple-500', 'bg-gray-400'];
const svgColors = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#9ca3af'];

const fallMonthlyData = [
  { month: '2025.10', 건수: 2 },
  { month: '2025.11', 건수: 1 },
  { month: '2025.12', 건수: 3 },
  { month: '2026.01', 건수: 1 },
  { month: '2026.02', 건수: 2 },
  { month: '2026.03', 건수: 1 },
];

const fallLocations = [
  { location: '침실', percent: 40, color: 'bg-blue-500' },
  { location: '화장실', percent: 30, color: 'bg-teal-500' },
  { location: '복도', percent: 20, color: 'bg-indigo-500' },
  { location: '기타', percent: 10, color: 'bg-gray-400' },
];

const iotStats = {
  dailyAvg: 2.8,
  falsePositiveRate: 10,
  totalAlerts: 84,
  realAlerts: 76,
};

const counselingData = [
  { month: '2025.10', 건수: 12 },
  { month: '2025.11', 건수: 15 },
  { month: '2025.12', 건수: 10 },
  { month: '2026.01', 건수: 13 },
  { month: '2026.02', 건수: 16 },
  { month: '2026.03', 건수: 14 },
];

const tabs = [
  { id: 'disease', label: '질환 분포', path: '/stats/health/disease' },
  { id: 'counseling', label: '상담 현황', path: '/stats/health/counseling' },
  { id: 'fall', label: '낙상 통계', path: '/stats/health/fall' },
  { id: 'risk', label: '위험군 관리', path: '/stats/health/risk' },
  { id: 'medication', label: '투약 현황', path: '/stats/health/medication' },
  { id: 'iot', label: 'IoT 알림', path: '/stats/health/iot' },
];

export default function HealthStatsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [residents] = useResidents();

  const diseaseData = useMemo(() => {
    const allDiseases = residents.flatMap(r => r.diseases);
    const diseaseCounts: Record<string, number> = {};
    allDiseases.forEach(d => { diseaseCounts[d] = (diseaseCounts[d] || 0) + 1; });
    const knownNames = new Set<string>();
    return diseaseGroups.map((g, i) => {
      let count = 0;
      if (g.aliases.length > 0) {
        g.aliases.forEach(a => { count += diseaseCounts[a] || 0; knownNames.add(a); });
      } else {
        count = allDiseases.filter(d => !knownNames.has(d)).length;
      }
      const percent = Math.round((count / residents.length) * 100);
      return { name: g.name, percent, count, color: colors[i], svgColor: svgColors[i] };
    });
  }, [residents]);

  const riskResidents = useMemo(() =>
    residents
      .filter(r => r.healthScore < 60)
      .sort((a, b) => a.healthScore - b.healthScore)
      .map(r => ({
        name: r.name,
        room: `${r.building} ${r.roomNumber}호`,
        score: r.healthScore,
        risk: r.healthScore < 50 ? '낙상 고위험' : r.cognitiveLevel !== 'NORMAL' ? '인지저하' : '복합질환',
        disease: r.diseases.join(', '),
        note: r.mobilityLevel >= 3 ? '이동 보조 필요' : r.cognitiveLevel === 'SEVERE' ? '야간 배회 주의' : '정기 모니터링',
      })),
    [residents],
  );

  const medicationData = useMemo(() =>
    residents
      .filter(r => r.status !== 'DISCHARGED' && r.medications.filter(m => m.isActive).length > 0)
      .map(r => ({
        name: r.name,
        room: `${r.building} ${r.roomNumber}호`,
        count: r.medications.filter(m => m.isActive).length,
        meds: r.medications.filter(m => m.isActive).map(m => m.name).join(', '),
      })),
    [residents],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">건강통계</h1>
        <p className="mt-1 text-sm text-gray-500">입주자 질환 분포, 낙상 현황, 위험군 관리 및 IoT 알림 통계를 확인합니다.</p>
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

      {/* disease: 질환 분포 */}
      {segment === 'disease' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">질환 분포</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {(() => {
                    let offset = 0;
                    return diseaseData.map((d, i) => {
                      const dash = d.percent;
                      const gap = 100 - dash;
                      const el = (
                        <circle key={d.name} cx="18" cy="18" r="15.915" fill="none" stroke={d.svgColor} strokeWidth="3.5" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={`${-offset}`} />
                      );
                      offset += dash;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{residents.length}</span>
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
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">입주자별 주요 질환</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">주요 질환</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">건강점수</th>
                </tr>
              </thead>
              <tbody>
                {residents.filter(r => r.status !== 'DISCHARGED').map(r => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-700">{r.diseases.join(', ') || '없음'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${r.healthScore >= 70 ? 'text-green-600' : r.healthScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{r.healthScore}점</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* counseling: 상담 현황 */}
      {segment === 'counseling' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">이번 달 상담</p>
              <p className="text-2xl font-bold text-blue-700">14건</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium">상담 완료</p>
              <p className="text-2xl font-bold text-green-700">12건</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-xs text-orange-600 font-medium">추후 상담 필요</p>
              <p className="text-2xl font-bold text-orange-700">2건</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">월별 상담 건수</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={counselingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(value: number) => [`${value}건`, '상담']} />
                <Bar dataKey="건수" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">최근 상담 내역</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">날짜</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">상담 유형</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">담당자</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">결과</th>
                </tr>
              </thead>
              <tbody>
                {residents.filter(r => r.status !== 'DISCHARGED').slice(0, 5).map((r, i) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">2026-03-{28 - i}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-700">{['건강상담', '가족상담', '생활상담', '투약상담', '재활상담'][i]}</td>
                    <td className="px-4 py-3 text-gray-700">{['김서연', '이하은', '최민정', '김서연', '이하은'][i]}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">완료</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* fall: 낙상 통계 */}
      {segment === 'fall' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">월별 낙상 발생 건수</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={fallMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip formatter={(value: number) => [`${value}건`, '낙상']} />
                  <Bar dataKey="건수" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">낙상 발생 장소 분포</h3>
              <div className="space-y-3 mt-4">
                {fallLocations.map((loc) => (
                  <div key={loc.location}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{loc.location}</span>
                      <span className="font-medium text-gray-900">{loc.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`${loc.color} h-3 rounded-full`} style={{ width: `${loc.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-xs text-red-600 font-medium">6개월 총 낙상</p>
              <p className="text-2xl font-bold text-red-700">{fallMonthlyData.reduce((s, d) => s + d.건수, 0)}건</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-xs text-orange-600 font-medium">월 평균</p>
              <p className="text-2xl font-bold text-orange-700">{(fallMonthlyData.reduce((s, d) => s + d.건수, 0) / 6).toFixed(1)}건</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-xs text-yellow-600 font-medium">최다 발생월</p>
              <p className="text-2xl font-bold text-yellow-700">2025.12</p>
            </div>
          </div>
        </div>
      )}

      {/* risk: 위험군 관리 */}
      {segment === 'risk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-xs text-red-600 font-medium">건강점수 60 미만</p>
              <p className="text-2xl font-bold text-red-700">{riskResidents.length}명</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-xs text-orange-600 font-medium">50점 미만 고위험</p>
              <p className="text-2xl font-bold text-orange-700">{riskResidents.filter(r => r.score < 50).length}명</p>
            </div>
          </div>
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
                      <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${r.score < 50 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{r.score}점</span>
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
      )}

      {/* medication: 투약 현황 */}
      {segment === 'medication' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">투약 중인 입소자</p>
              <p className="text-2xl font-bold text-blue-700">{medicationData.length}명</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <p className="text-xs text-purple-600 font-medium">총 활성 처방</p>
              <p className="text-2xl font-bold text-purple-700">{medicationData.reduce((s, r) => s + r.count, 0)}건</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-xs text-orange-600 font-medium">평균 투약 수</p>
              <p className="text-2xl font-bold text-orange-700">
                {medicationData.length > 0 ? (medicationData.reduce((s, r) => s + r.count, 0) / medicationData.length).toFixed(1) : 0}개
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">입소자별 투약 현황</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">투약 수</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">투약 목록</th>
                </tr>
              </thead>
              <tbody>
                {medicationData.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-700">{r.room}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${r.count >= 4 ? 'bg-red-100 text-red-700' : r.count >= 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{r.count}개</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{r.meds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* iot: IoT 알림 통계 */}
      {segment === 'iot' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
                      <div className={`${loc.color} h-3 rounded-full`} style={{ width: `${loc.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">IoT 장치 설치 현황</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">위치</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">장치 유형</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">상태</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">이번 달 알림</th>
                </tr>
              </thead>
              <tbody>
                {residents.filter(r => r.status !== 'DISCHARGED').slice(0, 6).map(r => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.building} {r.roomNumber}호</td>
                    <td className="px-4 py-3 text-center text-gray-700">낙상감지 센서</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">정상</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">{Math.floor(Math.random() * 5 + 1)}건</td>
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
