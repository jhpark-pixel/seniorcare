import React, { useState } from 'react';
import { staff } from '../../data/mockData';

const days = ['월', '화', '수', '목', '금', '토', '일'];

type Shift = '주간' | '야간' | '휴무';

const shiftColor: Record<Shift, string> = {
  '주간': 'bg-blue-100 text-blue-700 border-blue-200',
  '야간': 'bg-purple-100 text-purple-700 border-purple-200',
  '휴무': 'bg-gray-100 text-gray-400 border-gray-200',
};

interface StaffSchedule {
  id: string;
  name: string;
  role: string;
  shifts: Shift[];
}

// Build schedule from real staff, with realistic shift patterns
const staffSchedules: StaffSchedule[] = [
  { id: staff[0].id, name: staff[0].name, role: staff[0].roleLabel, shifts: ['주간', '주간', '주간', '주간', '주간', '휴무', '휴무'] },
  { id: staff[1].id, name: staff[1].name, role: staff[1].roleLabel, shifts: ['주간', '주간', '야간', '휴무', '주간', '주간', '휴무'] },
  { id: staff[2].id, name: staff[2].name, role: staff[2].roleLabel, shifts: ['야간', '휴무', '주간', '주간', '주간', '휴무', '야간'] },
  { id: staff[3].id, name: staff[3].name, role: staff[3].roleLabel, shifts: ['주간', '주간', '휴무', '주간', '주간', '휴무', '야간'] },
  { id: staff[4].id, name: staff[4].name, role: staff[4].roleLabel, shifts: ['휴무', '주간', '주간', '야간', '휴무', '주간', '주간'] },
];

// 오늘은 월요일(index 0) 기준
const todayIndex = 0;

export default function StaffManagementPage() {
  const [schedules, setSchedules] = useState<StaffSchedule[]>(staffSchedules);

  const todayWorkers = schedules.filter((s) => s.shifts[todayIndex] === '주간');
  const nightWorkers = schedules.filter((s) => s.shifts[todayIndex] === '야간');
  const offWorkers = schedules.filter((s) => s.shifts[todayIndex] === '휴무');

  const cycleShift = (staffId: string, dayIdx: number) => {
    const order: Shift[] = ['주간', '야간', '휴무'];
    setSchedules(prev => prev.map(s => {
      if (s.id !== staffId) return s;
      const cur = s.shifts[dayIdx];
      const next = order[(order.indexOf(cur) + 1) % order.length];
      const newShifts = [...s.shifts] as Shift[];
      newShifts[dayIdx] = next;
      return { ...s, shifts: newShifts };
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">근무스케줄</h1>
        <p className="mt-1 text-sm text-gray-500">주간 근무 배정표를 확인하고 관리합니다. 셀을 클릭하면 근무 상태가 변경됩니다.</p>
      </div>

      {/* 오늘 요약 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">☀️</span>
            <span className="text-sm font-semibold text-blue-800">오늘 주간근무</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 mb-1">{todayWorkers.length}명</div>
          <div className="text-xs text-blue-600">{todayWorkers.map((w) => w.name).join(', ')}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🌙</span>
            <span className="text-sm font-semibold text-purple-800">오늘 야간근무</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 mb-1">{nightWorkers.length}명</div>
          <div className="text-xs text-purple-600">{nightWorkers.map((w) => w.name).join(', ')}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏖️</span>
            <span className="text-sm font-semibold text-gray-700">오늘 휴무</span>
          </div>
          <div className="text-2xl font-bold text-gray-600 mb-1">{offWorkers.length}명</div>
          <div className="text-xs text-gray-500">{offWorkers.map((w) => w.name).join(', ')}</div>
        </div>
      </div>

      {/* 직원 정보 카드 */}
      <div className="grid grid-cols-5 gap-3">
        {staff.map(s => (
          <div key={s.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">{s.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.roleLabel}</div>
            <div className="text-xs text-gray-400 mt-1 truncate">{s.email}</div>
            <div className="text-xs text-gray-400">{s.phone}</div>
          </div>
        ))}
      </div>

      {/* 주간 스케줄 그리드 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">2026년 3월 4주차 (03.30 ~ 04.05)</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-200 border border-blue-300" /> 주간</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-200 border border-purple-300" /> 야간</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 border border-gray-300" /> 휴무</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600 min-w-[120px]">직원</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600 min-w-[80px]">직급</th>
                {days.map((d, i) => (
                  <th key={d} className={`px-4 py-3 text-center font-semibold min-w-[70px] ${i === todayIndex ? 'text-[#F0835A] bg-orange-50' : 'text-gray-600'}`}>
                    {d}
                    {i === todayIndex && <div className="text-[10px] font-normal">오늘</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-center text-gray-600 text-xs">{s.role}</td>
                  {s.shifts.map((shift, di) => (
                    <td key={di} className={`px-4 py-2 text-center ${di === todayIndex ? 'bg-orange-50/50' : ''}`}>
                      <button
                        onClick={() => cycleShift(s.id, di)}
                        className={`inline-block px-2 py-1 text-xs rounded-md font-medium border transition-colors hover:opacity-80 ${shiftColor[shift]}`}
                        title="클릭하여 변경"
                      >
                        {shift}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
