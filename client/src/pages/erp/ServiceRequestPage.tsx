import React, { useState } from 'react';
import { residents, staff, generateId, daysAgo } from '../../data/mockData';

interface ServiceRequestItem {
  id: string;
  date: string;
  name: string;
  room: string;
  type: string;
  content: string;
  dueDate: string;
  handler: string;
  status: string;
}

const initialData: ServiceRequestItem[] = [
  { id: '1', date: daysAgo(1), name: '김영순', room: '1관 101호', type: '이미용', content: '커트 및 염색 요청', dueDate: daysAgo(-2), handler: '외부업체 김미장', status: '대기' },
  { id: '2', date: daysAgo(2), name: '이복자', room: '1관 103호', type: '세탁', content: '겨울 이불 세탁 요청', dueDate: daysAgo(0), handler: `생활지도사 ${staff[3].name}`, status: '진행중' },
  { id: '3', date: daysAgo(2), name: '박정호', room: '1관 105호', type: '외출지원', content: '아들 집 방문 외출 지원 (보호자 동행)', dueDate: daysAgo(-4), handler: `생활지도사 ${staff[4].name}`, status: '대기' },
  { id: '4', date: daysAgo(3), name: '최순남', room: '1관 107호', type: '택배', content: '손녀에게 보낼 택배 발송 요청', dueDate: daysAgo(2), handler: `생활지도사 ${staff[3].name}`, status: '완료' },
  { id: '5', date: daysAgo(3), name: '정기원', room: '1관 109호', type: '이미용', content: '파마 예약 요청', dueDate: daysAgo(-2), handler: '외부업체 김미장', status: '대기' },
  { id: '6', date: daysAgo(4), name: '한말순', room: '2관 201호', type: '기타', content: '방 커튼 교체 요청', dueDate: daysAgo(-1), handler: '시설관리 이동수', status: '진행중' },
  { id: '7', date: daysAgo(5), name: '오세진', room: '2관 203호', type: '세탁', content: '카디건 드라이클리닝 요청', dueDate: daysAgo(3), handler: `생활지도사 ${staff[3].name}`, status: '완료' },
  { id: '8', date: daysAgo(6), name: '윤태식', room: '2관 207호', type: '외출지원', content: '병원 외래 후 마트 경유 요청', dueDate: daysAgo(4), handler: `생활지도사 ${staff[4].name}`, status: '완료' },
  { id: '9', date: daysAgo(6), name: '강옥희', room: '2관 209호', type: '택배', content: '지인에게 받은 택배 수령 전달', dueDate: daysAgo(6), handler: `생활지도사 ${staff[3].name}`, status: '완료' },
  { id: '10', date: daysAgo(7), name: '김영순', room: '1관 101호', type: '기타', content: 'TV 리모컨 고장 수리 요청', dueDate: daysAgo(5), handler: '시설관리 이동수', status: '취소' },
];

const statusFilters = ['전체', '대기', '진행중', '완료', '취소'] as const;
const typeOptions = ['이미용', '세탁', '외출지원', '택배', '기타'];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '대기': 'bg-yellow-100 text-yellow-700',
    '진행중': 'bg-blue-100 text-blue-700',
    '완료': 'bg-green-100 text-green-700',
    '취소': 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '이미용': 'bg-pink-100 text-pink-700',
    '세탁': 'bg-cyan-100 text-cyan-700',
    '외출지원': 'bg-indigo-100 text-indigo-700',
    '택배': 'bg-amber-100 text-amber-700',
    '기타': 'bg-gray-100 text-gray-600',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

const nextStatusMap: Record<string, string> = {
  '대기': '진행중',
  '진행중': '완료',
};

const residentOptions = residents.filter(r => r.status !== 'DISCHARGED');

const emptyForm = { residentId: '', type: '이미용', content: '', dueDate: '' };

export default function ServiceRequestPage() {
  const [data, setData] = useState<ServiceRequestItem[]>(initialData);
  const [filter, setFilter] = useState<string>('전체');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const filtered = data
    .filter(d => filter === '전체' || d.status === filter)
    .filter(d => !search || d.name.includes(search) || d.content.includes(search));

  const handleSave = () => {
    if (!formData.residentId || !formData.content) return;
    const res = residents.find(r => r.id === formData.residentId);
    if (!res) return;
    const newItem: ServiceRequestItem = {
      id: generateId('sr'),
      date: new Date().toISOString().slice(0, 10),
      name: res.name,
      room: `${res.building} ${res.roomNumber}호`,
      type: formData.type,
      content: formData.content,
      dueDate: formData.dueDate,
      handler: '-',
      status: '대기',
    };
    setData(prev => [newItem, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const advanceStatus = (id: string) => {
    setData(prev => prev.map(d => {
      if (d.id !== id) return d;
      const next = nextStatusMap[d.status];
      return next ? { ...d, status: next } : d;
    }));
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">서비스신청 (컨시어지)</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]"
        >
          + 서비스 신청
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {statusFilters.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {s}
            <span className="ml-1 text-xs text-gray-400">
              ({s === '전체' ? data.length : data.filter(d => d.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="입소자명 또는 내용 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
        />
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">신청일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">서비스유형</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">내용</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">예정일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처리자</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">{row.date}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.content}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.dueDate}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.handler}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.status)}`}>{row.status}</span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex gap-1">
                      {nextStatusMap[row.status] && (
                        <button
                          onClick={() => advanceStatus(row.id)}
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          {nextStatusMap[row.status]}
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
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">검색 결과가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">서비스 신청</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자 선택</label>
                <select
                  value={formData.residentId}
                  onChange={e => setFormData({ ...formData, residentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="">-- 선택 --</option>
                  {residentOptions.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.building} {r.roomNumber}호)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">서비스유형</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">예정일</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
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
