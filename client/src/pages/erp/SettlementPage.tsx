import React from 'react';

const statusColor: Record<string, string> = {
  '완납': 'bg-green-100 text-green-800',
  '분할납부중': 'bg-yellow-100 text-yellow-800',
  '미납': 'bg-red-100 text-red-800',
  '환불진행중': 'bg-blue-100 text-blue-800',
  '환불완료': 'bg-gray-100 text-gray-800',
};

const mockData = [
  { name: '김영순', room: '1관 301호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2025-01-10', status: '완납' },
  { name: '이순자', room: '2관 205호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2025-02-25', status: '완납' },
  { name: '박정희', room: '1관 402호', totalDeposit: 20000000, paid: 12000000, balance: 8000000, method: '분할납부 (6회)', lastPaidDate: '2026-03-05', status: '분할납부중' },
  { name: '최옥순', room: '2관 103호', totalDeposit: 35000000, paid: 35000000, balance: 0, method: '일시납', lastPaidDate: '2025-01-28', status: '완납' },
  { name: '정미숙', room: '1관 201호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2025-06-10', status: '완납' },
  { name: '한순이', room: '2관 302호', totalDeposit: 20000000, paid: 20000000, balance: 0, method: '분할납부 (4회)', lastPaidDate: '2025-12-15', status: '완납' },
  { name: '강말숙', room: '1관 105호', totalDeposit: 25000000, paid: 25000000, balance: 0, method: '일시납', lastPaidDate: '2024-08-20', status: '환불진행중' },
  { name: '서복순', room: '2관 401호', totalDeposit: 20000000, paid: 5000000, balance: 15000000, method: '분할납부 (10회)', lastPaidDate: '2025-08-01', status: '미납' },
];

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

export default function SettlementPage() {
  const totalDeposit = mockData.reduce((s, r) => s + r.totalDeposit, 0);
  const totalPaid = mockData.reduce((s, r) => s + r.paid, 0);
  const totalBalance = mockData.reduce((s, r) => s + r.balance, 0);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정산관리</h1>
        <p className="mt-1 text-sm text-gray-500">입소자 보증금 납부 및 정산 현황을 관리합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <div className="text-sm text-gray-500">보증금 총액</div>
          <div className="text-xl font-bold text-gray-900 mt-1">{fmt(totalDeposit)}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <div className="text-sm text-gray-500">납부완료</div>
          <div className="text-xl font-bold text-green-600 mt-1">{fmt(totalPaid)}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <div className="text-sm text-gray-500">미납잔액</div>
          <div className="text-xl font-bold text-red-600 mt-1">{fmt(totalBalance)}</div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">보증금총액</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">납부액</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">잔액</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">납부방법</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">최종납부일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.room}</td>
                  <td className="px-4 py-3 text-gray-700 text-right">{fmt(row.totalDeposit)}</td>
                  <td className="px-4 py-3 text-gray-700 text-right">{fmt(row.paid)}</td>
                  <td className="px-4 py-3 text-right font-medium" style={{ color: row.balance > 0 ? '#dc2626' : '#16a34a' }}>
                    {fmt(row.balance)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.method}</td>
                  <td className="px-4 py-3 text-gray-700">{row.lastPaidDate}</td>
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
