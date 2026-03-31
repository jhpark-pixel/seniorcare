import React, { useState } from 'react';

interface LeaveRecord {
  id: string;
  applyDate: string;
  name: string;
  room: string;
  reason: string;
  startDate: string;
  endDate: string;
  guardian: string;
  guardianPhone: string;
  status: '신청' | '승인' | '복귀';
}

const statusColor: Record<string, string> = {
  '신청': 'bg-blue-100 text-blue-800',
  '승인': 'bg-green-100 text-green-800',
  '복귀': 'bg-gray-100 text-gray-800',
};

const initialData: LeaveRecord[] = [
  { id: '1', applyDate: '2026-03-28', name: '김영순', room: '1관 301호', reason: '딸 결혼식 참석', startDate: '2026-04-05', endDate: '2026-04-12', guardian: '김미정 (딸)', guardianPhone: '010-3456-7890', status: '승인' },
  { id: '2', applyDate: '2026-03-26', name: '이순자', room: '2관 205호', reason: '외부 병원 정밀검사 및 회복', startDate: '2026-04-01', endDate: '2026-04-07', guardian: '이재호 (아들)', guardianPhone: '010-9876-5432', status: '승인' },
  { id: '3', applyDate: '2026-03-25', name: '최옥순', room: '2관 103호', reason: '추석 명절 가족 방문', startDate: '2026-04-10', endDate: '2026-04-15', guardian: '최영수 (아들)', guardianPhone: '010-5555-1234', status: '신청' },
  { id: '4', applyDate: '2026-03-20', name: '정미숙', room: '1관 201호', reason: '손녀 돌잔치 참석', startDate: '2026-03-22', endDate: '2026-03-24', guardian: '정하늘 (딸)', guardianPhone: '010-2222-3333', status: '복귀' },
  { id: '5', applyDate: '2026-03-15', name: '한순이', room: '2관 302호', reason: '자택 방문 (리모델링 확인)', startDate: '2026-03-18', endDate: '2026-03-20', guardian: '한민수 (아들)', guardianPhone: '010-7777-8888', status: '복귀' },
];

const emptyForm = { name: '', room: '', reason: '', startDate: '', endDate: '', guardian: '', guardianPhone: '' };

export default function LeavePage() {
  const [data, setData] = useState<LeaveRecord[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const handleSave = () => {
    const newRecord: LeaveRecord = {
      id: crypto.randomUUID(),
      applyDate: new Date().toISOString().slice(0, 10),
      name: formData.name,
      room: formData.room,
      reason: formData.reason,
      startDate: formData.startDate,
      endDate: formData.endDate,
      guardian: formData.guardian,
      guardianPhone: formData.guardianPhone,
      status: '신청',
    };
    setData(prev => [newRecord, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const handleStatusChange = (id: string, newStatus: '승인' | '복귀') => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">장기외출</h1>
          <p className="mt-1 text-sm text-gray-500">입소자 장기외출 신청 및 복귀 현황을 관리합니다.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
          + 외출 신청
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">신청일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">외출사유</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">외출시작일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">외출종료일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">보호자</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{row.applyDate}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.room}</td>
                  <td className="px-4 py-3 text-gray-700">{row.reason}</td>
                  <td className="px-4 py-3 text-gray-700">{row.startDate}</td>
                  <td className="px-4 py-3 text-gray-700">{row.endDate}</td>
                  <td className="px-4 py-3 text-gray-700">{row.guardian}</td>
                  <td className="px-4 py-3 text-gray-700">{row.guardianPhone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {row.status === '신청' && (
                        <button onClick={() => handleStatusChange(row.id, '승인')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">승인</button>
                      )}
                      {row.status === '승인' && (
                        <button onClick={() => handleStatusChange(row.id, '복귀')} className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">복귀</button>
                      )}
                    </div>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">외출 신청</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">호실</label>
                <input type="text" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">외출사유</label>
                <input type="text" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">외출시작일</label>
                  <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">외출종료일</label>
                  <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">보호자</label>
                <input type="text" value={formData.guardian} onChange={e => setFormData({ ...formData, guardian: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input type="text" value={formData.guardianPhone} onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
