import React from 'react';

const intentColor: Record<string, string> = {
  '희망': 'bg-green-100 text-green-800',
  '미정': 'bg-yellow-100 text-yellow-800',
  '거부': 'bg-red-100 text-red-800',
};

const mockData = [
  { name: '김영순', room: '1관 301호', start: '2025-04-15', end: '2026-04-14', remaining: 15, intent: '희망', note: '' },
  { name: '이순자', room: '2관 205호', start: '2025-05-01', end: '2026-04-30', remaining: 31, intent: '미정', note: '가족 상의 중' },
  { name: '박정희', room: '1관 402호', start: '2025-06-01', end: '2026-05-31', remaining: 62, intent: '희망', note: '동일 호실 희망' },
  { name: '최옥순', room: '2관 103호', start: '2025-04-20', end: '2026-04-19', remaining: 20, intent: '거부', note: '타 시설 이전 예정' },
  { name: '정미숙', room: '1관 201호', start: '2025-07-01', end: '2026-06-30', remaining: 92, intent: '미정', note: '' },
  { name: '한순이', room: '2관 302호', start: '2025-05-15', end: '2026-05-14', remaining: 45, intent: '희망', note: '1인실 변경 요청' },
];

export default function RenewalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">재계약대상자조회</h1>
        <p className="mt-1 text-sm text-gray-500">계약 만료 3개월 이내 입주자 목록입니다.</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['입소자명', '호실', '계약시작일', '계약종료일', '잔여일수', '재계약의향', '비고', ''].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.start}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.end}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-semibold ${r.remaining <= 30 ? 'text-red-600' : r.remaining <= 60 ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {r.remaining}일
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${intentColor[r.intent] || 'bg-gray-100 text-gray-800'}`}>
                      {r.intent}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.note || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => alert(`${r.name}님의 재계약을 처리합니다.`)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700"
                    >
                      재계약 처리
                    </button>
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
