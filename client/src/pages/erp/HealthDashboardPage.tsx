import React, { useState } from 'react';
import { residents, getStatusColor } from '../../data/mockData';

type FilterType = '전체' | '위험군' | '주의군' | '양호';

interface ResidentHealthRow {
  name: string;
  room: string;
  score: number;
  tags: string[];
  status: string;
  diseases: string[];
}

function buildTags(diseases: string[], mobilityLevel: number): string[] {
  const tags: string[] = [];
  if (diseases.some(d => d.includes('고혈압'))) tags.push('고혈압 주의');
  if (diseases.some(d => d.includes('당뇨'))) tags.push('혈당 경계');
  if (diseases.some(d => d.includes('치매'))) tags.push('치매 관리');
  if (diseases.some(d => d.includes('파킨슨'))) tags.push('파킨슨 관리');
  if (diseases.some(d => d.includes('뇌졸중'))) tags.push('뇌졸중 주의');
  if (diseases.some(d => d.includes('심부전'))) tags.push('심부전 모니터링');
  if (diseases.some(d => d.includes('만성폐쇄성'))) tags.push('COPD 주의');
  if (diseases.some(d => d.includes('우울증'))) tags.push('우울증 관찰');
  if (diseases.some(d => d.includes('관절염'))) tags.push('관절 보호');
  if (diseases.some(d => d.includes('골다공증'))) tags.push('골다공증 주의');
  if (mobilityLevel >= 3) tags.push('낙상 고위험');
  return tags;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'ACTIVE': return '입주중';
    case 'HOSPITALIZED': return '입원중';
    case 'OUTING': return '외출중';
    case 'DISCHARGED': return '퇴소';
    default: return status;
  }
}

const residentRows: ResidentHealthRow[] = residents
  .filter(r => r.status !== 'DISCHARGED')
  .map(r => ({
    name: r.name,
    room: `${r.building} ${r.roomNumber}호`,
    score: r.healthScore,
    tags: buildTags(r.diseases, r.mobilityLevel),
    status: statusLabel(r.status),
    diseases: r.diseases,
  }));

const totalCount = residentRows.length;
const dangerCount = residentRows.filter(r => r.score < 60).length;
const cautionCount = residentRows.filter(r => r.score >= 60 && r.score < 80).length;
const goodCount = residentRows.filter(r => r.score >= 80).length;

const summaryCards = [
  { label: '총 입주자', value: totalCount, color: 'text-gray-900', bg: 'bg-blue-50' },
  { label: '위험군', value: dangerCount, color: 'text-red-600', bg: 'bg-red-50' },
  { label: '주의군', value: cautionCount, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: '양호', value: goodCount, color: 'text-green-600', bg: 'bg-green-50' },
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

export default function HealthDashboardPage() {
  const [filter, setFilter] = useState<FilterType>('전체');
  const [search, setSearch] = useState('');

  const filtered = residentRows.filter((r) => {
    const matchesSearch = search === '' || r.name.includes(search);
    if (!matchesSearch) return false;
    if (filter === '전체') return true;
    if (filter === '위험군') return r.score < 60;
    if (filter === '주의군') return r.score >= 60 && r.score < 80;
    if (filter === '양호') return r.score >= 80;
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

      {/* 필터 + 검색 */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2">
          {(['전체', '위험군', '주의군', '양호'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="입주자명 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ml-auto border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 w-48"
        />
      </div>

      {/* 입주자 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['이름', '호실', '질환', '건강점수', '위험태그', '상태'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex gap-1 flex-wrap">
                      {r.diseases.map(d => (
                        <span key={d} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{d}</span>
                      ))}
                    </div>
                  </td>
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
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(r.status === '입주중' ? 'ACTIVE' : r.status === '입원중' ? 'HOSPITALIZED' : r.status === '외출중' ? 'OUTING' : 'DISCHARGED')}`}>
                      {r.status}
                    </span>
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
