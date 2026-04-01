import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateId } from '../../data/mockData';
import { useCollection, useResidents } from '../../context/AppStateContext';

const contractStatusColor: Record<string, string> = {
  '계약중': 'bg-green-100 text-green-800',
  '만료예정': 'bg-yellow-100 text-yellow-800',
  '해지': 'bg-red-100 text-red-800',
  '갱신대기': 'bg-blue-100 text-blue-800',
  '만료': 'bg-gray-100 text-gray-800',
};

const depositStatusColor: Record<string, string> = {
  '완납': 'bg-green-100 text-green-800',
  '분할납부중': 'bg-yellow-100 text-yellow-800',
  '미납': 'bg-red-100 text-red-800',
  '환불완료': 'bg-gray-100 text-gray-800',
};

interface ContractItem {
  id: string;
  contractNo: string;
  name: string;
  room: string;
  type: string;
  startDate: string;
  endDate: string;
  monthly: number;
  deposit: number;
  depositStatus: string;
  status: string;
}

const initialData: ContractItem[] = [
  { id: '1', contractNo: 'CT-2025-001', name: '김영순', room: '1관 101호', type: '1인실', startDate: '2022-01-10', endDate: '2026-01-09', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '갱신대기' },
  { id: '2', contractNo: 'CT-2021-003', name: '이복자', room: '1관 103호', type: '1인실', startDate: '2021-06-15', endDate: '2026-06-14', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '3', contractNo: 'CT-2023-005', name: '박정호', room: '1관 105호', type: '1인실', startDate: '2023-02-20', endDate: '2026-02-19', monthly: 2000000, deposit: 25000000, depositStatus: '완납', status: '만료예정' },
  { id: '4', contractNo: 'CT-2022-007', name: '최순남', room: '1관 107호', type: '1인실', startDate: '2022-09-05', endDate: '2026-09-04', monthly: 2500000, deposit: 35000000, depositStatus: '완납', status: '계약중' },
  { id: '5', contractNo: 'CT-2023-009', name: '정기원', room: '1관 109호', type: '1인실', startDate: '2023-07-01', endDate: '2026-06-30', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '6', contractNo: 'CT-2021-011', name: '한말순', room: '2관 201호', type: '1인실', startDate: '2021-03-10', endDate: '2026-03-09', monthly: 1800000, deposit: 20000000, depositStatus: '완납', status: '갱신대기' },
  { id: '7', contractNo: 'CT-2024-013', name: '오세진', room: '2관 203호', type: '1인실', startDate: '2024-01-15', endDate: '2027-01-14', monthly: 2000000, deposit: 25000000, depositStatus: '완납', status: '계약중' },
  { id: '8', contractNo: 'CT-2023-015', name: '송미경', room: '2관 205호', type: '1인실', startDate: '2023-05-20', endDate: '2026-05-19', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '9', contractNo: 'CT-2022-017', name: '윤태식', room: '2관 207호', type: '1인실', startDate: '2022-11-01', endDate: '2026-10-31', monthly: 2200000, deposit: 30000000, depositStatus: '분할납부중', status: '계약중' },
  { id: '10', contractNo: 'CT-2024-019', name: '강옥희', room: '2관 209호', type: '1인실', startDate: '2024-06-10', endDate: '2027-06-09', monthly: 2000000, deposit: 25000000, depositStatus: '완납', status: '계약중' },
];

// 보증금 입금 내역 (deposit 탭용)
interface DepositRecord {
  id: string;
  name: string;
  room: string;
  contractNo: string;
  total: number;
  paid: number;
  balance: number;
  depositStatus: string;
  paidDate: string;
}

const emptyForm = { name: '', room: '', type: '1인실', startDate: '', endDate: '', monthly: '2200000', deposit: '30000000' };

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

const tabs = [
  { id: 'register', label: '계약등록', path: '/resident/contract/register' },
  { id: 'deposit', label: '보증금 입금', path: '/resident/contract/deposit' },
  { id: 'status', label: '계약자 현황', path: '/resident/contract/status' },
];

