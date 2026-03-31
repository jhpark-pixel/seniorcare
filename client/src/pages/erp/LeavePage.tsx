import React from 'react';

const statusColor: Record<string, string> = {
  '신청': 'bg-blue-100 text-blue-800',
  '승인': 'bg-green-100 text-green-800',
  '복귀': 'bg-gray-100 text-gray-800',
};

const mockData = [
  { applyDate: '2026-03-28', name: '김영순', room: '1관 301호', reason: '딸 결혼식 참석', startDate: '2026-04-05', endDate: '2026-04-12', guardian: '김미정 (딸)', guardianPhone: '010-3456-7890', status: '승인' },
  { applyDate: '2026-03-26', name: '이순자', room: '2관 205호', reason: '외부 병원 정밀검사 및 회복', startDate: '2026-04-01', endDate: '2026-04-07', guardian: '이재호 (아들)', guardianPhone: '010-9876-5432', status: '승인' },
  { applyDate: '2026-03-25', name: '최옥순', room: '2관 103호', reason: '추석 명절 가족 방문', startDate: '2026-04-10', endDate: '2026-04-15', guardian: '최영수 (아들)', guardianPhone: '010-5555-1234', status: '신청' },
  { applyDate: '2026-03-20', name: '정미숙', room: '1관 201호', reason: '손녀 돌잔치 참석', startDate: '2026-03-22', endDate: '2026-03-24', guardian: '정하늘 (딸)', guardianPhone: '010-2222-3333', status: '복귀' },
  { applyDate: '2026-03-15', name: '한순이', room: '2관 302호', reason: '자택 방문 (리모델링 확인)', startDate: '2026-03-18', endDate: '2026-03-20', guardian: '한민수 (아들)', guardianPhone: '010-7777-8888', status: '복귀' },
];

export default function LeavePage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">장기외출</h1>
          <p className="mt-1 text-sm text-gray-500">입소자 장기외출 신청 및 복귀 현황을 관리합니다.</p>
        </div>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
          + 외출 신청
        </button>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">신청일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">외출사유</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">외출시작일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">외출종료일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">보호자</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{row.applyDate}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.room}</td>
                  <td className="px-4 py-3 text-gray-700">{row.reason}</td>
                  <td className="px-4 py-3 text-gray-700">{row.startDate}</td>
                  <td className="px-4 py-3 text-gray-700">{row.endDate}</td>
                  <td className="px-4 py-3 text-gray-700">{row.guardian}</td>
                  <td className="px-4 py-3 text-gray-700">{row.guardianPhone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status]}`}>
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
