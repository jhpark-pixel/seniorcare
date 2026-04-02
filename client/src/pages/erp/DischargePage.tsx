import React, { useState, useMemo } from 'react';
import { generateId } from '../../data/mockData';
import { useResidents, useCollection } from '../../context/AppStateContext';

const reasons = ['자의퇴소', '가족요청', '건강악화', '시설이전', '기타'];

const statusColor: Record<string, string> = {
  '승인대기': 'bg-yellow-100 text-yellow-800',
  '승인완료': 'bg-green-100 text-green-800',
  '반려': 'bg-red-100 text-red-800',
};

interface DischargeApplication {
  id: string;
  name: string;
  room: string;
  reason: string;
  date: string;
  settlement: string;
  status: '승인대기' | '승인완료' | '반려';
  note: string;
}

// 실제 입주자 기준 최근 퇴소 신청 내역
const initialApplications: DischargeApplication[] = [
  {
    id: '1',
    name: '최순남',
    room: '1관 107호',
    reason: '건강악화',
    date: '2026-04-10',
    settlement: '보증금 반환 3,500만원',
    status: '승인대기',
    note: '보호자 최민호 요청',
  },
  {
    id: '2',
    name: '정기원',
    room: '1관 109호',
    reason: '시설이전',
    date: '2026-04-05',
    settlement: '보증금 반환 3,000만원, 미납금 정산',
    status: '승인완료',
    note: '타 지역 이전',
  },
  {
    id: '3',
    name: '이복자',
    room: '1관 103호',
    reason: '가족요청',
    date: '2026-03-28',
    settlement: '보증금 반환 3,000만원',
    status: '승인완료',
    note: '자택 복귀 예정',
  },
];

export default function DischargePage() {
  const [residents] = useResidents();
  const activeResidents = useMemo(() => residents.filter(r => r.status !== 'DISCHARGED'), [residents]);
  const residentOptions = useMemo(() => activeResidents.map(r => ({
    name: r.name,
    room: `${r.building} ${r.roomNumber}호`,
  })), [activeResidents]);
  const [applications, setApplications] = useCollection<DischargeApplication>('dischargeApplications', initialApplications);
  const [form, setForm] = useState({ resident: '', room: '', reason: '', date: '', settlement: '', note: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'resident') {
      const found = residentOptions.find(r => r.name === value);
      setForm(prev => ({ ...prev, resident: value, room: found ? found.room : '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.resident || !form.reason || !form.date) {
      alert('입소자, 퇴소사유, 퇴소예정일은 필수 입력항목입니다.');
      return;
    }
    const newApp: DischargeApplication = {
      id: generateId('discharge'),
      name: form.resident,
      room: form.room,
      reason: form.reason,
      date: form.date,
      settlement: form.settlement,
      status: '승인대기',
      note: form.note,
    };
    setApplications(prev => [newApp, ...prev]);
    setForm({ resident: '', room: '', reason: '', date: '', settlement: '', note: '' });
  };

  const handleStatusChange = (id: string, newStatus: '승인완료' | '반려') => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleDelete = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">퇴소신청</h1>
        <p className="mt-1 text-sm text-gray-500">입주자 퇴소 신청서를 작성합니다.</p>
      </div>

      {/* 퇴소 신청 폼 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">퇴소 신청서</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">입소자 선택</label>
            <select
              name="resident"
              value={form.resident}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#F0835A] focus:border-[#F0835A]"
            >
              <option value="">선택하세요</option>
              {residentOptions.map((r) => (
                <option key={r.name} value={r.name}>{r.name} ({r.room})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">호실</label>
            <input
              type="text"
              name="room"
              value={form.room}
              readOnly
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">퇴소사유</label>
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#F0835A] focus:border-[#F0835A]"
            >
              <option value="">선택하세요</option>
              {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">퇴소예정일</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#F0835A] focus:border-[#F0835A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">정산내역</label>
            <input
              type="text"
              name="settlement"
              value={form.settlement}
              onChange={handleChange}
              placeholder="예: 보증금 반환 500만원"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#F0835A] focus:border-[#F0835A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="추가 사항을 입력하세요"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#F0835A] focus:border-[#F0835A]"
            />
          </div>
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#F0835A] text-white text-sm font-medium rounded-md hover:bg-[#d9714d] transition-colors"
            >
              퇴소 신청
            </button>
          </div>
        </form>
      </div>

      {/* 최근 퇴소 신청 내역 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 퇴소 신청 내역</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['입소자명', '호실', '퇴소사유', '퇴소예정일', '정산내역', '상태', '비고', '관리'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.settlement}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.note}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex gap-1">
                      {r.status === '승인대기' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(r.id, '승인완료')}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleStatusChange(r.id, '반려')}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            반려
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(r.id)}
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
    </div>
  );
}
