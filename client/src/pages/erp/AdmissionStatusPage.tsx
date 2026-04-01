import React, { useState, useMemo } from 'react';
import { generateId } from '../../data/mockData';
import { useResidents } from '../../context/AppStateContext';

// 최근 퇴소자 - 재계약 거부 또는 만료 예시 (송미경 외출/입원 포함)
const recentDischarges = [
  { name: '박정호', room: '1관 105호', date: '2026-03-15', reason: '건강 호전으로 자택 복귀', guardian: '박미선 (딸)' },
  { name: '최순남', room: '1관 107호', date: '2026-03-05', reason: '타 시설 이전', guardian: '최민호 (아들)' },
];

interface AdmissionRecord {
  id: string;
  name: string;
  room: string;
  date: string;
  type: '입소' | '퇴소';
  reason: string;
  guardian: string;
}

export default function AdmissionStatusPage() {
  const [residents] = useResidents();
  const activeResidents = useMemo(() => residents.filter(r => r.status !== 'DISCHARGED'), [residents]);

  const summaryCards = useMemo(() => {
    const activeCount = residents.filter(r => r.status === 'ACTIVE').length;
    const hospitalizedCount = residents.filter(r => r.status === 'HOSPITALIZED').length;
    const outingCount = residents.filter(r => r.status === 'OUTING').length;
    const dischargedCount = residents.filter(r => r.status === 'DISCHARGED').length;
    const totalEver = residents.length;
    return [
      { label: '총 입소자', value: totalEver, color: 'text-gray-900', bg: 'bg-blue-50' },
      { label: '현재 입주중', value: activeCount, color: 'text-green-600', bg: 'bg-green-50' },
      { label: '외출중', value: outingCount, color: 'text-yellow-600', bg: 'bg-yellow-50' },
      { label: '입원중', value: hospitalizedCount, color: 'text-orange-600', bg: 'bg-orange-50' },
      { label: '퇴소', value: dischargedCount, color: 'text-red-600', bg: 'bg-red-50' },
    ];
  }, [residents]);

  const recentAdmissions = useMemo(() =>
    [...activeResidents]
      .sort((a, b) => new Date(b.moveInDate).getTime() - new Date(a.moveInDate).getTime())
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        room: `${r.building} ${r.roomNumber}호`,
        date: r.moveInDate,
        reason: r.diseases.length > 0 ? r.diseases.join(', ') + ' 관리' : '노인성 질환 관리',
        guardian: `${r.emergencyContact.name} (${r.emergencyContact.relationship})`,
      })),
    [activeResidents],
  );

  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', room: '', date: '', type: '입소' as '입소' | '퇴소', reason: '', guardian: '' });

  const residentOptions = useMemo(() => activeResidents.map(r => ({
    name: r.name,
    room: `${r.building} ${r.roomNumber}호`,
    guardian: `${r.emergencyContact.name} (${r.emergencyContact.relationship})`,
  })), [activeResidents]);

  const handleResidentSelect = (name: string) => {
    const found = residentOptions.find(r => r.name === name);
    if (found) {
      setForm(prev => ({ ...prev, name: found.name, room: found.room, guardian: found.guardian }));
    }
  };

  const handleSave = () => {
    if (!form.name || !form.date) return;
    const newRecord: AdmissionRecord = {
      id: generateId('adm'),
      name: form.name,
      room: form.room,
      date: form.date,
      type: form.type,
      reason: form.reason,
      guardian: form.guardian,
    };
    setAdmissions(prev => [newRecord, ...prev]);
    setForm({ name: '', room: '', date: '', type: '입소', reason: '', guardian: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">입퇴소자현황</h1>
          <p className="mt-1 text-sm text-gray-500">입소 및 퇴소 현황을 한눈에 확인합니다.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors"
        >
          + 입퇴소 등록
        </button>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-5 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-lg shadow border border-gray-200 p-5`}>
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}명</div>
          </div>
        ))}
      </div>

      {/* 신규 등록 내역 */}
      {admissions.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">신규 등록 내역</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['이름', '호실', '구분', '일자', '사유', '보호자'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admissions.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.type === '입소' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.reason}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{r.guardian}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 최근 입소자 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 입소자</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['이름', '호실', '입소일', '사유', '보호자'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAdmissions.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.guardian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 최근 퇴소자 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 퇴소자</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['이름', '호실', '퇴소일', '사유', '보호자'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentDischarges.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.guardian}</td>
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
            <h2 className="text-lg font-bold text-gray-900">입퇴소 등록</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select
                  value={form.name}
                  onChange={e => handleResidentSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="">선택하세요</option>
                  {residentOptions.map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">구분</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value as '입소' | '퇴소' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="입소">입소</option>
                  <option value="퇴소">퇴소</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">호실</label>
                <input
                  type="text"
                  value={form.room}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">일자</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">사유</label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">보호자</label>
                <input
                  type="text"
                  value={form.guardian}
                  onChange={e => setForm({ ...form, guardian: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowModal(false); setForm({ name: '', room: '', date: '', type: '입소', reason: '', guardian: '' }); }}
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
