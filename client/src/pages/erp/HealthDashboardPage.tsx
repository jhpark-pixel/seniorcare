import React, { useState } from 'react';

type FilterType = '전체' | '위험군' | '주의군';

const summaryCards = [
  { label: '총 입주자', value: 38, color: 'text-gray-900', bg: 'bg-blue-50' },
  { label: '위험군', value: 5, color: 'text-red-600', bg: 'bg-red-50' },
  { label: '주의군', value: 12, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: '양호', value: 21, color: 'text-green-600', bg: 'bg-green-50' },
];

const residents = [
  { name: '김영순', room: '1관 301호', score: 75, tags: ['고혈압 주의'], status: '입주중' },
  { name: '이순자', room: '2관 205호', score: 82, tags: [], status: '입주중' },
  { name: '박정희', room: '1관 402호', score: 45, tags: ['낙상 고위험', '치매 초기'], status: '입주중' },
  { name: '최옥순', room: '2관 103호', score: 68, tags: ['당뇨 주의'], status: '입주중' },
  { name: '정미숙', room: '1관 201호', score: 88, tags: [], status: '입주중' },
  { name: '한순이', room: '2관 302호', score: 55, tags: ['저체중', '수면장애'], status: '입주중' },
  { name: '서복순', room: '2관 401호', score: 92, tags: [], status: '입주중' },
  { name: '강말숙', room: '1관 105호', score: 50, tags: ['고혈압', '낙상 위험'], status: '외출중' },
  { name: '조순옥', room: '1관 203호', score: 72, tags: ['혈당 경계'], status: '입주중' },
  { name: '배영자', room: '2관 104호', score: 38, tags: ['고혈압 위험', '저활동'], status: '입원중' },
];

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
}

function getGroup(score: number): FilterType {
  if (score < 60) return '위험군';
  if (score < 80) return '주의군';
  return '전체';
}

export default function HealthDashboardPage() {
  const [filter, setFilter] = useState<FilterType>('전체');

  const filtered = residents.filter((r) => {
    if (filter === '전체') return true;
    if (filter === '위험군') return r.score < 60;
    if (filter === '주의군') return r.score >= 60 && r.score < 80;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">전체 건강 대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">전체 입주자의 건강 상태를 한눈에 모니터링합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-lg shadow border border-gray-200 p-5`}>
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}명</div>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        {(['전체', '위험군', '주의군'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-md border ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 입주자 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['이름', '호실', '건강점수', '위험태그', '상태'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getScoreBg(r.score)} ${getScoreColor(r.score)}`}>
                      {r.score}점
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-1 flex-wrap">
                      {r.tags.length > 0 ? r.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">{t}</span>
                      )) : <span className="text-gray-400">-</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
