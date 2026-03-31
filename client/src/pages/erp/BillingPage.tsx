import React, { useState } from 'react';

const statusColor: Record<string, string> = {
  '대기': 'bg-yellow-100 text-yellow-800',
  '완납': 'bg-green-100 text-green-800',
  '미납': 'bg-red-100 text-red-800',
  '일부납': 'bg-orange-100 text-orange-800',
};

interface BillingItem {
  id: string;
  month: string;
  name: string;
  room: string;
  admin: number;
  meal: number;
  utility: number;
  service: number;
  paid: number;
  status: string;
}

const initialData: BillingItem[] = [
  { id: '1', month: '2026-03', name: '김영순', room: '1관 301호', admin: 1800000, meal: 450000, utility: 180000, service: 120000, paid: 2550000, status: '완납' },
  { id: '2', month: '2026-03', name: '이순자', room: '2관 205호', admin: 1800000, meal: 450000, utility: 180000, service: 150000, paid: 2580000, status: '완납' },
  { id: '3', month: '2026-03', name: '박정희', room: '1관 402호', admin: 1500000, meal: 420000, utility: 150000, service: 100000, paid: 0, status: '미납' },
  { id: '4', month: '2026-03', name: '최옥순', room: '2관 103호', admin: 2100000, meal: 500000, utility: 200000, service: 180000, paid: 2980000, status: '완납' },
  { id: '5', month: '2026-03', name: '정미숙', room: '1관 201호', admin: 1800000, meal: 450000, utility: 180000, service: 120000, paid: 1500000, status: '일부납' },
  { id: '6', month: '2026-03', name: '한순이', room: '2관 302호', admin: 1500000, meal: 420000, utility: 150000, service: 100000, paid: 2170000, status: '완납' },
  { id: '7', month: '2026-03', name: '서복순', room: '2관 401호', admin: 1200000, meal: 400000, utility: 130000, service: 80000, paid: 0, status: '대기' },
  { id: '8', month: '2026-03', name: '강말숙', room: '1관 105호', admin: 1650000, meal: 430000, utility: 170000, service: 110000, paid: 2360000, status: '완납' },
  { id: '9', month: '2026-03', name: '조순옥', room: '1관 203호', admin: 1800000, meal: 450000, utility: 180000, service: 130000, paid: 2560000, status: '완납' },
  { id: '10', month: '2026-03', name: '배영자', room: '2관 104호', admin: 2000000, meal: 480000, utility: 190000, service: 160000, paid: 1500000, status: '일부납' },
];

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

const monthOptions = ['전체', '2026-01', '2026-02', '2026-03'];

export default function BillingPage() {
  const [data, setData] = useState<BillingItem[]>(initialData);
  const [monthFilter, setMonthFilter] = useState('전체');
  const [payModalId, setPayModalId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const filtered = monthFilter === '전체' ? data : data.filter(d => d.month === monthFilter);

  const totalBilled = filtered.reduce((s, r) => s + r.admin + r.meal + r.utility + r.service, 0);
  const totalPaid = filtered.reduce((s, r) => s + r.paid, 0);
  const totalUnpaid = totalBilled - totalPaid;

  const handlePay = () => {
    if (!payModalId) return;
    const amount = Number(payAmount) || 0;
    if (amount <= 0) return;
    setData(prev => prev.map(d => {
      if (d.id !== payModalId) return d;
      const newPaid = d.paid + amount;
      const total = d.admin + d.meal + d.utility + d.service;
      let status = '일부납';
      if (newPaid >= total) status = '완납';
      else if (newPaid === 0) status = '미납';
      return { ...d, paid: Math.min(newPaid, total), status };
    }));
    setPayModalId(null);
    setPayAmount('');
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">청구관리</h1>
          <p className="mt-1 text-sm text-gray-500">월별 생활비 청구 및 수납 현황을 관리합니다.</p>
        </div>
        <select
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
        >
          {monthOptions.map(m => <option key={m} value={m}>{m === '전체' ? '전체 월' : m}</option>)}
        </select>
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const total = row.admin + row.meal + row.utility + row.service;
                return (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex gap-1">
                        {row.status !== '완납' && (
                          <button
                            onClick={() => { setPayModalId(row.id); setPayAmount(''); }}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            납부처리
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 납부 모달 */}
      {payModalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">납부처리</h2>
            {(() => {
              const item = data.find(d => d.id === payModalId);
              if (!item) return null;
              const total = item.admin + item.meal + item.utility + item.service;
              const remaining = total - item.paid;
              return (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{item.name}</span> ({item.room})
                  </div>
                  <div className="text-sm text-gray-600">
                    미납잔액: <span className="font-bold text-red-600">{fmt(remaining)}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">납부액</label>
                    <input
                      type="number"
                      value={payAmount}
                      onChange={e => setPayAmount(e.target.value)}
                      placeholder={String(remaining)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                    />
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setPayModalId(null); setPayAmount(''); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handlePay}
                className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
