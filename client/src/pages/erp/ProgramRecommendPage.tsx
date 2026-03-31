import React, { useState } from 'react';

const residents = ['김영순', '이순자', '박정희', '최옥순', '정미숙', '한순이', '서복순', '강말숙', '조순옥', '배영자'];

const recommendations = [
  { name: '치매예방 인지훈련', score: 95, reason: '경도인지장애 판정, 인지 훈련을 통한 악화 방지 필요' },
  { name: '낙상예방 운동교실', score: 88, reason: '하체 근력 저하 및 낙상 이력 1회, 균형감각 훈련 추천' },
  { name: '실버 요가교실', score: 82, reason: '관절 유연성 개선 및 스트레스 해소에 효과적' },
  { name: '음악치료 프로그램', score: 76, reason: '우울 경향 관찰, 정서적 안정 및 사회적 교류 촉진' },
  { name: '원예치료', score: 70, reason: '소근육 활동을 통한 손 기능 유지 및 자연 교감 효과' },
];

const currentEnrollments = [
  { name: '미술공예 활동', startDate: '2026-02-01', status: '진행중', attendance: '85%' },
  { name: '실버 체조교실', startDate: '2026-01-15', status: '진행중', attendance: '92%' },
];

export default function ProgramRecommendPage() {
  const [selected, setSelected] = useState(residents[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI 프로그램 추천</h1>
        <p className="mt-1 text-sm text-gray-500">입주자의 건강 상태와 선호도를 분석하여 최적의 프로그램을 추천합니다.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">입주자 선택</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
          {residents.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* AI 추천 프로그램 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h2 className="text-lg font-semibold text-gray-900">AI 추천 프로그램</h2>
          <span className="text-xs text-gray-400 ml-2">건강기록 및 프로필 기반 분석</span>
        </div>
        <div className="divide-y divide-gray-200">
          {recommendations.map((r, i) => (
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
              <button
                onClick={() => alert(`${selected}님의 "${r.name}" 참여 신청이 완료되었습니다.`)}
                className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700"
              >
                참여신청
              </button>
            </div>
          ))}
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
              {currentEnrollments.map((e, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{e.startDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{e.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{e.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
