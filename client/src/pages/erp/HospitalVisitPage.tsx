import React, { useState } from 'react';

interface HospitalVisit {
  id: string;
  date: string;
  name: string;
  room: string;
  hospital: string;
  dept: string;
  companion: string;
  note: string;
  status: '예약' | '완료' | '취소';
}

const initialData: HospitalVisit[] = [
  { id: '1', date: '2026-04-01', name: '김영순', room: '1관 301호', hospital: '배곧서울병원', dept: '내과', companion: '간호사 김미영', note: '혈압약 처방 변경 상담', status: '예약' },
  { id: '2', date: '2026-04-02', name: '이순자', room: '2관 205호', hospital: '시화병원', dept: '내분비내과', companion: '간호사 이정은', note: '인슐린 용량 조정 외래', status: '예약' },
  { id: '3', date: '2026-04-05', name: '박정희', room: '1관 402호', hospital: '분당서울대병원', dept: '신경과', companion: '간호사 김미영', note: '치매 정기 외래 (보호자 동행)', status: '예약' },
  { id: '4', date: '2026-03-28', name: '최옥순', room: '2관 103호', hospital: '배곧서울병원', dept: '정형외과', companion: '생활지도사 최은영', note: '무릎 관절 통증 진료', status: '완료' },
  { id: '5', date: '2026-03-26', name: '한순이', room: '2관 302호', hospital: '시화병원', dept: '심장내과', companion: '간호사 이정은', note: 'INR 수치 확인 및 와파린 조절', status: '완료' },
  { id: '6', date: '2026-03-25', name: '정미숙', room: '1관 201호', hospital: '밝은눈안과', dept: '안과', companion: '생활지도사 박수진', note: '안압 검사 및 안약 처방', status: '완료' },
  { id: '7', date: '2026-03-22', name: '오말순', room: '1관 105호', hospital: '배곧좋은치과', dept: '치과', companion: '생활지도사 최은영', note: '틀니 수리 완료 수령', status: '완료' },
  { id: '8', date: '2026-04-03', name: '강순덕', room: '2관 401호', hospital: '배곧서울병원', dept: '재활의학과', companion: '간호사 이정은', note: '퇴원 후 재활치료 경과 확인', status: '예약' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '예약': 'bg-blue-100 text-blue-700',
    '완료': 'bg-green-100 text-green-700',
    '취소': 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const emptyForm = { name: '', hospital: '', dept: '', date: '', companion: '', note: '' };

export default function HospitalVisitPage() {
  const [data, setData] = useState<HospitalVisit[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const upcoming = data.filter(d => d.status === '예약');
  const completed = data.filter(d => d.status === '완료');

  const handleSave = () => {
    const newRecord: HospitalVisit = {
      id: crypto.randomUUID(),
      date: formData.date,
      name: formData.name,
      room: '',
      hospital: formData.hospital,
      dept: formData.dept,
      companion: formData.companion,
      note: formData.note,
      status: '예약',
    };
    setData(prev => [newRecord, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const handleStatusChange = (id: string, newStatus: '완료' | '취소') => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">병원동행</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 동행 예약
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{upcoming.length}</div>
          <div className="text-xs text-gray-500 mt-1">예약 중</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completed.length}</div>
          <div className="text-xs text-gray-500 mt-1">완료</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{data.length}</div>
          <div className="text-xs text-gray-500 mt-1">전체</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">병원동행 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">예정일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">병원명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">진료과</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">동행자</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">비고</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50 ${row.status === '예약' ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                  <td className="px-4 py-2.5 text-gray-700">{row.hospital}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.dept}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.companion}</td>
                  <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.note}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.status)}`}>{row.status}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {row.status === '예약' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleStatusChange(row.id, '완료')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">완료</button>
                        <button onClick={() => handleStatusChange(row.id, '취소')} className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500">취소</button>
                      </div>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">동행 예약</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">병원명</label>
                <input type="text" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">진료과</label>
                <input type="text" value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예정일</label>
                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">동행자</label>
                <input type="text" value={formData.companion} onChange={e => setFormData({ ...formData, companion: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
                <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowModal(false); setFormData(emptyForm); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
