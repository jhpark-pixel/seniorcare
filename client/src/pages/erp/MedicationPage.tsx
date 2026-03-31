import React from 'react';

const mockData = [
  { id: 1, name: '김영순', room: '1관 301호', drug: '아모디핀 5mg', dose: '1정', times: ['아침'], doctor: '이상훈', prescDate: '2026-01-15', status: '활성' },
  { id: 2, name: '김영순', room: '1관 301호', drug: '메트포르민 500mg', dose: '1정', times: ['아침', '저녁'], doctor: '이상훈', prescDate: '2026-02-10', status: '활성' },
  { id: 3, name: '김영순', room: '1관 301호', drug: '아스피린 100mg', dose: '1정', times: ['아침'], doctor: '이상훈', prescDate: '2025-11-05', status: '활성' },
  { id: 4, name: '이순자', room: '2관 205호', drug: '인슐린 글라진', dose: '14단위', times: ['아침'], doctor: '박진수', prescDate: '2026-03-01', status: '활성' },
  { id: 5, name: '이순자', room: '2관 205호', drug: '메트포르민 1000mg', dose: '1정', times: ['아침', '저녁'], doctor: '박진수', prescDate: '2026-03-01', status: '활성' },
  { id: 6, name: '이순자', room: '2관 205호', drug: '아토르바스타틴 20mg', dose: '1정', times: ['저녁'], doctor: '박진수', prescDate: '2026-01-20', status: '활성' },
  { id: 7, name: '이순자', room: '2관 205호', drug: '오메프라졸 20mg', dose: '1캡슐', times: ['아침'], doctor: '박진수', prescDate: '2026-02-15', status: '활성' },
  { id: 8, name: '이순자', room: '2관 205호', drug: '글리메피리드 2mg', dose: '1정', times: ['아침'], doctor: '박진수', prescDate: '2026-03-01', status: '활성' },
  { id: 9, name: '박정희', room: '1관 402호', drug: '도네페질 10mg', dose: '1정', times: ['취침전'], doctor: '최영미', prescDate: '2025-10-20', status: '활성' },
  { id: 10, name: '한순이', room: '2관 302호', drug: '와파린 3mg', dose: '1정', times: ['저녁'], doctor: '박진수', prescDate: '2026-02-01', status: '활성' },
  { id: 11, name: '정미숙', room: '1관 201호', drug: '졸피뎀 5mg', dose: '1정', times: ['취침전'], doctor: '이상훈', prescDate: '2026-03-10', status: '활성' },
  { id: 12, name: '최옥순', room: '2관 103호', drug: '로사르탄 50mg', dose: '1정', times: ['아침'], doctor: '이상훈', prescDate: '2026-01-05', status: '중단' },
];

const timeBadge = (time: string) => {
  const map: Record<string, string> = {
    '아침': 'bg-yellow-100 text-yellow-700',
    '점심': 'bg-green-100 text-green-700',
    '저녁': 'bg-blue-100 text-blue-700',
    '취침전': 'bg-purple-100 text-purple-700',
  };
  return map[time] || 'bg-gray-100 text-gray-600';
};

export default function MedicationPage() {
  const activeCount = mockData.filter(d => d.status === '활성').length;
  const uniqueResidents = new Set(mockData.filter(d => d.status === '활성').map(d => d.name)).size;

  // 다약제 복용자 (5종 이상)
  const countByResident: Record<string, number> = {};
  mockData.filter(d => d.status === '활성').forEach(d => {
    countByResident[d.name] = (countByResident[d.name] || 0) + 1;
  });
  const polypharmacy = Object.entries(countByResident).filter(([, c]) => c >= 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">투약관리</h1>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 처방 등록
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{uniqueResidents}</div>
          <div className="text-xs text-gray-500 mt-1">전체 투약자</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          <div className="text-xs text-gray-500 mt-1">활성 처방</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{polypharmacy.length}</div>
          <div className="text-xs text-gray-500 mt-1">다약제 복용자 (5종 이상)</div>
        </div>
      </div>

      {polypharmacy.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">다약제 복용 주의 대상자</h3>
          <div className="space-y-1">
            {polypharmacy.map(([name, count]) => (
              <div key={name} className="text-sm text-red-700">
                {name} - {count}종 복용 중
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">투약 목록 ({mockData.length}건)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">약물명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">용량</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">복용시간</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처방의</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처방일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50 ${row.status === '중단' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                  <td className="px-4 py-2.5 text-gray-700 font-medium">{row.drug}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.dose}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 flex-wrap">
                      {row.times.map(t => (
                        <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${timeBadge(t)}`}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{row.doctor}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.prescDate}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${row.status === '활성' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {row.status}
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
