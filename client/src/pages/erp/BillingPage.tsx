import React from 'react';

const statusColor: Record<string, string> = {
  '대기': 'bg-yellow-100 text-yellow-800',
  '완납': 'bg-green-100 text-green-800',
  '미납': 'bg-red-100 text-red-800',
  '일부납': 'bg-orange-100 text-orange-800',
};

const mockData = [
  { month: '2026-03', name: '김영순', room: '1관 301호', admin: 1800000, meal: 450000, utility: 180000, service: 120000, paid: 2550000, status: '완납' },
  { month: '2026-03', name: '이순자', room: '2관 205호', admin: 1800000, meal: 450000, utility: 180000, service: 150000, paid: 2580000, status: '완납' },
  { month: '2026-03', name: '박정희', room: '1관 402호', admin: 1500000, meal: 420000, utility: 150000, service: 100000, paid: 0, status: '미납' },
  { month: '2026-03', name: '최옥순', room: '2관 103호', admin: 2100000, meal: 500000, utility: 200000, service: 180000, paid: 2980000, status: '완납' },
  { month: '2026-03', name: '정미숙', room: '1관 201호', admin: 1800000, meal: 450000, utility: 180000, service: 120000, paid: 1500000, status: '일부납' },
  { month: '2026-03', name: '한순이', room: '2관 302호', admin: 1500000, meal: 420000, utility: 150000, service: 100000, paid: 2170000, status: '완납' },
  { month: '2026-03', name: '서복순', room: '2관 401호', admin: 1200000, meal: 400000, utility: 130000, service: 80000, paid: 0, status: '대기' },
  { month: '2026-03', name: '강말숙', room: '1관 105호', admin: 1650000, meal: 430000, utility: 170000, service: 110000, paid: 2360000, status: '완납' },
  { month: '2026-03', name: '조순옥', room: '1관 203호', admin: 1800000, meal: 450000, utility: 180000, service: 130000, paid: 2560000, status: '완납' },
  { month: '2026-03', name: '배영자', room: '2관 104호', admin: 2000000, meal: 480000, utility: 190000, service: 160000, paid: 1500000, status: '일부납' },
];

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

export default function BillingPage() {
  const totalBilled = mockData.reduce((s, r) => s + r.admin + r.meal + r.utility + r.service, 0);
  const totalPaid = mockData.reduce((s, r) => s + r.paid, 0);
  const totalUnpaid = totalBilled - totalPaid;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">청구관리</h1>
        <p className="mt-1 text-sm text-gray-500">월별 생활비 청구 및 수납 현황을 관리합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <div className="text-sm text-gray-500">총 청구액</div>
          <div className="text-xl font-bold text-gray-900 mt-1">{fmt(totalBilled)}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <div className="text-sm text-gray-500">수납액</div>
          <div className="text-xl font-bold text-green-600 mt-1">{fmt(totalPaid)}</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
          <div className="text-sm text-gray-500">미수금</div>
          <div className="text-xl font-bold text-red-600 mt-1">{fmt(totalUnpaid)}</div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">청구월</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">관리비</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">식사비</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">수도광열비</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">서비스비</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">합계</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">납부액</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, i) => {
                const total = row.admin + row.meal + row.utility + row.service;
                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700">{row.month}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-gray-700">{row.room}</td>
                    <td className="px-4 py-3 text-gray-700 text-right">{fmt(row.admin)}</td>
                    <td className="px-4 py-3 text-gray-700 text-right">{fmt(row.meal)}</td>
                    <td className="px-4 py-3 text-gray-700 text-right">{fmt(row.utility)}</td>
                    <td className="px-4 py-3 text-gray-700 text-right">{fmt(row.service)}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold text-right">{fmt(total)}</td>
                    <td className="px-4 py-3 text-gray-700 text-right">{fmt(row.paid)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status]}`}>
                        {row.status}
                      </span>
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
