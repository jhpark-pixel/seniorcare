import React from 'react';

const contractStatusColor: Record<string, string> = {
  '계약중': 'bg-green-100 text-green-800',
  '만료예정': 'bg-yellow-100 text-yellow-800',
  '해지': 'bg-red-100 text-red-800',
  '갱신대기': 'bg-blue-100 text-blue-800',
};

const depositStatusColor: Record<string, string> = {
  '완납': 'bg-green-100 text-green-800',
  '분할납부중': 'bg-yellow-100 text-yellow-800',
  '미납': 'bg-red-100 text-red-800',
  '환불완료': 'bg-gray-100 text-gray-800',
};

const mockData = [
  { contractNo: 'CT-2025-001', name: '김영순', room: '1관 301호', type: '1인실', startDate: '2025-01-15', endDate: '2026-01-14', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { contractNo: 'CT-2025-003', name: '이순자', room: '2관 205호', type: '1인실', startDate: '2025-03-01', endDate: '2026-02-28', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { contractNo: 'CT-2025-005', name: '박정희', room: '1관 402호', type: '2인실', startDate: '2025-05-10', endDate: '2026-05-09', monthly: 1800000, deposit: 20000000, depositStatus: '분할납부중', status: '계약중' },
  { contractNo: 'CT-2025-007', name: '최옥순', room: '2관 103호', type: '1인실', startDate: '2025-02-01', endDate: '2026-01-31', monthly: 2500000, deposit: 35000000, depositStatus: '완납', status: '만료예정' },
  { contractNo: 'CT-2025-009', name: '정미숙', room: '1관 201호', type: '1인실', startDate: '2025-06-15', endDate: '2026-06-14', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { contractNo: 'CT-2025-011', name: '한순이', room: '2관 302호', type: '2인실', startDate: '2025-04-01', endDate: '2026-03-31', monthly: 1800000, deposit: 20000000, depositStatus: '완납', status: '갱신대기' },
  { contractNo: 'CT-2024-022', name: '강말숙', room: '1관 105호', type: '1인실', startDate: '2024-09-01', endDate: '2025-08-31', monthly: 2000000, deposit: 25000000, depositStatus: '환불완료', status: '해지' },
  { contractNo: 'CT-2025-015', name: '서복순', room: '2관 401호', type: '2인실', startDate: '2025-07-01', endDate: '2026-06-30', monthly: 1500000, deposit: 20000000, depositStatus: '미납', status: '계약중' },
];

export default function ContractPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">계약관리</h1>
        <p className="mt-1 text-sm text-gray-500">입소자 계약 현황을 조회하고 관리합니다.</p>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">계약번호</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">유형</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">계약시작일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">계약종료일</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">기준생활비</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">보증금</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">보증금상태</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">계약상태</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-blue-600 font-mono text-xs">{row.contractNo}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.room}</td>
                  <td className="px-4 py-3 text-gray-700">{row.type}</td>
                  <td className="px-4 py-3 text-gray-700">{row.startDate}</td>
                  <td className="px-4 py-3 text-gray-700">{row.endDate}</td>
                  <td className="px-4 py-3 text-gray-700 text-right">{row.monthly.toLocaleString('ko-KR')}원</td>
                  <td className="px-4 py-3 text-gray-700 text-right">{row.deposit.toLocaleString('ko-KR')}원</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${depositStatusColor[row.depositStatus]}`}>
                      {row.depositStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${contractStatusColor[row.status]}`}>
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
