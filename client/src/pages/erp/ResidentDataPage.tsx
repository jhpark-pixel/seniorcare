import React, { useState, useMemo } from 'react';

type SortKey = 'name' | 'room' | 'age' | 'gender' | 'admitDate' | 'healthScore' | 'mobility' | 'cognition' | 'status';

const allResidents = [
  { name: '김영순', room: '1관 301호', age: 82, gender: '여', admitDate: '2024-03-15', healthScore: 75, mobility: '자유보행', cognition: '정상', disease: '고혈압, 관절염', status: '입주중' },
  { name: '이순자', room: '2관 205호', age: 78, gender: '여', admitDate: '2024-05-01', healthScore: 82, mobility: '자유보행', cognition: '정상', disease: '당뇨', status: '입주중' },
  { name: '박정희', room: '1관 402호', age: 85, gender: '여', admitDate: '2023-11-20', healthScore: 45, mobility: '보조기 필요', cognition: '경도인지장애', disease: '치매초기, 골다공증', status: '입주중' },
  { name: '최옥순', room: '2관 103호', age: 79, gender: '여', admitDate: '2024-01-10', healthScore: 68, mobility: '자유보행', cognition: '정상', disease: '당뇨, 고지혈증', status: '입주중' },
  { name: '정미숙', room: '1관 201호', age: 76, gender: '여', admitDate: '2024-07-01', healthScore: 88, mobility: '자유보행', cognition: '정상', disease: '없음', status: '입주중' },
  { name: '한순이', room: '2관 302호', age: 84, gender: '여', admitDate: '2023-09-15', healthScore: 55, mobility: '보조기 필요', cognition: '경도인지장애', disease: '고혈압, 뇌경색 병력', status: '외출중' },
  { name: '서복순', room: '2관 401호', age: 81, gender: '여', admitDate: '2024-02-28', healthScore: 92, mobility: '자유보행', cognition: '정상', disease: '없음', status: '입주중' },
  { name: '강말숙', room: '1관 105호', age: 87, gender: '여', admitDate: '2023-06-10', healthScore: 50, mobility: '휠체어', cognition: '중등도 인지장애', disease: '파킨슨, 고혈압', status: '입원중' },
  { name: '조순옥', room: '1관 203호', age: 77, gender: '여', admitDate: '2024-08-20', healthScore: 72, mobility: '자유보행', cognition: '정상', disease: '관절염', status: '입주중' },
  { name: '배영자', room: '2관 104호', age: 83, gender: '여', admitDate: '2024-04-05', healthScore: 38, mobility: '거동불편', cognition: '중등도 인지장애', disease: '심부전, 고혈압, 당뇨', status: '입원중' },
];

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}

export default function ResidentDataPage() {
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
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
