import React, { useState } from 'react';

const programs = [
  { id: 1, name: '치매예방 인지훈련' },
  { id: 2, name: '실버 요가교실' },
  { id: 3, name: '음악치료 프로그램' },
  { id: 4, name: '미술공예 활동' },
  { id: 5, name: '원예치료' },
];

const initialMembers = [
  { name: '김영순', room: '1관 301호', enrolled: true, attended: true },
  { name: '이순자', room: '2관 205호', enrolled: true, attended: true },
  { name: '박정희', room: '1관 402호', enrolled: true, attended: false },
  { name: '최옥순', room: '2관 103호', enrolled: true, attended: true },
  { name: '정미숙', room: '1관 201호', enrolled: true, attended: true },
  { name: '한순이', room: '2관 302호', enrolled: true, attended: false },
  { name: '조순옥', room: '1관 203호', enrolled: true, attended: true },
  { name: '배영자', room: '2관 104호', enrolled: true, attended: false },
];

export default function ProgramAttendancePage() {
  const [selectedProgram, setSelectedProgram] = useState(programs[0].id);
  const [date, setDate] = useState('2026-03-30');
  const [members, setMembers] = useState(initialMembers.map((m) => ({ ...m })));

  const toggleAttendance = (index: number) => {
    setMembers((prev) => prev.map((m, i) => i === index ? { ...m, attended: !m.attended } : m));
  };

  const attendedCount = members.filter((m) => m.attended).length;
  const totalCount = members.length;
  const rate = totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">참여자 관리 및 출석</h1>
        <p className="mt-1 text-sm text-gray-500">프로그램별 참여자 출석을 관리합니다.</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">프로그램 선택</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">날짜 선택</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="ml-auto flex items-end gap-4">
          <div className="bg-blue-50 rounded-lg px-5 py-3 text-center">
            <div className="text-xs text-gray-500">출석률</div>
            <div className={`text-2xl font-bold ${rate >= 80 ? 'text-green-600' : rate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{rate}%</div>
          </div>
          <div className="bg-blue-50 rounded-lg px-5 py-3 text-center">
            <div className="text-xs text-gray-500">출석/등록</div>
            <div className="text-2xl font-bold text-gray-900">{attendedCount}/{totalCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['이름', '호실', '등록상태', '출석'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{m.room}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">등록</span>
                  </td>
                  <td className="px-6 py-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={m.attended}
                        onChange={() => toggleAttendance(i)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={`text-sm ${m.attended ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                        {m.attended ? '출석' : '결석'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => alert('출석 현황이 저장되었습니다.')}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          출석 저장
        </button>
      </div>
    </div>
  );
}
