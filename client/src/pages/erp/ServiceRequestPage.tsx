import React, { useState } from 'react';

const mockData = [
  { id: 1, date: '2026-03-30', name: '김영순', room: '1관 301호', type: '이미용', content: '커트 및 염색 요청', dueDate: '2026-04-02', handler: '외부업체 김미장', status: '대기' },
  { id: 2, date: '2026-03-29', name: '이순자', room: '2관 205호', type: '세탁', content: '겨울 이불 세탁 요청', dueDate: '2026-03-31', handler: '생활지도사 박수진', status: '진행중' },
  { id: 3, date: '2026-03-29', name: '박정희', room: '1관 402호', type: '외출지원', content: '아들 집 방문 외출 지원 (보호자 동행)', dueDate: '2026-04-05', handler: '생활지도사 최은영', status: '대기' },
  { id: 4, date: '2026-03-28', name: '최옥순', room: '2관 103호', type: '택배', content: '손녀에게 보낼 택배 발송 요청', dueDate: '2026-03-29', handler: '생활지도사 박수진', status: '완료' },
  { id: 5, date: '2026-03-28', name: '한순이', room: '2관 302호', type: '이미용', content: '파마 예약 요청', dueDate: '2026-04-03', handler: '외부업체 김미장', status: '대기' },
  { id: 6, date: '2026-03-27', name: '정미숙', room: '1관 201호', type: '기타', content: '방 커튼 교체 요청', dueDate: '2026-04-01', handler: '시설관리 이동수', status: '진행중' },
  { id: 7, date: '2026-03-26', name: '강순덕', room: '2관 401호', type: '세탁', content: '카디건 드라이클리닝 요청', dueDate: '2026-03-28', handler: '생활지도사 박수진', status: '완료' },
  { id: 8, date: '2026-03-25', name: '오말순', room: '1관 105호', type: '외출지원', content: '병원 외래 후 마트 경유 요청', dueDate: '2026-03-27', handler: '생활지도사 최은영', status: '완료' },
  { id: 9, date: '2026-03-25', name: '윤복순', room: '1관 302호', type: '택배', content: '지인에게 받은 택배 수령 전달', dueDate: '2026-03-25', handler: '생활지도사 박수진', status: '완료' },
  { id: 10, date: '2026-03-24', name: '신영자', room: '2관 201호', type: '기타', content: 'TV 리모컨 고장 수리 요청', dueDate: '2026-03-26', handler: '시설관리 이동수', status: '취소' },
];

const statusFilters = ['전체', '대기', '진행중', '완료', '취소'] as const;

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '대기': 'bg-yellow-100 text-yellow-700',
    '진행중': 'bg-blue-100 text-blue-700',
    '완료': 'bg-green-100 text-green-700',
    '취소': 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '이미용': 'bg-pink-100 text-pink-700',
    '세탁': 'bg-cyan-100 text-cyan-700',
    '외출지원': 'bg-indigo-100 text-indigo-700',
    '택배': 'bg-amber-100 text-amber-700',
    '기타': 'bg-gray-100 text-gray-600',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

export default function ServiceRequestPage() {
  const [filter, setFilter] = useState<string>('전체');

  const filtered = filter === '전체' ? mockData : mockData.filter(d => d.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">서비스신청 (컨시어지)</h1>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 서비스 신청
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {statusFilters.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s}
            <span className="ml-1 text-xs text-gray-400">
              ({s === '전체' ? mockData.length : mockData.filter(d => d.status === s).length})
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">신청일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">서비스유형</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">내용</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">예정일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처리자</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">{row.date}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.content}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.dueDate}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.handler}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.status)}`}>{row.status}</span>
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
