import React, { useState } from 'react';
import { residents } from '../../data/mockData';

interface Checkup {
  id: string;
  date: string;
  name: string;
  room: string;
  type: string;
  hospital: string;
  doctor: string;
  result: string;
  nextDate: string;
}

const initialData: Checkup[] = [
  { id: '1', date: '2026-03-15', name: '김영순', room: '1관 101호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '혈압 경계, 콜레스테롤 약간 상승. 고혈압/당뇨 관리 식이 조절 권고', nextDate: '2026-06-15' },
  { id: '2', date: '2026-03-18', name: '이복자', room: '1관 103호', type: '정밀', hospital: '시화병원', doctor: '박진수', result: '심부전 안정적. 도네페질 투여 중 치매 진행 모니터링 지속 필요', nextDate: '2026-06-18' },
  { id: '3', date: '2026-03-20', name: '최순남', room: '1관 107호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '뇌졸중 후유증 안정. 클로피도그렐 복용 중 출혈 소견 없음', nextDate: '2026-06-20' },
  { id: '4', date: '2026-03-22', name: '박정호', room: '1관 105호', type: '정형외과', hospital: '정형외과의원', doctor: '김정형', result: '관절염 약간 진행. 골다공증 수치 유지. 알렌드론산 지속 복용 권고', nextDate: '2026-09-22' },
  { id: '5', date: '2026-03-25', name: '오세진', room: '2관 203호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: 'COPD 폐기능 안정. 흡입기 사용 적절. 혈압 양호', nextDate: '2026-06-25' },
  { id: '6', date: '2026-04-01', name: '정기원', room: '1관 109호', type: '정밀', hospital: '시화병원', doctor: '박진수', result: '-', nextDate: '2026-07-01' },
  { id: '7', date: '2026-04-05', name: '한말순', room: '2관 201호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '-', nextDate: '2026-07-05' },
  { id: '8', date: '2026-04-10', name: '윤태식', room: '2관 207호', type: '정밀', hospital: '시화병원', doctor: '박진수', result: '-', nextDate: '2026-07-10' },
  { id: '9', date: '2026-04-15', name: '강옥희', room: '2관 209호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '-', nextDate: '2026-07-15' },
];

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '일반': 'bg-blue-100 text-blue-700',
    '정밀': 'bg-red-100 text-red-700',
    '치과': 'bg-teal-100 text-teal-700',
    '안과': 'bg-purple-100 text-purple-700',
    '정형외과': 'bg-orange-100 text-orange-700',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

const residentOptions = residents.map(r => r.name);
const emptyForm = { name: residentOptions[0], type: '일반', hospital: '', doctor: '', date: '', result: '' };

export default function MedicalCheckupPage() {
  const [data, setData] = useState<Checkup[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const today = new Date('2026-03-30');
  const upcoming = data.filter(d => new Date(d.date) >= today);
  const past = data.filter(d => new Date(d.date) < today);

  const handleSave = () => {
    if (editId) {
      setData(prev => prev.map(r => r.id === editId ? { ...r, result: formData.result } : r));
    } else {
      const resident = residents.find(r => r.name === formData.name);
      const newRecord: Checkup = {
        id: crypto.randomUUID(),
        date: formData.date,
        name: formData.name,
        room: resident ? `${resident.building} ${resident.roomNumber}호` : '',
        type: formData.type,
        hospital: formData.hospital,
        doctor: formData.doctor,
        result: formData.result || '-',
        nextDate: '',
      };
      setData(prev => [...prev, newRecord]);
    }
    setFormData(emptyForm);
    setEditId(null);
    setShowModal(false);
  };

  const openEdit = (item: Checkup) => {
    setEditId(item.id);
    setFormData({ name: item.name, type: item.type, hospital: item.hospital, doctor: item.doctor, date: item.date, result: item.result === '-' ? '' : item.result });
    setShowModal(true);
  };

  const openNew = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">정기검진</h1>
        <button onClick={openNew} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 검진 등록
        </button>
      </div>

      {upcoming.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">예정된 검진</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcoming.map(item => (
              <div key={item.id} className="bg-white rounded-lg border border-blue-100 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(item.type)}`}>{item.type}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <div>{item.date} | {item.room}</div>
                  <div>{item.hospital} - {item.doctor} 의사</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">검진 이력</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진유형</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">병원명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">담당의</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">결과요약</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">다음검진일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {[...past, ...upcoming].map((row) => {
                const isPast = new Date(row.date) < today;
                return (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                      {row.date}
                      {!isPast && <span className="ml-1 text-[10px] text-blue-600 font-medium">예정</span>}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{row.hospital}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.doctor}</td>
                    <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.result || '-'}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.nextDate}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => openEdit(row)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">결과수정</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editId ? '결과 수정' : '검진 등록'}</h2>
            <div className="space-y-3">
              {!editId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                    <select value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {residentOptions.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">검진유형</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>일반</option>
                      <option>정밀</option>
                      <option>치과</option>
                      <option>안과</option>
                      <option>정형외과</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">병원명</label>
                    <input type="text" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">담당의</label>
                    <input type="text" value={formData.doctor} onChange={e => setFormData({ ...formData, doctor: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">검진일</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">결과요약</label>
                <textarea value={formData.result} onChange={e => setFormData({ ...formData, result: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowModal(false); setEditId(null); setFormData(emptyForm); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
