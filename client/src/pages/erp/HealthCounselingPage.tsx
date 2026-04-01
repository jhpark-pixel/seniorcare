import React, { useState } from 'react';
import { residents, staff } from '../../data/mockData';

const today = '2026-03-30';

interface HealthCounselingItem {
  id: string;
  datetime: string;
  name: string;
  room: string;
  type: string;
  counselor: string;
  summary: string;
  status: string;
}

const initialData: HealthCounselingItem[] = [
  { id: '1', datetime: '2026-03-30 09:00', name: '김영순', room: '1관 101호', type: '일반건강', counselor: '간호사 김서연', summary: '혈압 상승 경향에 대한 생활습관 상담', status: '완료' },
  { id: '2', datetime: '2026-03-30 10:00', name: '이복자', room: '1관 103호', type: '투약', counselor: '간호사 이하은', summary: '도네페질 복용 후 부작용 여부 확인 및 치매 진행 상담', status: '완료' },
  { id: '3', datetime: '2026-03-30 11:00', name: '최순남', room: '1관 107호', type: '정기검진', counselor: '간호사 김서연', summary: '뇌졸중 후 재활 경과 및 혈압 약 조절 상담', status: '예약' },
  { id: '4', datetime: '2026-03-30 14:00', name: '박정호', room: '1관 105호', type: '운동', counselor: '생활지도사 최민정', summary: '관절염 완화를 위한 운동 프로그램 상담', status: '예약' },
  { id: '5', datetime: '2026-03-30 15:00', name: '윤태식', room: '2관 207호', type: '외래', counselor: '간호사 이하은', summary: '와파린 복용 중 심장내과 외래 진료 결과 상담', status: '예약' },
  { id: '6', datetime: '2026-03-29 09:30', name: '정기원', room: '1관 109호', type: '일반건강', counselor: '간호사 김서연', summary: '파킨슨병 약 복용 및 우울증 증상 모니터링 상담', status: '완료' },
  { id: '7', datetime: '2026-03-29 11:00', name: '오세진', room: '2관 203호', type: '투약', counselor: '간호사 이하은', summary: 'COPD 흡입기 사용법 및 고혈압약 복용 시간 조정 상담', status: '완료' },
  { id: '8', datetime: '2026-03-28 14:00', name: '한말순', room: '2관 201호', type: '정기검진', counselor: '간호사 김서연', summary: '중증 치매 진행 상태 및 골다공증 관련 혈액검사 결과 상담', status: '완료' },
  { id: '9', datetime: '2026-03-31 10:00', name: '강옥희', room: '2관 209호', type: '운동', counselor: '생활지도사 박은지', summary: '관절염 및 우울증 완화를 위한 낙상 예방 운동 프로그램 안내', status: '예약' },
  { id: '10', datetime: '2026-03-28 09:00', name: '송미경', room: '2관 205호', type: '외래', counselor: '간호사 이하은', summary: '입원 중 심부전 경과 보고 및 보호자 연락 사항 전달', status: '취소' },
];

const residentOptions = residents.map(r => r.name);
const typeOptions = ['일반건강', '투약', '정기검진', '운동', '외래'];
const counselorOptions = [
  ...staff.filter(s => s.role === 'NURSE').map(s => `간호사 ${s.name}`),
  ...staff.filter(s => s.role === 'SOCIAL_WORKER').map(s => `생활지도사 ${s.name}`),
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '예약': 'bg-blue-100 text-blue-700',
    '완료': 'bg-green-100 text-green-700',
    '취소': 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '일반건강': 'bg-teal-100 text-teal-700',
    '외래': 'bg-purple-100 text-purple-700',
    '정기검진': 'bg-indigo-100 text-indigo-700',
    '운동': 'bg-orange-100 text-orange-700',
    '투약': 'bg-pink-100 text-pink-700',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

const emptyForm = { name: residentOptions[0], type: '일반건강', datetime: '', counselor: counselorOptions[0], summary: '' };

export default function HealthCounselingPage() {
  const [data, setData] = useState<HealthCounselingItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const filtered = search ? data.filter(d => d.name.includes(search)) : data;

  const todayCount = data.filter(d => d.datetime.startsWith(today)).length;
  const completedCount = data.filter(d => d.status === '완료').length;
  const reservedCount = data.filter(d => d.status === '예약').length;

  const handleSave = () => {
    if (!formData.name || !formData.datetime) return;
    const resident = residents.find(r => r.name === formData.name);
    const newItem: HealthCounselingItem = {
      id: crypto.randomUUID(),
      datetime: formData.datetime.replace('T', ' '),
      name: formData.name,
      room: resident ? `${resident.building} ${resident.roomNumber}호` : '',
      type: formData.type,
      counselor: formData.counselor,
      summary: formData.summary,
      status: '예약',
    };
    setData(prev => [newItem, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const changeStatus = (id: string, status: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">건강상담</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]"
        >
          + 상담 예약
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{todayCount}</div>
          <div className="text-xs text-gray-500 mt-1">오늘 상담</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          <div className="text-xs text-gray-500 mt-1">완료</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{reservedCount}</div>
          <div className="text-xs text-gray-500 mt-1">예약대기</div>
        </div>
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

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">상담 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">예약일시</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상담유형</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상담사</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">내용요약</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const isToday = row.datetime.startsWith(today);
                return (
                  <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50 ${isToday ? 'bg-orange-50/50' : ''}`}>
                    <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                      {row.datetime}
                      {isToday && <span className="ml-1 text-[10px] text-[#F0835A] font-medium">TODAY</span>}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{row.counselor}</td>
                    <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.summary}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.status)}`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex gap-1">
                        {row.status === '예약' && (
                          <>
                            <button
                              onClick={() => changeStatus(row.id, '완료')}
                              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              완료
                            </button>
                            <button
                              onClick={() => changeStatus(row.id, '취소')}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">상담 예약</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  {residentOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담유형</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예약일시</label>
                <input
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={e => setFormData({ ...formData, datetime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담사</label>
                <select
                  value={formData.counselor}
                  onChange={e => setFormData({ ...formData, counselor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  {counselorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
              />
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
