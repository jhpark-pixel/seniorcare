import React from 'react';

const today = '2026-03-30';

const mockData = [
  { id: 1, datetime: '2026-03-30 09:00', name: '김영순', room: '1관 301호', type: '일반건강', counselor: '간호사 김미영', summary: '혈압 상승 경향에 대한 생활습관 상담', status: '완료' },
  { id: 2, datetime: '2026-03-30 10:00', name: '이순자', room: '2관 205호', type: '투약', counselor: '간호사 이정은', summary: '당뇨약 변경 후 부작용 여부 확인', status: '완료' },
  { id: 3, datetime: '2026-03-30 11:00', name: '박정희', room: '1관 402호', type: '정기검진', counselor: '간호사 김미영', summary: '정기검진 결과 안내 및 후속 조치 상담', status: '예약' },
  { id: 4, datetime: '2026-03-30 14:00', name: '최옥순', room: '2관 103호', type: '운동', counselor: '생활지도사 최은영', summary: '관절염 완화를 위한 운동 프로그램 상담', status: '예약' },
  { id: 5, datetime: '2026-03-30 15:00', name: '한순이', room: '2관 302호', type: '외래', counselor: '간호사 이정은', summary: '심장내과 외래 진료 결과 상담', status: '예약' },
  { id: 6, datetime: '2026-03-29 09:30', name: '정미숙', room: '1관 201호', type: '일반건강', counselor: '간호사 김미영', summary: '수면 장애 관련 상담 및 생활 지도', status: '완료' },
  { id: 7, datetime: '2026-03-29 11:00', name: '오말순', room: '1관 105호', type: '투약', counselor: '간호사 이정은', summary: '고혈압약 복용 시간 조정 상담', status: '완료' },
  { id: 8, datetime: '2026-03-28 14:00', name: '강순덕', room: '2관 401호', type: '정기검진', counselor: '간호사 김미영', summary: '혈액검사 결과 이상 소견 상담', status: '완료' },
  { id: 9, datetime: '2026-03-31 10:00', name: '윤복순', room: '1관 302호', type: '운동', counselor: '생활지도사 최은영', summary: '낙상 예방 운동 프로그램 안내', status: '예약' },
  { id: 10, datetime: '2026-03-28 09:00', name: '신영자', room: '2관 201호', type: '외래', counselor: '간호사 이정은', summary: '안과 외래 진료 결과 및 안약 사용법 안내', status: '취소' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '예약': 'bg-blue-100 text-blue-700',
    '완료': 'bg-green-100 text-green-700',
    '취소': 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '일반건강': 'bg-teal-100 text-teal-700',
    '외래': 'bg-purple-100 text-purple-700',
    '정기검진': 'bg-indigo-100 text-indigo-700',
    '운동': 'bg-orange-100 text-orange-700',
    '투약': 'bg-pink-100 text-pink-700',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

export default function HealthCounselingPage() {
  const todayCount = mockData.filter(d => d.datetime.startsWith(today)).length;
  const completedCount = mockData.filter(d => d.status === '완료').length;
  const reservedCount = mockData.filter(d => d.status === '예약').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">건강상담</h1>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 상담 예약
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{todayCount}</div>
          <div className="text-xs text-gray-500 mt-1">오늘 상담</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-xs text-gray-500 mt-1">완료</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{reservedCount}</div>
          <div className="text-xs text-gray-500 mt-1">예약대기</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">상담 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">예약일시</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상담유형</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상담사</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">내용요약</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row) => {
                const isToday = row.datetime.startsWith(today);
                return (
                  <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50 ${isToday ? 'bg-orange-50/50' : ''}`}>
                    <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                      {row.datetime}
                      {isToday && <span className="ml-1 text-[10px] text-[#F0835A] font-medium">TODAY</span>}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{row.counselor}</td>
                    <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.summary}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.status)}`}>{row.status}</span>
                    </td>
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
