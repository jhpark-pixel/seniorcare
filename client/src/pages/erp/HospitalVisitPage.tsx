import React, { useState } from 'react';
import { residents, staff, generateId, daysAgo } from '../../data/mockData';

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
  { id: '1', date: daysAgo(-1), name: '김영순', room: '1관 101호', hospital: '배곧서울병원', dept: '내과', companion: `간호사 ${staff[1].name}`, note: '혈압약 처방 변경 상담', status: '예약' },
  { id: '2', date: daysAgo(-2), name: '송미경', room: '2관 205호', hospital: '시화병원', dept: '심장내과', companion: `간호사 ${staff[2].name}`, note: '심부전 외래 진료 및 약 조정', status: '예약' },
  { id: '3', date: daysAgo(-5), name: '이복자', room: '1관 103호', hospital: '분당서울대병원', dept: '신경과', companion: `간호사 ${staff[1].name}`, note: '치매 정기 외래 (보호자 동행)', status: '예약' },
  { id: '4', date: daysAgo(3), name: '최순남', room: '1관 107호', hospital: '배곧서울병원', dept: '신경과', companion: `생활지도사 ${staff[4].name}`, note: '뇌졸중 재활 경과 확인', status: '완료' },
  { id: '5', date: daysAgo(5), name: '윤태식', room: '2관 207호', hospital: '시화병원', dept: '신경과', companion: `간호사 ${staff[2].name}`, note: 'INR 수치 확인 및 와파린 조절', status: '완료' },
  { id: '6', date: daysAgo(6), name: '정기원', room: '1관 109호', hospital: '배곧서울병원', dept: '정신건강의학과', companion: `생활지도사 ${staff[3].name}`, note: '우울증 약 처방 및 상담', status: '완료' },
  { id: '7', date: daysAgo(9), name: '박정호', room: '1관 105호', hospital: '배곧좋은치과', dept: '치과', companion: `생활지도사 ${staff[4].name}`, note: '틀니 수리 완료 수령', status: '완료' },
  { id: '8', date: daysAgo(-3), name: '강옥희', room: '2관 209호', hospital: '배곧서울병원', dept: '정형외과', companion: `간호사 ${staff[2].name}`, note: '관절염 진료 및 약 처방', status: '예약' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '예약': 'bg-blue-100 text-blue-700',
    '완료': 'bg-green-100 text-green-700',
    '취소': 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const residentOptions = residents.filter(r => r.status !== 'DISCHARGED');
const emptyForm = { residentId: '', hospital: '', dept: '', date: '', companionId: '', note: '' };

export default function HospitalVisitPage() {
  const [data, setData] = useState<HospitalVisit[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const upcoming = data.filter(d => d.status === '예약');
  const completed = data.filter(d => d.status === '완료');

  const handleSave = () => {
    if (!formData.residentId || !formData.hospital || !formData.date) return;
    const res = residents.find(r => r.id === formData.residentId);
    if (!res) return;
    const companion = staff.find(s => s.id === formData.companionId);
    const newRecord: HospitalVisit = {
      id: generateId('hv'),
      date: formData.date,
      name: res.name,
      room: `${res.building} ${res.roomNumber}호`,
      hospital: formData.hospital,
      dept: formData.dept,
      companion: companion ? `${companion.roleLabel} ${companion.name}` : '-',
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
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자 선택</label>
                <select
                  value={formData.residentId}
                  onChange={e => setFormData({ ...formData, residentId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="">-- 선택 --</option>
                  {residentOptions.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.building} {r.roomNumber}호)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">병원명</label>
                <input type="text" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">진료과</label>
                <input type="text" value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예정일</label>
                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">동행자</label>
                <select
                  value={formData.companionId}
                  onChange={e => setFormData({ ...formData, companionId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="">-- 선택 --</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.roleLabel} {s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
                <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
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
