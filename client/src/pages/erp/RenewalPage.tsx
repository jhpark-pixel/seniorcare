import React, { useState, useMemo } from 'react';
import { generateId } from '../../data/mockData';
import { useResidents } from '../../context/AppStateContext';

const intentColor: Record<string, string> = {
  '희망': 'bg-green-100 text-green-800',
  '미정': 'bg-yellow-100 text-yellow-800',
  '거부': 'bg-red-100 text-red-800',
};

interface RenewalItem {
  id: string;
  name: string;
  room: string;
  start: string;
  end: string;
  remaining: number;
  intent: string;
  note: string;
}

export default function RenewalPage() {
  const [residents] = useResidents();

  const initialData = useMemo<RenewalItem[]>(() =>
    residents
      .filter(r => r.status !== 'DISCHARGED')
      .map(r => {
        const start = new Date(r.moveInDate);
        const end = new Date(start);
        end.setFullYear(end.getFullYear() + 4);
        const today = new Date('2026-04-01');
        const diffMs = end.getTime() - today.getTime();
        const remaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

        let intent = '미정';
        if (remaining <= 30) intent = remaining <= 15 ? '거부' : '희망';
        else if (remaining <= 90) intent = '희망';

        let note = '';
        if (r.name === '김영순') note = '동일 호실 희망';
        else if (r.name === '이복자') note = '가족 상의 중';
        else if (r.name === '한말순') note = '1인실 유지 희망';
        else if (r.name === '정기원') note = '';

        return {
          id: r.id,
          name: r.name,
          room: `${r.building} ${r.roomNumber}호`,
          start: r.moveInDate,
          end: end.toISOString().slice(0, 10),
          remaining,
          intent,
          note,
        };
      })
      .sort((a, b) => a.remaining - b.remaining),
    [residents],
  );

  const [data, setData] = useState<RenewalItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [intentForm, setIntentForm] = useState({ intent: '희망', note: '' });
  const [renewModal, setRenewModal] = useState<string | null>(null);
  const [renewForm, setRenewForm] = useState({ newEnd: '', note: '' });

  const openIntentModal = (item: RenewalItem) => {
    setSelectedId(item.id);
    setIntentForm({ intent: item.intent, note: item.note });
    setShowModal(true);
  };

  const handleIntentSave = () => {
    if (!selectedId) return;
    setData(prev => prev.map(d => d.id === selectedId ? { ...d, intent: intentForm.intent, note: intentForm.note } : d));
    setShowModal(false);
    setSelectedId(null);
  };

  const handleRenew = (id: string) => {
    setRenewModal(id);
    const item = data.find(d => d.id === id);
    setRenewForm({ newEnd: item ? item.end : '', note: '재계약 완료' });
  };

  const handleRenewSave = () => {
    if (!renewModal || !renewForm.newEnd) return;
    const today = new Date('2026-04-01');
    const newEndDate = new Date(renewForm.newEnd);
    const diffMs = newEndDate.getTime() - today.getTime();
    const newRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    setData(prev => prev.map(d =>
      d.id === renewModal
        ? { ...d, end: renewForm.newEnd, remaining: newRemaining, intent: '희망', note: renewForm.note }
        : d
    ));
    setRenewModal(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">재계약대상자조회</h1>
        <p className="mt-1 text-sm text-gray-500">계약 만료 90일 이내 입주자 목록입니다.</p>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{data.filter(d => d.remaining <= 30).length}</div>
          <div className="text-sm text-gray-500 mt-1">30일 이내 만료</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{data.filter(d => d.remaining > 30 && d.remaining <= 90).length}</div>
          <div className="text-sm text-gray-500 mt-1">31~90일 이내</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{data.filter(d => d.intent === '희망').length}</div>
          <div className="text-sm text-gray-500 mt-1">재계약 희망</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['입소자명', '호실', '계약시작일', '계약종료일', '잔여일수', '재계약의향', '비고', ''].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.start}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.end}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-semibold ${r.remaining <= 30 ? 'text-red-600' : r.remaining <= 60 ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {r.remaining}일
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => openIntentModal(r)}>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${intentColor[r.intent] || 'bg-gray-100 text-gray-800'}`}>
                        {r.intent}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.note || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleRenew(r.id)}
                      className="px-3 py-1.5 bg-[#F0835A] text-white text-xs font-medium rounded-md hover:bg-[#d9714d]"
                    >
                      재계약 처리
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 의향 수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">재계약 의향 수정</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">의향</label>
              <select
                value={intentForm.intent}
                onChange={e => setIntentForm({ ...intentForm, intent: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
              >
                <option value="희망">희망</option>
                <option value="미정">미정</option>
                <option value="거부">거부</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
              <input
                type="text"
                value={intentForm.note}
                onChange={e => setIntentForm({ ...intentForm, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleIntentSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* 재계약 처리 모달 */}
      {renewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">재계약 처리</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">새 계약종료일</label>
              <input
                type="date"
                value={renewForm.newEnd}
                onChange={e => setRenewForm({ ...renewForm, newEnd: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
              <input
                type="text"
                value={renewForm.note}
                onChange={e => setRenewForm({ ...renewForm, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRenewModal(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleRenewSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
