import React from 'react';

const days = ['월', '화', '수', '목', '금', '토', '일'];

type Shift = '주간' | '야간' | '휴무';

const shiftColor: Record<Shift, string> = {
  '주간': 'bg-blue-100 text-blue-700 border-blue-200',
  '야간': 'bg-purple-100 text-purple-700 border-purple-200',
  '휴무': 'bg-gray-100 text-gray-400 border-gray-200',
};

interface StaffSchedule {
  name: string;
  role: string;
  shifts: Shift[];
}

const staffSchedules: StaffSchedule[] = [
  { name: '김간호', role: '간호사', shifts: ['주간', '주간', '야간', '휴무', '주간', '주간', '휴무'] },
  { name: '이간호', role: '간호사', shifts: ['야간', '휴무', '주간', '주간', '주간', '휴무', '야간'] },
  { name: '박요양', role: '요양보호사', shifts: ['주간', '주간', '주간', '휴무', '야간', '휴무', '주간'] },
  { name: '최요양', role: '요양보호사', shifts: ['휴무', '주간', '주간', '주간', '주간', '야간', '휴무'] },
  { name: '정요양', role: '요양보호사', shifts: ['주간', '야간', '휴무', '주간', '주간', '주간', '휴무'] },
  { name: '한생활', role: '생활지도사', shifts: ['주간', '주간', '휴무', '주간', '주간', '휴무', '야간'] },
  { name: '송생활', role: '생활지도사', shifts: ['휴무', '주간', '주간', '야간', '휴무', '주간', '주간'] },
  { name: '윤영양', role: '영양사', shifts: ['주간', '주간', '주간', '주간', '주간', '휴무', '휴무'] },
  { name: '임물리', role: '물리치료사', shifts: ['주간', '주간', '주간', '주간', '주간', '휴무', '휴무'] },
  { name: '오사무', role: '사무원', shifts: ['주간', '주간', '주간', '주간', '주간', '휴무', '휴무'] },
];

// 오늘은 월요일(index 0) 기준
const todayIndex = 0;

export default function StaffManagementPage() {
  const todayWorkers = staffSchedules.filter((s) => s.shifts[todayIndex] === '주간');
  const nightWorkers = staffSchedules.filter((s) => s.shifts[todayIndex] === '야간');
  const offWorkers = staffSchedules.filter((s) => s.shifts[todayIndex] === '휴무');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">근무스케줄</h1>
        <p className="mt-1 text-sm text-gray-500">주간 근무 배정표를 확인하고 관리합니다.</p>
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
              {staffSchedules.map((staff, si) => (
                <tr key={si} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{staff.name}</td>
                  <td className="px-4 py-3 text-center text-gray-600 text-xs">{staff.role}</td>
                  {staff.shifts.map((shift, di) => (
                    <td key={di} className={`px-4 py-2 text-center ${di === todayIndex ? 'bg-orange-50/50' : ''}`}>
                      <span className={`inline-block px-2 py-1 text-xs rounded-md font-medium border ${shiftColor[shift]}`}>
                        {shift}
                      </span>
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
