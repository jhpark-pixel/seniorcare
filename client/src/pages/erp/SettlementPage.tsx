import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { residents, generateId } from '../../data/mockData';

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
  { id: '1', name: '김영순', room: '1관 101호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2022-01-10', status: '완납' },
  { id: '2', name: '이복자', room: '1관 103호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2021-06-15', status: '완납' },
  { id: '3', name: '박정호', room: '1관 105호', totalDeposit: 25000000, paid: 25000000, balance: 0, method: '일시납', lastPaidDate: '2023-02-20', status: '완납' },
  { id: '4', name: '최순남', room: '1관 107호', totalDeposit: 35000000, paid: 35000000, balance: 0, method: '일시납', lastPaidDate: '2022-09-05', status: '완납' },
  { id: '5', name: '정기원', room: '1관 109호', totalDeposit: 30000000, paid: 20000000, balance: 10000000, method: '분할납부 (6회)', lastPaidDate: '2026-03-01', status: '분할납부중' },
  { id: '6', name: '한말순', room: '2관 201호', totalDeposit: 20000000, paid: 20000000, balance: 0, method: '분할납부 (4회)', lastPaidDate: '2021-12-10', status: '완납' },
  { id: '7', name: '오세진', room: '2관 203호', totalDeposit: 25000000, paid: 25000000, balance: 0, method: '일시납', lastPaidDate: '2024-01-15', status: '완납' },
  { id: '8', name: '송미경', room: '2관 205호', totalDeposit: 30000000, paid: 10000000, balance: 20000000, method: '분할납부 (10회)', lastPaidDate: '2025-08-20', status: '미납' },
  { id: '9', name: '윤태식', room: '2관 207호', totalDeposit: 30000000, paid: 30000000, balance: 0, method: '일시납', lastPaidDate: '2022-11-01', status: '완납' },
  { id: '10', name: '강옥희', room: '2관 209호', totalDeposit: 25000000, paid: 25000000, balance: 0, method: '일시납', lastPaidDate: '2024-06-10', status: '완납' },
];

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';
const emptyPayment = { amount: '', method: '계좌이체', date: '' };

const residentOptions = residents
  .filter(r => r.status !== 'DISCHARGED')
  .map(r => ({ name: r.name, room: `${r.building} ${r.roomNumber}호` }));

// 입금 내역 (payment 탭용 - 납부 이력 기록)
interface PaymentHistory {
  id: string;
  name: string;
  room: string;
  amount: number;
  method: string;
  date: string;
  note: string;
}

const initialHistory: PaymentHistory[] = [
  { id: 'h1', name: '김영순', room: '1관 101호', amount: 30000000, method: '일시납', date: '2022-01-10', note: '입소 계약 시 일시납' },
  { id: 'h2', name: '이복자', room: '1관 103호', amount: 30000000, method: '일시납', date: '2021-06-15', note: '입소 계약 시 일시납' },
  { id: 'h3', name: '정기원', room: '1관 109호', amount: 5000000, method: '계좌이체', date: '2023-07-01', note: '1회차 분할납부' },
  { id: 'h4', name: '정기원', room: '1관 109호', amount: 5000000, method: '계좌이체', date: '2023-09-01', note: '2회차 분할납부' },
  { id: 'h5', name: '정기원', room: '1관 109호', amount: 5000000, method: '계좌이체', date: '2023-11-01', note: '3회차 분할납부' },
  { id: 'h6', name: '정기원', room: '1관 109호', amount: 5000000, method: '계좌이체', date: '2026-03-01', note: '4회차 분할납부' },
  { id: 'h7', name: '송미경', room: '2관 205호', amount: 5000000, method: '계좌이체', date: '2023-05-20', note: '1회차 분할납부' },
  { id: 'h8', name: '송미경', room: '2관 205호', amount: 5000000, method: '카드결제', date: '2025-08-20', note: '2회차 분할납부' },
  { id: 'h9', name: '한말순', room: '2관 201호', amount: 5000000, method: '계좌이체', date: '2021-03-10', note: '1회차 분할납부' },
  { id: 'h10', name: '한말순', room: '2관 201호', amount: 15000000, method: '계좌이체', date: '2021-12-10', note: '잔액 일괄 납부' },
];

