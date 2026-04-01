import React, { useState, useMemo } from 'react';
import { useResidents } from '../../context/AppStateContext';

type SortKey = 'name' | 'room' | 'age' | 'gender' | 'admitDate' | 'healthScore' | 'mobility' | 'cognition' | 'status';

interface ResidentRow {
  name: string;
  room: string;
  age: number;
  gender: string;
  admitDate: string;
  healthScore: number;
  mobility: string;
  cognition: string;
  disease: string;
  status: string;
  careGrade: string;
}

const statusLabel: Record<string, string> = {
  ACTIVE: '입주중',
  HOSPITALIZED: '입원중',
  OUTING: '외출중',
  DISCHARGED: '퇴소',
};

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}

export default function ResidentDataPage() {
  const [residents] = useResidents();

  const allResidents = useMemo<ResidentRow[]>(() => residents.map(r => ({
    name: r.name,
    room: `${r.building} ${r.roomNumber}호`,
    age: r.age,
    gender: r.gender === 'MALE' ? '남' : '여',
    admitDate: r.moveInDate,
    healthScore: r.healthScore,
    mobility: r.mobilityLabel,
    cognition: r.cognitiveLabelKo,
    disease: r.diseases.length > 0 ? r.diseases.join(', ') : '없음',
    status: statusLabel[r.status] ?? r.status,
    careGrade: r.careGrade,
  })), [residents]);

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let data = allResidents.filter((r) =>
      r.name.includes(search) || r.room.includes(search) || r.disease.includes(search)
    );
    data.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' ? av - (bv as number) : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [search, sortKey, sortDir]);

  const headers: { key: SortKey; label: string }[] = [
    { key: 'name', label: '이름' },
    { key: 'room', label: '호실' },
    { key: 'age', label: '나이' },
    { key: 'gender', label: '성별' },
    { key: 'admitDate', label: '입소일' },
    { key: 'healthScore', label: '건강점수' },
    { key: 'mobility', label: '이동능력' },
    { key: 'cognition', label: '인지수준' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">입주자 전체 데이터</h1>
        <p className="mt-1 text-sm text-gray-500">전체 입주자의 상세 데이터를 조회하고 내보냅니다.</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름, 호실, 질환 검색..."
          className="w-64 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={() => alert('엑셀 파일이 다운로드됩니다. (데모)')}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
        >
          엑셀 다운로드
        </button>
        <span className="ml-auto text-sm text-gray-500">총 {filtered.length}명</span>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h.key}
                    onClick={() => handleSort(h.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 whitespace-nowrap select-none"
                  >
                    {h.label} {sortKey === h.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">질환</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">케어등급</th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 whitespace-nowrap select-none"
                >
                  상태 {sortKey === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.room}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{r.age}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{r.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.admitDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getScoreColor(r.healthScore)}`}>{r.healthScore}점</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.mobility}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.cognition}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{r.disease}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.careGrade}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === '입주중' ? 'bg-green-100 text-green-700' :
                      r.status === '입원중' ? 'bg-yellow-100 text-yellow-700' :
                      r.status === '외출중' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{r.status}</span>
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
