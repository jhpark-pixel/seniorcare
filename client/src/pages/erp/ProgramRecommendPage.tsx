import React, { useState, useMemo } from 'react';
import { useResidents } from '../../context/AppStateContext';

interface Recommendation {
  name: string;
  score: number;
  reason: string;
}

interface Enrollment {
  name: string;
  startDate: string;
  status: string;
  attendance: string;
}

// Resident-specific recommendations based on actual diseases/conditions
function getRecommendations(residentId: string, residents: any[]): Recommendation[] {
  const res = residents.find(r => r.id === residentId);
  if (!res) return [];

  const recs: Recommendation[] = [];

  // Cognitive programs for dementia/mild cognitive issues
  if (res.diseases.some(d => d.includes('치매') || d.includes('파킨슨')) || res.cognitiveLevel === 'MILD' || res.cognitiveLevel === 'MODERATE') {
    recs.push({ name: '치매예방 인지훈련', score: 95, reason: `${res.cognitiveLabelKo} 인지 상태, 인지 훈련을 통한 악화 방지 필요` });
  }

  // Fall prevention for mobility issues
  if (res.mobilityLevel >= 2) {
    recs.push({ name: '낙상예방 운동교실', score: 88, reason: `이동능력 "${res.mobilityLabel}" 단계, 균형감각 및 근력 훈련 추천` });
  }

  // Yoga for arthritis/joint issues
  if (res.diseases.some(d => d.includes('관절') || d.includes('골다공증'))) {
    recs.push({ name: '실버 요가교실', score: 84, reason: '관절 유연성 개선 및 골밀도 유지에 효과적' });
  }

  // Music therapy for depression
  if (res.diseases.some(d => d.includes('우울') || d.includes('치매'))) {
    recs.push({ name: '음악치료 프로그램', score: 79, reason: '정서적 안정 및 사회적 교류 촉진, 우울 증상 완화' });
  }

  // Horticulture therapy for everyone
  recs.push({ name: '원예치료', score: 70, reason: '소근육 활동을 통한 손 기능 유지 및 자연 교감 효과' });

  // Aerobic/exercise for pulmonary/cardiovascular issues
  if (res.diseases.some(d => d.includes('폐') || d.includes('심부전') || d.includes('혈압'))) {
    recs.push({ name: '생활체조 교실', score: 76, reason: `${res.diseases.filter(d => d.includes('폐') || d.includes('심') || d.includes('혈압')).join(', ')} 관리, 규칙적 유산소 운동 추천` });
  }

  // Sort by score descending, take top 5
  return recs.sort((a, b) => b.score - a.score).slice(0, 5);
}

function getEnrollments(residentId: string, residents: any[]): Enrollment[] {
  const res = residents.find(r => r.id === residentId);
  if (!res) return [];
  // Simulate current enrollments based on cognitive/mobility level
  const enr: Enrollment[] = [];
  if (res.mobilityLevel <= 2) {
    enr.push({ name: '아침 체조', startDate: '2026-02-01', status: '진행중', attendance: '88%' });
  }
  if (res.cognitiveLevel === 'MILD' || res.cognitiveLevel === 'NORMAL') {
    enr.push({ name: '미술공예 활동', startDate: '2026-01-15', status: '진행중', attendance: '92%' });
  }
  if (res.diseases.some(d => d.includes('우울') || d.includes('파킨슨'))) {
    enr.push({ name: '음악치료 프로그램', startDate: '2026-03-01', status: '진행중', attendance: '85%' });
  }
  return enr;
}

export default function ProgramRecommendPage() {
  const [residents] = useResidents();
  const activeResidents = useMemo(() => residents.filter(r => r.status !== 'DISCHARGED'), [residents]);

  const [selectedId, setSelectedId] = useState(activeResidents[0]?.id ?? '');
  const [enrolledPrograms, setEnrolledPrograms] = useState<Record<string, string[]>>({});

  const selectedResident = residents.find(r => r.id === selectedId);
  const recommendations = getRecommendations(selectedId, residents);
  const currentEnrollments = getEnrollments(selectedId, residents);
  const enrolledForSelected = enrolledPrograms[selectedId] ?? [];

  const handleEnroll = (programName: string) => {
    setEnrolledPrograms(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), programName],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 프로그램 추천</h1>
        <p className="mt-1 text-sm text-gray-500">입주자의 건강 상태와 선호도를 분석하여 최적의 프로그램을 추천합니다.</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm font-medium text-gray-700">입주자 선택</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {activeResidents.map((r) => (
            <option key={r.id} value={r.id}>{r.name} ({r.building} {r.roomNumber}호)</option>
          ))}
        </select>
        {selectedResident && (
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{selectedResident.careGrade}</span>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">인지: {selectedResident.cognitiveLabelKo}</span>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">이동: {selectedResident.mobilityLabel}</span>
            {selectedResident.diseases.map(d => (
              <span key={d} className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">{d}</span>
            ))}
          </div>
        )}
      </div>

      {/* AI 추천 프로그램 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <span className="text-lg">&#129302;</span>
          <h2 className="text-lg font-semibold text-gray-900">AI 추천 프로그램</h2>
          <span className="text-xs text-gray-400 ml-2">건강기록 및 프로필 기반 분석</span>
        </div>
        <div className="divide-y divide-gray-200">
          {recommendations.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">추천 프로그램이 없습니다.</div>
          )}
          {recommendations.map((r, i) => {
            const alreadyEnrolled = enrolledForSelected.includes(r.name);
            return (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">{r.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.score >= 90 ? 'bg-green-100 text-green-700' : r.score >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      추천점수 {r.score}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{r.reason}</p>
                </div>
                {alreadyEnrolled ? (
                  <span className="flex-shrink-0 px-4 py-2 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">신청완료</span>
                ) : (
                  <button
                    onClick={() => handleEnroll(r.name)}
                    className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700"
                  >
                    참여신청
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 현재 참여 중인 프로그램 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">현재 참여 중인 프로그램</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['프로그램명', '참여시작일', '상태', '출석률'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                ...currentEnrollments,
                ...enrolledForSelected.map(name => ({ name, startDate: new Date().toISOString().slice(0, 10), status: '진행중', attendance: '-' })),
              ].map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{e.startDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{e.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.attendance}</td>
                </tr>
              ))}
              {currentEnrollments.length === 0 && enrolledForSelected.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-400 text-sm">참여 중인 프로그램이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
