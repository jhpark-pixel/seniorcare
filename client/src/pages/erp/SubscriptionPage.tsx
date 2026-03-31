import React from 'react';

const depositColor: Record<string, string> = {
  '미납': 'bg-red-100 text-red-800',
  '완납': 'bg-green-100 text-green-800',
  '환불': 'bg-gray-100 text-gray-800',
};

const progressColor: Record<string, string> = {
  '접수': 'bg-blue-100 text-blue-800',
  '승인': 'bg-green-100 text-green-800',
  '취소': 'bg-red-100 text-red-800',
};

const mockData = [
  { date: '2026-03-25', name: '김영호', phone: '010-3456-7890', room: '1관 305호', wishDate: '2026-04-15', amount: 5000000, deposit: '완납', progress: '승인' },
  { date: '2026-03-23', name: '이정숙', phone: '010-9876-5432', room: '1관 201호', wishDate: '2026-04-20', amount: 5000000, deposit: '완납', progress: '승인' },
  { date: '2026-03-22', name: '박현우', phone: '010-1234-5678', room: '2관 102호', wishDate: '2026-05-01', amount: 5000000, deposit: '미납', progress: '접수' },
  { date: '2026-03-20', name: '정대호', phone: '010-2222-3333', room: '1관 401호 (2인실)', wishDate: '2026-04-10', amount: 3000000, deposit: '완납', progress: '승인' },
  { date: '2026-03-18', name: '한서연', phone: '010-7777-8888', room: '2관 303호', wishDate: '2026-05-15', amount: 5000000, deposit: '미납', progress: '접수' },
  { date: '2026-03-15', name: '송미라', phone: '010-6666-7777', room: '1관 102호', wishDate: '2026-04-01', amount: 5000000, deposit: '환불', progress: '취소' },
  { date: '2026-03-12', name: '윤재석', phone: '010-4444-5555', room: '2관 205호', wishDate: '2026-04-25', amount: 5000000, deposit: '완납', progress: '승인' },
  { date: '2026-03-10', name: '오성호', phone: '010-8888-9999', room: '1관 303호', wishDate: '2026-05-10', amount: 5000000, deposit: '미납', progress: '접수' },
];

const summary = {
  total: mockData.length,
  approved: mockData.filter(d => d.progress === '승인').length,
  pending: mockData.filter(d => d.progress === '접수').length,
  cancelled: mockData.filter(d => d.progress === '취소').length,
};

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">청약관리</h1>
        <p className="mt-1 text-sm text-gray-500">입소 청약 신청 현황을 관리합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
          <div className="text-sm text-gray-500 mt-1">총 청약</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{summary.approved}</div>
          <div className="text-sm text-gray-500 mt-1">승인완료</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.pending}</div>
          <div className="text-sm text-gray-500 mt-1">대기중</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{summary.cancelled}</div>
          <div className="text-sm text-gray-500 mt-1">취소</div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">접수일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">신청자명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">희망호실</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">희망입소일</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">청약금액</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">입금상태</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">진행상태</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{row.date}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.phone}</td>
                  <td className="px-4 py-3 text-gray-700">{row.room}</td>
                  <td className="px-4 py-3 text-gray-700">{row.wishDate}</td>
                  <td className="px-4 py-3 text-gray-700 text-right">{row.amount.toLocaleString('ko-KR')}원</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${depositColor[row.deposit]}`}>
                      {row.deposit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${progressColor[row.progress]}`}>
                      {row.progress}
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
