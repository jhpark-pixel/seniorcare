import React, { useState } from 'react';

const residents = ['김영순', '이순자', '박정희', '최옥순', '정미숙', '한순이', '서복순', '강말숙', '조순옥', '배영자'];
const reasons = ['자의퇴소', '가족요청', '건강악화', '시설이전', '기타'];

const statusColor: Record<string, string> = {
  '승인대기': 'bg-yellow-100 text-yellow-800',
  '승인완료': 'bg-green-100 text-green-800',
  '반려': 'bg-red-100 text-red-800',
};

const recentApplications = [
  { name: '한순이', room: '2관 302호', reason: '건강악화', date: '2026-04-10', settlement: '보증금 반환 500만원', status: '승인대기', note: '보호자 요청' },
  { name: '서복순', room: '2관 401호', reason: '시설이전', date: '2026-04-05', settlement: '보증금 반환 300만원, 미납금 정산', status: '승인완료', note: '타 지역 이전' },
  { name: '강말숙', room: '1관 105호', reason: '가족요청', date: '2026-03-28', settlement: '보증금 반환 500만원', status: '승인완료', note: '자택 복귀' },
];

export default function DischargePage() {
  const [form, setForm] = useState({ resident: '', reason: '', date: '', settlement: '', note: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`퇴소 신청이 완료되었습니다.\n입소자: ${form.resident}\n사유: ${form.reason}\n예정일: ${form.date}`);
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
            <select name="resident" value={form.resident} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">선택하세요</option>
              {residents.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">퇴소사유</label>
            <select name="reason" value={form.reason} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
              <option value="">선택하세요</option>
              {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">퇴소예정일</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">정산내역</label>
            <input type="text" name="settlement" value={form.settlement} onChange={handleChange} placeholder="예: 보증금 반환 500만원" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={3} placeholder="추가 사항을 입력하세요" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="col-span-2 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
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
                {['입소자명', '호실', '퇴소사유', '퇴소예정일', '정산내역', '상태', '비고'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentApplications.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.settlement}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
