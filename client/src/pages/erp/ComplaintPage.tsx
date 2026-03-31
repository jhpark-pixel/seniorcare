import React from 'react';

const mockData = [
  { id: 1, date: '2026-03-30', complainant: '김철수 (김영순 자녀)', phone: '010-1234-5678', type: '서비스', content: '야간 순회 시 소음이 크다는 불만', processStatus: '접수', processDate: '-', satisfaction: null },
  { id: 2, date: '2026-03-29', complainant: '이미영 (이순자 자녀)', phone: '010-2345-6789', type: '식사', content: '저녁 식사 반찬이 부족하다는 의견', processStatus: '처리중', processDate: '-', satisfaction: null },
  { id: 3, date: '2026-03-28', complainant: '박정수 (박정희 배우자)', phone: '010-3456-7890', type: '시설', content: '2층 복도 조명이 어두워 위험하다는 지적', processStatus: '완료', processDate: '2026-03-29', satisfaction: 4 },
  { id: 4, date: '2026-03-27', complainant: '최영미 (최옥순 자녀)', phone: '010-4567-8901', type: '서비스', content: '세탁물 분실 건 확인 요청', processStatus: '완료', processDate: '2026-03-28', satisfaction: 3 },
  { id: 5, date: '2026-03-25', complainant: '한동건 (한순이 자녀)', phone: '010-5678-9012', type: '기타', content: '면회 시간 연장 요청', processStatus: '완료', processDate: '2026-03-26', satisfaction: 5 },
  { id: 6, date: '2026-03-23', complainant: '정수현 (정미숙 자녀)', phone: '010-6789-0123', type: '식사', content: '당뇨식 메뉴 다양화 요청', processStatus: '완료', processDate: '2026-03-25', satisfaction: 4 },
  { id: 7, date: '2026-03-20', complainant: '강미래 (강순덕 자녀)', phone: '010-7890-1234', type: '시설', content: '화장실 온수 온도 불안정 신고', processStatus: '완료', processDate: '2026-03-21', satisfaction: 5 },
  { id: 8, date: '2026-03-18', complainant: '오진우 (오말순 자녀)', phone: '010-8901-2345', type: '서비스', content: '투약 시간 변경 후 미안내 건', processStatus: '완료', processDate: '2026-03-19', satisfaction: 2 },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '접수': 'bg-red-100 text-red-700',
    '처리중': 'bg-yellow-100 text-yellow-700',
    '완료': 'bg-green-100 text-green-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '시설': 'bg-blue-100 text-blue-700',
    '서비스': 'bg-purple-100 text-purple-700',
    '식사': 'bg-orange-100 text-orange-700',
    '기타': 'bg-gray-100 text-gray-600',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

const renderStars = (score: number | null) => {
  if (score === null) return <span className="text-gray-300 text-xs">-</span>;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-sm ${i <= score ? 'text-yellow-400' : 'text-gray-200'}`}>&#9733;</span>
      ))}
    </div>
  );
};

export default function ComplaintPage() {
  const total = mockData.length;
  const completed = mockData.filter(d => d.processStatus === '완료').length;
  const inProgress = mockData.filter(d => d.processStatus === '처리중').length;
  const pending = mockData.filter(d => d.processStatus === '접수').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">민원관리</h1>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 민원 접수
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{total}</div>
          <div className="text-xs text-gray-500 mt-1">총 민원</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completed}</div>
          <div className="text-xs text-gray-500 mt-1">처리완료</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{inProgress}</div>
          <div className="text-xs text-gray-500 mt-1">처리중</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{pending}</div>
          <div className="text-xs text-gray-500 mt-1">미처리</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">민원 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">접수일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">민원인</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">연락처</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">유형</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">내용</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처리상태</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처리일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">만족도</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">{row.date}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap">{row.complainant}</td>
                  <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{row.phone}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.content}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.processStatus)}`}>{row.processStatus}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{row.processDate}</td>
                  <td className="px-4 py-2.5">{renderStars(row.satisfaction)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
