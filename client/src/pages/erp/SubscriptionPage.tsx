import React, { useState } from 'react';

const depositColor: Record<string, string> = {
  '미납': 'bg-red-100 text-red-800',
  '완납': 'bg-green-100 text-green-800',
  '환불': 'bg-gray-100 text-gray-800',
};

const progressColor: Record<string, string> = {
  '접수': 'bg-blue-100 text-blue-800',
  '승인': 'bg-green-100 text-green-800',
  '취소': 'bg-red-100 text-red-800',
};

interface SubscriptionItem {
  id: string;
  date: string;
  name: string;
  phone: string;
  room: string;
  wishDate: string;
  amount: number;
  deposit: string;
  progress: string;
}

const initialData: SubscriptionItem[] = [
  { id: '1', date: '2026-03-25', name: '김영호', phone: '010-3456-7890', room: '1관 305호', wishDate: '2026-04-15', amount: 5000000, deposit: '완납', progress: '승인' },
  { id: '2', date: '2026-03-23', name: '이정숙', phone: '010-9876-5432', room: '1관 201호', wishDate: '2026-04-20', amount: 5000000, deposit: '완납', progress: '승인' },
  { id: '3', date: '2026-03-22', name: '박현우', phone: '010-1234-5678', room: '2관 102호', wishDate: '2026-05-01', amount: 5000000, deposit: '미납', progress: '접수' },
  { id: '4', date: '2026-03-20', name: '정대호', phone: '010-2222-3333', room: '1관 401호 (2인실)', wishDate: '2026-04-10', amount: 3000000, deposit: '완납', progress: '승인' },
  { id: '5', date: '2026-03-18', name: '한서연', phone: '010-7777-8888', room: '2관 303호', wishDate: '2026-05-15', amount: 5000000, deposit: '미납', progress: '접수' },
  { id: '6', date: '2026-03-15', name: '송미라', phone: '010-6666-7777', room: '1관 102호', wishDate: '2026-04-01', amount: 5000000, deposit: '환불', progress: '취소' },
  { id: '7', date: '2026-03-12', name: '윤재석', phone: '010-4444-5555', room: '2관 205호', wishDate: '2026-04-25', amount: 5000000, deposit: '완납', progress: '승인' },
  { id: '8', date: '2026-03-10', name: '오성호', phone: '010-8888-9999', room: '1관 303호', wishDate: '2026-05-10', amount: 5000000, deposit: '미납', progress: '접수' },
];

const emptyForm = { name: '', phone: '', room: '1관 101호', wishDate: '', amount: '5000000' };

const roomOptions = [
  '1관 101호', '1관 102호', '1관 201호', '1관 301호', '1관 305호', '1관 401호 (2인실)',
  '2관 102호', '2관 205호', '2관 303호', '2관 401호',
];

export default function SubscriptionPage() {
  const [data, setData] = useState<SubscriptionItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const filtered = search ? data.filter(d => d.name.includes(search)) : data;

  const summary = {
    total: data.length,
    approved: data.filter(d => d.progress === '승인').length,
    pending: data.filter(d => d.progress === '접수').length,
    cancelled: data.filter(d => d.progress === '취소').length,
  };

  const handleSave = () => {
    if (!formData.name || !formData.wishDate) return;
    const newItem: SubscriptionItem = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      name: formData.name,
      phone: formData.phone,
      room: formData.room,
      wishDate: formData.wishDate,
      amount: Number(formData.amount) || 5000000,
      deposit: '미납',
      progress: '접수',
    };
    setData(prev => [newItem, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const handleApprove = (id: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, progress: '승인' } : d));
  };

  const handleCancel = (id: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, progress: '취소' } : d));
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">청약관리</h1>
          <p className="mt-1 text-sm text-gray-500">입소 청약 신청 현황을 관리합니다.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors"
        >
          + 신규 등록
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
          <div className="text-sm text-gray-500 mt-1">총 청약</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{summary.approved}</div>
          <div className="text-sm text-gray-500 mt-1">승인완료</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{summary.pending}</div>
          <div className="text-sm text-gray-500 mt-1">대기중</div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{summary.cancelled}</div>
          <div className="text-sm text-gray-500 mt-1">취소</div>
        </div>
      </div>

      {/* 검색 */}
      <div>
        <input
          type="text"
          placeholder="신청자명으로 검색..."
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
                <th className="px-4 py-3 text-left font-semibold text-gray-600">접수일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">신청자명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">희망호실</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">희망입소일</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">청약금액</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">입금상태</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">진행상태</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{row.date}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.phone}</td>
                  <td className="px-4 py-3 text-gray-700">{row.room}</td>
                  <td className="px-4 py-3 text-gray-700">{row.wishDate}</td>
                  <td className="px-4 py-3 text-gray-700 text-right">{row.amount.toLocaleString('ko-KR')}원</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${depositColor[row.deposit]}`}>
                      {row.deposit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${progressColor[row.progress]}`}>
                      {row.progress}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-1">
                      {row.progress === '접수' && (
                        <>
                          <button
                            onClick={() => handleApprove(row.id)}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleCancel(row.id)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            취소
                          </button>
                        </>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">신규 청약 등록</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">신청자명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">희망호실</label>
                <select
                  value={formData.room}
                  onChange={e => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">희망입소일</label>
                <input
                  type="date"
                  value={formData.wishDate}
                  onChange={e => setFormData({ ...formData, wishDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">청약금액</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
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