export default function ContractPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || 'register';

  const [residents] = useResidents();
  const [data, setData] = useCollection<ContractItem>('contracts', initialData);

  const depositRecordsInit = useMemo(() => initialData.map(c => ({
    id: c.id,
    name: c.name,
    room: c.room,
    contractNo: c.contractNo,
    total: c.deposit,
    paid: c.depositStatus === '완납' ? c.deposit : c.depositStatus === '분할납부중' ? Math.round(c.deposit * 0.67) : 0,
    balance: c.depositStatus === '완납' ? 0 : c.depositStatus === '분할납부중' ? Math.round(c.deposit * 0.33) : c.deposit,
    depositStatus: c.depositStatus,
    paidDate: c.depositStatus !== '미납' ? c.startDate : '-',
  })), []);

  const residentOptions = useMemo(() => residents
    .filter(r => r.status !== 'DISCHARGED')
    .map(r => ({ name: r.name, room: `${r.building} ${r.roomNumber}호`, type: '1인실' })), [residents]);

  const [depData, setDepData] = useCollection<DepositRecord>('contractDeposits', depositRecordsInit);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedDepId, setSelectedDepId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const filtered = search ? data.filter(d => d.name.includes(search)) : data;

  const nextContractNo = () => {
    const year = new Date().getFullYear();
    const nums = data.map(d => {
      const m = d.contractNo.match(/CT-\d{4}-(\d{3})/);
      return m ? parseInt(m[1]) : 0;
    });
    const next = Math.max(...nums, 0) + 1;
    return `CT-${year}-${String(next).padStart(3, '0')}`;
  };

  const handleResidentSelect = (name: string) => {
    const found = residentOptions.find(r => r.name === name);
    if (found) {
      setFormData(prev => ({ ...prev, name: found.name, room: found.room, type: found.type }));
    } else {
      setFormData(prev => ({ ...prev, name }));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) return;
    const newItem: ContractItem = {
      id: generateId('contract'),
      contractNo: nextContractNo(),
      name: formData.name,
      room: formData.room,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      monthly: Number(formData.monthly) || 0,
      deposit: Number(formData.deposit) || 0,
      depositStatus: '미납',
      status: '계약중',
    };
    setData(prev => [newItem, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const toggleStatus = (id: string) => {
    setData(prev => prev.map(d => {
      if (d.id !== id) return d;
      return { ...d, status: d.status === '계약중' ? '만료' : '계약중' };
    }));
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  const handleDepositPay = () => {
    if (!selectedDepId) return;
    const amount = Number(payAmount) || 0;
    if (amount <= 0) return;
    setDepData(prev => prev.map(r => {
      if (r.id !== selectedDepId) return r;
      const newPaid = r.paid + amount;
      const newBalance = Math.max(0, r.total - newPaid);
      return {
        ...r,
        paid: Math.min(newPaid, r.total),
        balance: newBalance,
        depositStatus: newBalance === 0 ? '완납' : '분할납부중',
        paidDate: new Date().toISOString().slice(0, 10),
      };
    }));
    setShowPayModal(false);
    setSelectedDepId(null);
    setPayAmount('');
  };

  // 현황 탭용 집계
  const statusGroups = {
    active: data.filter(d => d.status === '계약중').length,
    expiringSoon: data.filter(d => d.status === '만료예정' || d.status === '갱신대기').length,
    expired: data.filter(d => d.status === '만료' || d.status === '해지').length,
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">계약관리</h1>
          <p className="mt-1 text-sm text-gray-500">입소자 계약 현황을 조회하고 관리합니다.</p>
        </div>
        {segment === 'register' && (
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
            + 신규 등록
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

      {/* 계약등록 탭 */}
      {segment === 'register' && (
        <div className="space-y-4">
          <div>
            <input type="text" placeholder="입소자명으로 검색..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A] focus:border-transparent" />
          </div>
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
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-blue-600 font-mono text-xs">{row.contractNo}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.room}</td>
                      <td className="px-4 py-3 text-gray-700">{row.type}</td>
                      <td className="px-4 py-3 text-gray-700">{row.startDate}</td>
                      <td className="px-4 py-3 text-gray-700">{row.endDate}</td>
                      <td className="px-4 py-3 text-gray-700 text-right">{row.monthly.toLocaleString('ko-KR')}원</td>
                      <td className="px-4 py-3 text-gray-700 text-right">{row.deposit.toLocaleString('ko-KR')}원</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${depositStatusColor[row.depositStatus]}`}>{row.depositStatus}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${contractStatusColor[row.status]}`}>{row.status}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          <button onClick={() => toggleStatus(row.id)}
                            className={`px-2 py-1 text-xs rounded text-white ${row.status === '계약중' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                            {row.status === '계약중' ? '만료' : '계약중'}
                          </button>
                          <button onClick={() => handleDelete(row.id)} className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 보증금 입금 탭 */}
      {segment === 'deposit' && (
        <div className="space-y-6">
          {/* 요약 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="text-sm text-gray-500">보증금 총액</div>
              <div className="text-xl font-bold text-gray-900 mt-1">{fmt(depData.reduce((s, r) => s + r.total, 0))}</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="text-sm text-gray-500">납부완료</div>
              <div className="text-xl font-bold text-green-600 mt-1">{fmt(depData.reduce((s, r) => s + r.paid, 0))}</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="text-sm text-gray-500">미납잔액</div>
              <div className="text-xl font-bold text-red-600 mt-1">{fmt(depData.reduce((s, r) => s + r.balance, 0))}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">계약번호</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">보증금총액</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">납부액</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">잔액</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">최종납부일</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">처리</th>
                  </tr>
                </thead>
                <tbody>
                  {depData.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.room}</td>
                      <td className="px-4 py-3 text-blue-600 font-mono text-xs">{row.contractNo}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmt(row.total)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmt(row.paid)}</td>
                      <td className="px-4 py-3 text-right font-medium" style={{ color: row.balance > 0 ? '#dc2626' : '#16a34a' }}>{fmt(row.balance)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${depositStatusColor[row.depositStatus]}`}>{row.depositStatus}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.paidDate}</td>
                      <td className="px-4 py-3">
                        {row.balance > 0 && (
                          <button onClick={() => { setSelectedDepId(row.id); setPayAmount(''); setShowPayModal(true); }}
                            className="px-2 py-1 text-xs bg-[#F0835A] text-white rounded hover:bg-[#d9714d]">입금처리</button>
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

      {/* 계약자 현황 탭 */}
      {segment === 'status' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <div className="text-sm text-green-700 font-medium">계약중</div>
              <div className="text-3xl font-bold text-green-700 mt-2">{statusGroups.active}명</div>
              <div className="mt-3 space-y-1">
                {data.filter(d => d.status === '계약중').map(d => (
                  <div key={d.id} className="text-xs text-green-600 flex justify-between">
                    <span>{d.name}</span><span>{d.room}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
              <div className="text-sm text-yellow-700 font-medium">만료예정 / 갱신대기</div>
              <div className="text-3xl font-bold text-yellow-700 mt-2">{statusGroups.expiringSoon}명</div>
              <div className="mt-3 space-y-1">
                {data.filter(d => d.status === '만료예정' || d.status === '갱신대기').map(d => (
                  <div key={d.id} className="text-xs text-yellow-700 flex justify-between">
                    <span>{d.name}</span><span className="text-gray-500">{d.endDate} 만료</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <div className="text-sm text-gray-700 font-medium">만료 / 해지</div>
              <div className="text-3xl font-bold text-gray-600 mt-2">{statusGroups.expired}명</div>
              <div className="mt-3 space-y-1">
                {data.filter(d => d.status === '만료' || d.status === '해지').map(d => (
                  <div key={d.id} className="text-xs text-gray-500 flex justify-between">
                    <span>{d.name}</span><span>{d.room}</span>
                  </div>
                ))}
                {statusGroups.expired === 0 && <div className="text-xs text-gray-400">해당 없음</div>}
              </div>
            </div>
          </div>

          {/* 계약 기간 현황 테이블 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">계약자 전체 현황</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">계약시작일</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">계약종료일</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">기준생활비</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">계약상태</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.room}</td>
                      <td className="px-4 py-3 text-gray-700">{row.startDate}</td>
                      <td className="px-4 py-3 text-gray-700">{row.endDate}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{fmt(row.monthly)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${contractStatusColor[row.status]}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 입금처리 모달 */}
      {showPayModal && selectedDepId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">보증금 입금처리</h2>
            {(() => {
              const item = depData.find(d => d.id === selectedDepId);
              if (!item) return null;
              return (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600"><span className="font-medium text-gray-900">{item.name}</span> ({item.room})</div>
                  <div className="text-sm text-gray-600">미납잔액: <span className="font-bold text-red-600">{fmt(item.balance)}</span></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">입금액</label>
                    <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
                      placeholder={String(item.balance)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
                  </div>
                </div>
              );
            })()}
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setShowPayModal(false); setSelectedDepId(null); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleDepositPay}
                className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 신규 계약 등록 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">신규 계약 등록</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select value={formData.name} onChange={e => handleResidentSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]">
                  <option value="">선택하세요</option>
                  {residentOptions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">호실</label>
                <input type="text" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })}
                  placeholder="예: 1관 101호"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]">
                  <option value="1인실">1인실</option>
                  <option value="2인실">2인실</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계약시작일</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계약종료일</label>
                <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기준생활비</label>
                <input type="number" value={formData.monthly} onChange={e => setFormData({ ...formData, monthly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">보증금</label>
                <input type="number" value={formData.deposit} onChange={e => setFormData({ ...formData, deposit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setShowModal(false); setFormData(emptyForm); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave}
                className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
