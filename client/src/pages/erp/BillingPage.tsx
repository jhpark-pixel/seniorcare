import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { residents, generateId } from '../../data/mockData';

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
  { id: '1', month: '2026-03', name: '김영순', room: '1관 101호', admin: 1800000, meal: 450000, utility: 180000, service: 120000, paid: 2550000, status: '완납' },
  { id: '2', month: '2026-03', name: '이복자', room: '1관 103호', admin: 1500000, meal: 420000, utility: 150000, service: 150000, paid: 2220000, status: '완납' },
  { id: '3', month: '2026-03', name: '박정호', room: '1관 105호', admin: 2000000, meal: 450000, utility: 180000, service: 100000, paid: 0, status: '미납' },
  { id: '4', month: '2026-03', name: '최순남', room: '1관 107호', admin: 1800000, meal: 450000, utility: 180000, service: 120000, paid: 2550000, status: '완납' },
  { id: '5', month: '2026-03', name: '정기원', room: '1관 109호', admin: 1800000, meal: 450000, utility: 180000, service: 120000, paid: 1500000, status: '일부납' },
  { id: '6', month: '2026-03', name: '한말순', room: '2관 201호', admin: 1200000, meal: 400000, utility: 130000, service: 200000, paid: 1930000, status: '완납' },
  { id: '7', month: '2026-03', name: '오세진', room: '2관 203호', admin: 2000000, meal: 450000, utility: 180000, service: 100000, paid: 2730000, status: '완납' },
  { id: '8', month: '2026-03', name: '송미경', room: '2관 205호', admin: 1500000, meal: 420000, utility: 150000, service: 150000, paid: 0, status: '대기' },
  { id: '9', month: '2026-03', name: '윤태식', room: '2관 207호', admin: 1500000, meal: 420000, utility: 150000, service: 130000, paid: 2200000, status: '완납' },
  { id: '10', month: '2026-03', name: '강옥희', room: '2관 209호', admin: 1800000, meal: 450000, utility: 180000, service: 120000, paid: 1500000, status: '일부납' },
];

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';
const monthOptions = ['전체', '2026-01', '2026-02', '2026-03'];

const residentOptions = residents
  .filter(r => r.status !== 'DISCHARGED')
  .map(r => ({ name: r.name, room: `${r.building} ${r.roomNumber}호` }));

const tabs = [
  { id: 'monthly', label: '월청구내역', path: '/resident/billing/monthly' },
  { id: 'management', label: '관리비', path: '/resident/billing/management' },
  { id: 'meal', label: '식사비', path: '/resident/billing/meal' },
  { id: 'utility', label: '수도광열비', path: '/resident/billing/utility' },
  { id: 'status', label: '납부현황', path: '/resident/billing/status' },
];

