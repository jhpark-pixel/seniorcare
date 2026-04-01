import React, { useState } from 'react';
import { residents } from '../../data/mockData';

interface MedicationItem {
  id: string;
  residentId: string;
  name: string;
  room: string;
  drug: string;
  dose: string;
  times: string[];
  doctor: string;
  prescDate: string;
  status: string;
}

// Build initial medication data from shared mock residents
const initialData: MedicationItem[] = residents.flatMap((r, ri) =>
  r.medications.map((med, mi) => ({
    id: `${ri + 1}-${mi + 1}`,
    residentId: r.id,
    name: r.name,
    room: `${r.building} ${r.roomNumber}호`,
    drug: `${med.name} ${med.dosage}`,
    dose: '1정',
    times: med.schedule.split(','),
    doctor: med.prescribedBy,
    prescDate: '2026-01-01',
    status: med.isActive ? '활성' : '중단',
  }))
);

const allTimes = ['아침', '점심', '저녁', '취침전'];

const timeBadge = (time: string) => {
  const map: Record<string, string> = {
    '아침': 'bg-yellow-100 text-yellow-700',
    '점심': 'bg-green-100 text-green-700',
    '저녁': 'bg-blue-100 text-blue-700',
    '취침전': 'bg-purple-100 text-purple-700',
  };
  return map[time] || 'bg-gray-100 text-gray-600';
};

const statusFilters = ['전체', '활성', '중단'] as const;

const residentOptions = residents.map(r => r.name);
const emptyForm = { name: residentOptions[0], drug: '', dose: '', times: [] as string[], doctor: '' };

export default function MedicationPage() {
  const [data, setData] = useState<MedicationItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [filter, setFilter] = useState<string>('전체');

  const filtered = filter === '전체' ? data : data.filter(d => d.status === filter);

  const activeData = data.filter(d => d.status === '활성');
  const activeCount = activeData.length;
  const uniqueResidents = new Set(activeData.map(d => d.name)).size;

  const countByResident: Record<string, number> = {};
  activeData.forEach(d => {
    countByResident[d.name] = (countByResident[d.name] || 0) + 1;
  });
  const polypharmacy = Object.entries(countByResident).filter(([, c]) => c >= 5);

  const toggleTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time],
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.drug || formData.times.length === 0) return;
    const resident = residents.find(r => r.name === formData.name);
    const newItem: MedicationItem = {
      id: crypto.randomUUID(),
      residentId: resident?.id ?? '',
      name: formData.name,
      room: resident ? `${resident.building} ${resident.roomNumber}호` : '',
      drug: formData.drug,
      dose: formData.dose,
      times: formData.times,
      doctor: formData.doctor,
      prescDate: new Date().toISOString().slice(0, 10),
      status: '활성',
    };
    setData(prev => [newItem, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setData(prev => prev.map(d => {
      if (d.id !== id) return d;
      return { ...d, status: d.status === '활성' ? '중단' : '활성' };
    }));
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">투약관리</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]"
        >
          + 처방 등록
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{uniqueResidents}</div>
          <div className="text-xs text-gray-500 mt-1">전체 투약자</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          <div className="text-xs text-gray-500 mt-1">활성 처방</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{polypharmacy.length}</div>
          <div className="text-xs text-gray-500 mt-1">다약제 복용자 (5종 이상)</div>
        </div>
      </div>

      {polypharmacy.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-red-800 mb-2">다약제 복용 주의 대상자</h3>
          <div className="space-y-1">
            {polypharmacy.map(([name, count]) => (
              <div key={name} className="text-sm text-red-700">
                {name} - {count}종 복용 중
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 상태 필터 */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
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

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">투약 목록 ({filtered.length}건)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">약물명</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">용량</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">복용시간</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처방의</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처방일</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50 ${row.status === '중단' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                  <td className="px-4 py-2.5 text-gray-700 font-medium">{row.drug}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.dose}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 flex-wrap">
                      {row.times.map(t => (
                        <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${timeBadge(t)}`}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{row.doctor}</td>
                  <td className="px-4 py-2.5 text-gray-600">{row.prescDate}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${row.status === '활성' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleActive(row.id)}
                        className={`px-2 py-1 text-xs rounded text-white ${row.status === '활성' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {row.status === '활성' ? '중단' : '활성'}
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
            <h2 className="text-lg font-bold text-gray-900">처방 등록</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">약물명</label>
                <input
                  type="text"
                  value={formData.drug}
                  onChange={e => setFormData({ ...formData, drug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">용량</label>
                <input
                  type="text"
                  value={formData.dose}
                  onChange={e => setFormData({ ...formData, dose: e.target.value })}
                  placeholder="예: 1정"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">처방의</label>
                <input
                  type="text"
                  value={formData.doctor}
                  onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">복용시간 (복수 선택)</label>
              <div className="flex gap-2">
                {allTimes.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTime(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      formData.times.includes(t)
                        ? 'bg-[#F0835A] text-white border-[#F0835A]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
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
