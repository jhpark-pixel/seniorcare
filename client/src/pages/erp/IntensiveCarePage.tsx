import React, { useState } from 'react';
import { residents, staff } from '../../data/mockData';

interface IntensiveCareRecord {
  id: string;
  name: string;
  room: string;
  reason: string;
  grade: '상' | '중' | '하';
  period: string;
  manager: string;
  active: boolean;
  vitals: { bp: string; hr: string; temp: string; sugar: string };
}

const initialData: IntensiveCareRecord[] = [
  { id: '1', name: '김영순', room: '1관 101호', reason: '고혈압 + 당뇨 복합 관리', grade: '상', period: '2026-01-15 ~ 현재', manager: '간호사 김서연', active: true, vitals: { bp: '148/92', hr: '78', temp: '36.4', sugar: '165' } },
  { id: '2', name: '이복자', room: '1관 103호', reason: '치매 진행 관찰 + 심부전 모니터링', grade: '상', period: '2026-02-01 ~ 현재', manager: '간호사 김서연', active: true, vitals: { bp: '132/84', hr: '72', temp: '36.6', sugar: '105' } },
  { id: '3', name: '최순남', room: '1관 107호', reason: '뇌졸중 후유증 재활 및 고혈압 관리', grade: '상', period: '2025-11-10 ~ 현재', manager: '간호사 이하은', active: true, vitals: { bp: '152/96', hr: '68', temp: '36.5', sugar: '102' } },
  { id: '4', name: '윤태식', room: '2관 207호', reason: '뇌졸중 + 치매 복합 와파린 복용 모니터링', grade: '상', period: '2026-02-15 ~ 현재', manager: '간호사 이하은', active: true, vitals: { bp: '118/74', hr: '64', temp: '36.3', sugar: '95' } },
  { id: '5', name: '정기원', room: '1관 109호', reason: '파킨슨병 약물 조절 + 우울증 관찰', grade: '중', period: '2026-03-01 ~ 현재', manager: '간호사 김서연', active: true, vitals: { bp: '122/76', hr: '70', temp: '36.5', sugar: '108' } },
  { id: '6', name: '한말순', room: '2관 201호', reason: '중증 치매 안전 관리 + 골다공증 낙상 예방', grade: '중', period: '2026-03-20 ~ 현재', manager: '간호사 이하은', active: true, vitals: { bp: '120/78', hr: '74', temp: '36.7', sugar: '100' } },
];

const gradeStyle = (grade: string) => {
  const map: Record<string, { border: string; bg: string; badge: string }> = {
    '상': { border: 'border-red-300', bg: 'bg-red-50', badge: 'bg-red-500 text-white' },
    '중': { border: 'border-orange-300', bg: 'bg-orange-50', badge: 'bg-orange-500 text-white' },
    '하': { border: 'border-yellow-300', bg: 'bg-yellow-50', badge: 'bg-yellow-500 text-white' },
  };
  return map[grade] || { border: 'border-gray-300', bg: 'bg-gray-50', badge: 'bg-gray-500 text-white' };
};

const residentOptions = residents.map(r => r.name);
const managerOptions = [
  ...staff.filter(s => s.role === 'NURSE').map(s => `간호사 ${s.name}`),
  ...staff.filter(s => s.role === 'SOCIAL_WORKER').map(s => `생활지도사 ${s.name}`),
];

const emptyForm: { name: string; reason: string; grade: '상' | '중' | '하'; manager: string } = { name: residentOptions[0], reason: '', grade: '상', manager: managerOptions[0] };

export default function IntensiveCarePage() {
  const [data, setData] = useState<IntensiveCareRecord[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const activeData = data.filter(d => d.active);
  const gradeCount = { '상': 0, '중': 0, '하': 0 };
  activeData.forEach(d => { gradeCount[d.grade as keyof typeof gradeCount]++; });

  const handleSave = () => {
    if (!formData.name || !formData.reason) return;
    const resident = residents.find(r => r.name === formData.name);
    const newRecord: IntensiveCareRecord = {
      id: crypto.randomUUID(),
      name: formData.name,
      room: resident ? `${resident.building} ${resident.roomNumber}호` : '',
      reason: formData.reason,
      grade: formData.grade,
      period: `${new Date().toISOString().slice(0, 10)} ~ 현재`,
      manager: formData.manager,
      active: true,
      vitals: { bp: '-', hr: '-', temp: '-', sugar: '-' },
    };
    setData(prev => [...prev, newRecord]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const handleComplete = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setData(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, active: false, period: r.period.replace('현재', today) };
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">집중케어</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 대상자 등록
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{activeData.length}</div>
          <div className="text-xs text-gray-500 mt-1">전체 대상자</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{gradeCount['상']}</div>
          <div className="text-xs text-gray-500 mt-1">상 (긴급)</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{gradeCount['중']}</div>
          <div className="text-xs text-gray-500 mt-1">중 (주의)</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{gradeCount['하']}</div>
          <div className="text-xs text-gray-500 mt-1">하 (관찰)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeData.map((resident) => {
          const style = gradeStyle(resident.grade);
          return (
            <div key={resident.id} className={`rounded-lg border-2 ${style.border} ${style.bg} p-4 shadow-sm`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{resident.name}</h3>
                  <p className="text-xs text-gray-500">{resident.room}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style.badge}`}>
                  {resident.grade}등급
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">관리사유</span>
                  <p className="text-sm text-gray-700">{resident.reason}</p>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>기간: {resident.period}</span>
                </div>
                <div className="text-xs text-gray-500">
                  담당: {resident.manager}
                </div>
              </div>

              <div className="border-t pt-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">최근 바이탈</span>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400">혈압</div>
                    <div className={`text-xs font-semibold ${parseInt(resident.vitals.bp) > 140 ? 'text-red-600' : 'text-gray-700'}`}>
                      {resident.vitals.bp}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400">심박</div>
                    <div className="text-xs font-semibold text-gray-700">{resident.vitals.hr}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400">체온</div>
                    <div className="text-xs font-semibold text-gray-700">{resident.vitals.temp}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400">혈당</div>
                    <div className={`text-xs font-semibold ${parseInt(resident.vitals.sugar) > 140 ? 'text-orange-600' : 'text-gray-700'}`}>
                      {resident.vitals.sugar}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t">
                <button onClick={() => handleComplete(resident.id)} className="w-full px-3 py-1.5 text-xs bg-green-500 text-white rounded hover:bg-green-600 font-medium">완료</button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">대상자 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {residentOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관리사유</label>
                <input type="text" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관리등급</label>
                <select value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value as '상' | '중' | '하' })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="상">상 (긴급)</option>
                  <option value="중">중 (주의)</option>
                  <option value="하">하 (관찰)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                <select value={formData.manager} onChange={e => setFormData({ ...formData, manager: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {managerOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
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