export default function BillingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || 'monthly';

  const [data, setData] = useState<BillingItem[]>(initialData);
  const [monthFilter, setMonthFilter] = useState('전체');
  const [payModalId, setPayModalId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', room: '', month: '2026-03', admin: '1800000', meal: '450000', utility: '180000', service: '120000' });

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

  const handleResidentSelect = (name: string) => {
    const found = residentOptions.find(r => r.name === name);
    if (found) setAddForm(prev => ({ ...prev, name: found.name, room: found.room }));
  };

  const handleAddSave = () => {
    if (!addForm.name || !addForm.month) return;
    const newItem: BillingItem = {
      id: generateId('bill'),
      month: addForm.month,
      name: addForm.name,
      room: addForm.room,
      admin: Number(addForm.admin) || 0,
      meal: Number(addForm.meal) || 0,
      utility: Number(addForm.utility) || 0,
      service: Number(addForm.service) || 0,
      paid: 0,
      status: '대기',
    };
    setData(prev => [newItem, ...prev]);
    setShowAddModal(false);
    setAddForm({ name: '', room: '', month: '2026-03', admin: '1800000', meal: '450000', utility: '180000', service: '120000' });
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
        {segment === 'monthly' && (
          <div className="flex gap-2">
            <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]">
              {monthOptions.map(m => <option key={m} value={m}>{m === '전체' ? '전체 월' : m}</option>)}
            </select>
            <button onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
              + 청구 등록
            </button>
          </div>
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

      {/* 월청구내역 탭 */}
      {segment === 'monthly' && (
        <div className="space-y-6">
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
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status]}`}>{row.status}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-1">
                            {row.status !== '완납' && (
                              <button onClick={() => { setPayModalId(row.id); setPayAmount(''); }}
                                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">납부처리</button>
                            )}
                            <button onClick={() => handleDelete(row.id)}
                              className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500">삭제</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 관리비 산출 탭 */}
      {segment === 'management' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">2026년 3월 관리비 산출 내역 (케어등급 반영)</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">기본생활비</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">케어서비스비</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">관리비 합계</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">산출기준</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => {
                    const base = Math.round(row.admin * 0.7);
                    const care = Math.round(row.admin * 0.3);
                    return (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-gray-700">{row.room}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(base)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(care)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmt(row.admin)}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">1인실 기준 / 케어등급 반영</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={4} className="px-4 py-3 text-right text-gray-700">관리비 합계</td>
                    <td className="px-4 py-3 text-right text-gray-900">{fmt(data.reduce((s, r) => s + r.admin, 0))}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 식사비 산출 탭 */}
      {segment === 'meal' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 font-medium">2026년 3월 식사비 산출 내역 (일 3식 기준)</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">조식</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">중식</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">석식</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">식사비 합계</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">식단유형</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => {
                    const breakfast = Math.round(row.meal * 0.28);
                    const lunch = Math.round(row.meal * 0.38);
                    const dinner = row.meal - breakfast - lunch;
                    const mealTypes = ['일반식', '연화식', '유동식'];
                    const mealType = mealTypes[Number(row.id) % 3];
                    return (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-gray-700">{row.room}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(breakfast)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(lunch)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(dinner)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmt(row.meal)}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">{mealType}</span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={5} className="px-4 py-3 text-right text-gray-700">식사비 합계</td>
                    <td className="px-4 py-3 text-right text-gray-900">{fmt(data.reduce((s, r) => s + r.meal, 0))}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 수도광열비 산출 탭 */}
      {segment === 'utility' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700 font-medium">2026년 3월 수도광열비 산출 내역 (전기/수도/가스 합산)</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">전기요금</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">수도요금</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">가스요금</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">수도광열비 합계</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => {
                    const electric = Math.round(row.utility * 0.5);
                    const water = Math.round(row.utility * 0.2);
                    const gas = row.utility - electric - water;
                    return (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-gray-700">{row.room}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(electric)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(water)}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{fmt(gas)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmt(row.utility)}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 font-semibold">
                    <td colSpan={5} className="px-4 py-3 text-right text-gray-700">수도광열비 합계</td>
                    <td className="px-4 py-3 text-right text-gray-900">{fmt(data.reduce((s, r) => s + r.utility, 0))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 납부현황 탭 */}
      {segment === 'status' && (
        <div className="space-y-6">
          {/* 요약 카드 */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '완납', color: 'text-green-600', count: data.filter(d => d.status === '완납').length, amount: data.filter(d => d.status === '완납').reduce((s, r) => s + r.paid, 0) },
              { label: '일부납', color: 'text-orange-500', count: data.filter(d => d.status === '일부납').length, amount: data.filter(d => d.status === '일부납').reduce((s, r) => s + r.paid, 0) },
              { label: '미납', color: 'text-red-600', count: data.filter(d => d.status === '미납').length, amount: data.filter(d => d.status === '미납').reduce((s, r) => s + (r.admin + r.meal + r.utility + r.service), 0) },
              { label: '대기', color: 'text-yellow-600', count: data.filter(d => d.status === '대기').length, amount: 0 },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.count}명</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                {s.amount > 0 && <div className="text-xs text-gray-400 mt-1">{fmt(s.amount)}</div>}
              </div>
            ))}
          </div>

          {/* 납부율 진행바 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">2026-03 납부 현황</h2>
            {data.map(row => {
              const total = row.admin + row.meal + row.utility + row.service;
              const rate = total > 0 ? Math.round(row.paid / total * 100) : 0;
              return (
                <div key={row.id} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{row.name} <span className="text-gray-400 font-normal text-xs">({row.room})</span></span>
                    <span className="text-gray-500">{fmt(row.paid)} / {fmt(total)} ({rate}%)</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${rate === 100 ? 'bg-green-500' : rate > 0 ? 'bg-orange-400' : 'bg-red-300'}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                    <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
                      placeholder={String(remaining)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setPayModalId(null); setPayAmount(''); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handlePay}
                className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 청구 등록 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">청구 등록</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select value={addForm.name} onChange={e => handleResidentSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]">
                  <option value="">선택하세요</option>
                  {residentOptions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">청구월</label>
                <input type="month" value={addForm.month} onChange={e => setAddForm({ ...addForm, month: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관리비</label>
                <input type="number" value={addForm.admin} onChange={e => setAddForm({ ...addForm, admin: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">식사비</label>
                <input type="number" value={addForm.meal} onChange={e => setAddForm({ ...addForm, meal: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">수도광열비</label>
                <input type="number" value={addForm.utility} onChange={e => setAddForm({ ...addForm, utility: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">서비스비</label>
                <input type="number" value={addForm.service} onChange={e => setAddForm({ ...addForm, service: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleAddSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
