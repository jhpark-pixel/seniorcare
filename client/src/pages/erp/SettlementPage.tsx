import React, { useState } from 'react';

interface SettlementRecord {
  id: string;
  name: string;
  room: string;
  totalDeposit: number;
  paid: number;
  balance: number;
  method: string;
  lastPaidDate: string;
  status: '완납' | '분할납부중' | '미납' | '환불진행중' | '환불완료';
}

const statusColor: Record<string, string> = {
  '완납': 'bg-green-100 text-green-800',
  '분할납부중': 'bg-yellow-100 text-yellow-800',
  '미납': 'bg-red-100 text-red-800',
  '환불진행중': 'bg-blue-100 text-blue-800',
  '환불완료': 'bg-gray-100 text-gray-800',
};

const initialData: SettlementRecord[] = [
  { id: '1', name: '김영순', room: '1관 301호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2025-01-10', status: '완납' },
  { id: '2', name: '이순자', room: '2관 205호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2025-02-25', status: '완납' },
  { id: '3', name: '박정희', room: '1관 402호', totalDeposit: 20000000, paid: 12000000, balance: 8000000, method: '분할납부 (6회)', lastPaidDate: '2026-03-05', status: '분할납부중' },
  { id: '4', name: '최옥순', room: '2관 103호', totalDeposit: 35000000, paid: 35000000, balance: 0, method: '일시납', lastPaidDate: '2025-01-28', status: '완납' },
  { id: '5', name: '정미숙', room: '1관 201호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2025-06-10', status: '완납' },
  { id: '6', name: '한순이', room: '2관 302호', totalDeposit: 20000000, paid: 20000000, balance: 0, method: '분할납부 (4회)', lastPaidDate: '2025-12-15', status: '완납' },
  { id: '7', name: '강말숙', room: '1관 105호', totalDeposit: 25000000, paid: 25000000, balance: 0, method: '일시납', lastPaidDate: '2024-08-20', status: '환불진행중' },
  { id: '8', name: '서복순', room: '2관 401호', totalDeposit: 20000000, paid: 5000000, balance: 15000000, method: '분할납부 (10회)', lastPaidDate: '2025-08-01', status: '미납' },
];

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

const emptyPayment = { amount: '', method: '계좌이체', date: '' };

export default function SettlementPage() {
  const [data, setData] = useState<SettlementRecord[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [payForm, setPayForm] = useState(emptyPayment);

  const totalDeposit = data.reduce((s, r) => s + r.totalDeposit, 0);
  const totalPaid = data.reduce((s, r) => s + r.paid, 0);
  const totalBalance = data.reduce((s, r) => s + r.balance, 0);

  const openPayModal = (id: string) => {
    setSelectedId(id);
    setPayForm(emptyPayment);
    setShowModal(true);
  };

  const handlePaySave = () => {
    if (!selectedId) return;
    const amount = parseInt(payForm.amount) || 0;
    setData(prev => prev.map(r => {
      if (r.id !== selectedId) return r;
      const newPaid = r.paid + amount;
      const newBalance = Math.max(0, r.totalDeposit - newPaid);
      const newStatus: SettlementRecord['status'] = newBalance === 0 ? '완납' : r.status === '미납' || r.status === '분할납부중' ? '분할납부중' : r.status;
      return { ...r, paid: newPaid, balance: newBalance, lastPaidDate: payForm.date || new Date().toISOString().slice(0, 10), status: newStatus };
    }));
    setShowModal(false);
    setSelectedId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정산관리</h1>
        <p className="mt-1 text-sm text-gray-500">입소자 보증금 납부 및 정산 현황을 관리합니다.</p>
      </div>

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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                  <td className="px-4 py-3">
                    {row.balance > 0 && (
                      <button onClick={() => openPayModal(row.id)} className="px-2 py-1 text-xs bg-[#F0835A] text-white rounded hover:bg-[#d9714d]">납부등록</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">납부 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">납부금액 (원)</label>
                <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">납부방법</label>
                <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>계좌이체</option>
                  <option>카드결제</option>
                  <option>현금</option>
                  <option>자동이체</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">납부일</label>
                <input type="date" value={payForm.date} onChange={e => setPayForm({ ...payForm, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowModal(false); setSelectedId(null); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handlePaySave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