const tabs = [
  { id: 'deposit', label: '보증금 정산', path: '/resident/settlement/deposit' },
  { id: 'payment', label: '입금 관리', path: '/resident/settlement/payment' },
];

export default function SettlementPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || 'deposit';

  const [data, setData] = useState<SettlementRecord[]>(initialData);
  const [history, setHistory] = useState<PaymentHistory[]>(initialHistory);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [payForm, setPayForm] = useState(emptyPayment);
  const [addForm, setAddForm] = useState({ name: '', room: '', totalDeposit: '30000000', method: '일시납' });
  const [showHistoryAddModal, setShowHistoryAddModal] = useState(false);
  const [historyForm, setHistoryForm] = useState({ name: '', room: '', amount: '', method: '계좌이체', date: '', note: '' });

  const totalDeposit = data.reduce((s, r) => s + r.totalDeposit, 0);
  const totalPaid = data.reduce((s, r) => s + r.paid, 0);
  const totalBalance = data.reduce((s, r) => s + r.balance, 0);

  const openPayModal = (id: string) => {
    setSelectedId(id);
    setPayForm(emptyPayment);
    setShowPayModal(true);
  };

  const handlePaySave = () => {
    if (!selectedId) return;
    const amount = parseInt(payForm.amount) || 0;
    if (amount <= 0) return;
    const item = data.find(r => r.id === selectedId);
    if (!item) return;
    setData(prev => prev.map(r => {
      if (r.id !== selectedId) return r;
      const newPaid = r.paid + amount;
      const newBalance = Math.max(0, r.totalDeposit - newPaid);
      const newStatus: SettlementRecord['status'] = newBalance === 0 ? '완납' : r.status === '미납' || r.status === '분할납부중' ? '분할납부중' : r.status;
      return { ...r, paid: newPaid, balance: newBalance, lastPaidDate: payForm.date || new Date().toISOString().slice(0, 10), method: payForm.method || r.method, status: newStatus };
    }));
    // 납부 이력 추가
    setHistory(prev => [{
      id: generateId('hist'),
      name: item.name,
      room: item.room,
      amount,
      method: payForm.method,
      date: payForm.date || new Date().toISOString().slice(0, 10),
      note: '납부 등록',
    }, ...prev]);
    setShowPayModal(false);
    setSelectedId(null);
  };

  const handleResidentSelect = (name: string) => {
    const found = residentOptions.find(r => r.name === name);
    if (found) setAddForm(prev => ({ ...prev, name: found.name, room: found.room }));
  };

  const handleAddSave = () => {
    if (!addForm.name) return;
    const newRecord: SettlementRecord = {
      id: generateId('settle'),
      name: addForm.name,
      room: addForm.room,
      totalDeposit: Number(addForm.totalDeposit) || 0,
      paid: 0,
      balance: Number(addForm.totalDeposit) || 0,
      method: addForm.method,
      lastPaidDate: '-',
      status: '미납',
    };
    setData(prev => [newRecord, ...prev]);
    setShowAddModal(false);
    setAddForm({ name: '', room: '', totalDeposit: '30000000', method: '일시납' });
  };

  const handleHistoryResidentSelect = (name: string) => {
    const found = residentOptions.find(r => r.name === name);
    if (found) setHistoryForm(prev => ({ ...prev, name: found.name, room: found.room }));
  };

  const handleHistorySave = () => {
    if (!historyForm.name || !historyForm.amount || !historyForm.date) return;
    const newEntry: PaymentHistory = {
      id: generateId('hist'),
      name: historyForm.name,
      room: historyForm.room,
      amount: Number(historyForm.amount) || 0,
      method: historyForm.method,
      date: historyForm.date,
      note: historyForm.note,
    };
    setHistory(prev => [newEntry, ...prev]);
    setShowHistoryAddModal(false);
    setHistoryForm({ name: '', room: '', amount: '', method: '계좌이체', date: '', note: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">정산관리</h1>
          <p className="mt-1 text-sm text-gray-500">입소자 보증금 납부 및 정산 현황을 관리합니다.</p>
        </div>
        {segment === 'deposit' && (
          <button onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
            + 정산 등록
          </button>
        )}
        {segment === 'payment' && (
          <button onClick={() => setShowHistoryAddModal(true)}
            className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
            + 입금 등록
          </button>
        )}
      </div>

      {/* 탭 바 */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 보증금 정산 탭 */}
      {segment === 'deposit' && (
        <div className="space-y-6">
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
        </div>
      )}

      {/* 입금 관리 탭 */}
      {segment === 'payment' && (
        <div className="space-y-6">
          {/* 입금 현황 요약 */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{history.length}</div>
              <div className="text-sm text-gray-500 mt-1">총 입금건수</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{fmt(history.reduce((s, h) => s + h.amount, 0))}</div>
              <div className="text-sm text-gray-500 mt-1">총 입금액</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{history.filter(h => h.method === '계좌이체').length}</div>
              <div className="text-sm text-gray-500 mt-1">계좌이체</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{history.filter(h => h.method !== '계좌이체').length}</div>
              <div className="text-sm text-gray-500 mt-1">기타 방법</div>
            </div>
          </div>

          {/* 입금 이력 테이블 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">보증금 입금 이력</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입금일</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">입금액</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">납부방법</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{row.date}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.room}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmt(row.amount)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">{row.method}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 납부 등록 모달 (보증금 정산) */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">납부 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">납부금액 (원)</label>
                <input type="number" value={payForm.amount} onChange={e => setPayForm({ ...payForm, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">납부방법</label>
                <select value={payForm.method} onChange={e => setPayForm({ ...payForm, method: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]">
                  <option>계좌이체</option>
                  <option>카드결제</option>
                  <option>현금</option>
                  <option>자동이체</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">납부일</label>
                <input type="date" value={payForm.date} onChange={e => setPayForm({ ...payForm, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowPayModal(false); setSelectedId(null); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handlePaySave}
                className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 정산 등록 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">정산 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select value={addForm.name} onChange={e => handleResidentSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]">
                  <option value="">선택하세요</option>
                  {residentOptions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">보증금 총액</label>
                <input type="number" value={addForm.totalDeposit} onChange={e => setAddForm({ ...addForm, totalDeposit: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">납부방법</label>
                <select value={addForm.method} onChange={e => setAddForm({ ...addForm, method: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]">
                  <option>일시납</option>
                  <option>분할납부 (4회)</option>
                  <option>분할납부 (6회)</option>
                  <option>분할납부 (10회)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleAddSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 입금 등록 모달 (입금 관리 탭) */}
      {showHistoryAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">입금 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select value={historyForm.name} onChange={e => handleHistoryResidentSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]">
                  <option value="">선택하세요</option>
                  {residentOptions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입금액 (원)</label>
                <input type="number" value={historyForm.amount} onChange={e => setHistoryForm({ ...historyForm, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">납부방법</label>
                <select value={historyForm.method} onChange={e => setHistoryForm({ ...historyForm, method: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]">
                  <option>계좌이체</option>
                  <option>카드결제</option>
                  <option>현금</option>
                  <option>자동이체</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입금일</label>
                <input type="date" value={historyForm.date} onChange={e => setHistoryForm({ ...historyForm, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
                <input type="text" value={historyForm.note} onChange={e => setHistoryForm({ ...historyForm, note: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowHistoryAddModal(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleHistorySave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
