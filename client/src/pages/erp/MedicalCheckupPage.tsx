import React from 'react';

const mockData = [
  { id: 1, date: '2026-03-15', name: '김영순', room: '1관 301호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '혈압 경계, 콜레스테롤 약간 상승. 식이 조절 권고', nextDate: '2026-06-15' },
  { id: 2, date: '2026-03-18', name: '이순자', room: '2관 205호', type: '정밀', hospital: '시화병원', doctor: '박진수', result: '당화혈색소 7.2% 관리 필요. 인슐린 용량 조정', nextDate: '2026-06-18' },
  { id: 3, date: '2026-03-20', name: '정미숙', room: '1관 201호', type: '치과', hospital: '배곧좋은치과', doctor: '김현정', result: '틀니 조정 완료. 잇몸 염증 경미', nextDate: '2026-09-20' },
  { id: 4, date: '2026-03-22', name: '박정희', room: '1관 402호', type: '안과', hospital: '밝은눈안과', doctor: '최영미', result: '백내장 초기. 6개월 후 재검 필요', nextDate: '2026-09-22' },
  { id: 5, date: '2026-03-25', name: '최옥순', room: '2관 103호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '전반적 양호. 비타민D 부족 보충 권고', nextDate: '2026-06-25' },
  { id: 6, date: '2026-04-01', name: '한순이', room: '2관 302호', type: '정밀', hospital: '시화병원', doctor: '박진수', result: '-', nextDate: '2026-07-01' },
  { id: 7, date: '2026-04-05', name: '강순덕', room: '2관 401호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '-', nextDate: '2026-07-05' },
  { id: 8, date: '2026-04-10', name: '오말순', room: '1관 105호', type: '치과', hospital: '배곧좋은치과', doctor: '김현정', result: '-', nextDate: '2026-10-10' },
];

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '일반': 'bg-blue-100 text-blue-700',
    '정밀': 'bg-red-100 text-red-700',
    '치과': 'bg-teal-100 text-teal-700',
    '안과': 'bg-purple-100 text-purple-700',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

export default function MedicalCheckupPage() {
  const today = new Date('2026-03-30');
  const upcoming = mockData.filter(d => new Date(d.date) >= today);
  const past = mockData.filter(d => new Date(d.date) < today);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">정기검진</h1>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 검진 등록
        </button>
      </div>

      {upcoming.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">예정된 검진</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcoming.map(item => (
              <div key={item.id} className="bg-white rounded-lg border border-blue-100 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(item.type)}`}>{item.type}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>{item.date} | {item.room}</div>
                  <div>{item.hospital} - {item.doctor} 의사</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">검진 이력</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진유형</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">병원명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">담당의</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">결과요약</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">다음검진일</th>
              </tr>
            </thead>
            <tbody>
              {[...past, ...upcoming].map((row) => {
                const isPast = new Date(row.date) < today;
                return (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                      {row.date}
                      {!isPast && <span className="ml-1 text-[10px] text-blue-600 font-medium">예정</span>}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{row.hospital}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.doctor}</td>
                    <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.result || '-'}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.nextDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
