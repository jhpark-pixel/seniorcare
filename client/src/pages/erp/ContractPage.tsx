import React, { useState } from 'react';

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
  { id: '1', contractNo: 'CT-2025-001', name: '김영순', room: '1관 301호', type: '1인실', startDate: '2025-01-15', endDate: '2026-01-14', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '2', contractNo: 'CT-2025-003', name: '이순자', room: '2관 205호', type: '1인실', startDate: '2025-03-01', endDate: '2026-02-28', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '3', contractNo: 'CT-2025-005', name: '박정희', room: '1관 402호', type: '2인실', startDate: '2025-05-10', endDate: '2026-05-09', monthly: 1800000, deposit: 20000000, depositStatus: '분할납부중', status: '계약중' },
  { id: '4', contractNo: 'CT-2025-007', name: '최옥순', room: '2관 103호', type: '1인실', startDate: '2025-02-01', endDate: '2026-01-31', monthly: 2500000, deposit: 35000000, depositStatus: '완납', status: '만료예정' },
  { id: '5', contractNo: 'CT-2025-009', name: '정미숙', room: '1관 201호', type: '1인실', startDate: '2025-06-15', endDate: '2026-06-14', monthly: 2200000, deposit: 30000000, depositStatus: '완납', status: '계약중' },
  { id: '6', contractNo: 'CT-2025-011', name: '한순이', room: '2관 302호', type: '2인실', startDate: '2025-04-01', endDate: '2026-03-31', monthly: 1800000, deposit: 20000000, depositStatus: '완납', status: '갱신대기' },
  { id: '7', contractNo: 'CT-2024-022', name: '강말숙', room: '1관 105호', type: '1인실', startDate: '2024-09-01', endDate: '2025-08-31', monthly: 2000000, deposit: 25000000, depositStatus: '환불완료', status: '해지' },
  { id: '8', contractNo: 'CT-2025-015', name: '서복순', room: '2관 401호', type: '2인실', startDate: '2025-07-01', endDate: '2026-06-30', monthly: 1500000, deposit: 20000000, depositStatus: '미납', status: '계약중' },
];

const emptyForm = { name: '', room: '', type: '1인실', startDate: '', endDate: '', monthly: '2200000', deposit: '30000000' };

export default function ContractPage() {
  const [data, setData] = useState<ContractItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');

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

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) return;
    const newItem: ContractItem = {
      id: crypto.randomUUID(),
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

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">계약관리</h1>
          <p className="mt-1 text-sm text-gray-500">입소자 계약 현황을 조회하고 관리합니다.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors"
        >
          + 신규 등록
        </button>
      </div>

      {/* 검색 */}
      <div>
        <input
          type="text"
          placeholder="입소자명으로 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A] focus:border-transparent"
        />
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
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${depositStatusColor[row.depositStatus]}`}>
                      {row.depositStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${contractStatusColor[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleStatus(row.id)}
                        className={`px-2 py-1 text-xs rounded text-white ${row.status === '계약중' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {row.status === '계약중' ? '만료' : '계약중'}
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">신규 계약 등록</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">호실</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={e => setFormData({ ...formData, room: e.target.value })}
                  placeholder="예: 1관 301호"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="1인실">1인실</option>
                  <option value="2인실">2인실</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계약시작일</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">계약종료일</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기준생활비</label>
                <input
                  type="number"
                  value={formData.monthly}
                  onChange={e => setFormData({ ...formData, monthly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">보증금</label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={e => setFormData({ ...formData, deposit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowModal(false); setFormData(emptyForm); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleSave}
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
