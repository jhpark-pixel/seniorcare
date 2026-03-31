import React from 'react';

interface ProgramSlot {
  id: string;
  name: string;
  day: number; // 0=월 ~ 4=금
  startHour: number;
  endHour: number;
  location: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  category: '건강재활' | '운동' | '인지' | '문화' | '사회';
}

const programs: ProgramSlot[] = [
  { id: '1', name: '물리치료 (상체)', day: 0, startHour: 9, endHour: 10, location: '1층 재활치료실', instructor: '정물리치료사', capacity: 8, enrolled: 7, category: '건강재활' },
  { id: '2', name: '아침 체조', day: 0, startHour: 10, endHour: 11, location: '1층 대강당', instructor: '박생활지도사', capacity: 30, enrolled: 25, category: '운동' },
  { id: '3', name: '인지훈련 (초급)', day: 1, startHour: 10, endHour: 11, location: '3층 프로그램실', instructor: '최작업치료사', capacity: 10, enrolled: 9, category: '인지' },
  { id: '4', name: '노래교실', day: 1, startHour: 14, endHour: 15, location: '1층 대강당', instructor: '김음악치료사', capacity: 25, enrolled: 22, category: '문화' },
  { id: '5', name: '물리치료 (하체)', day: 2, startHour: 9, endHour: 10, location: '1층 재활치료실', instructor: '정물리치료사', capacity: 8, enrolled: 8, category: '건강재활' },
  { id: '6', name: '미술치료', day: 2, startHour: 14, endHour: 16, location: '3층 프로그램실', instructor: '이미술치료사', capacity: 12, enrolled: 10, category: '문화' },
  { id: '7', name: '치매예방 두뇌활동', day: 3, startHour: 10, endHour: 11, location: '3층 프로그램실', instructor: '최작업치료사', capacity: 10, enrolled: 8, category: '인지' },
  { id: '8', name: '원예활동', day: 3, startHour: 14, endHour: 15, location: '옥상 정원', instructor: '박생활지도사', capacity: 15, enrolled: 12, category: '사회' },
  { id: '9', name: '아침 체조', day: 4, startHour: 10, endHour: 11, location: '1층 대강당', instructor: '박생활지도사', capacity: 30, enrolled: 23, category: '운동' },
  { id: '10', name: '영화 감상', day: 4, startHour: 14, endHour: 16, location: '1층 대강당', instructor: '최생활지도사', capacity: 30, enrolled: 28, category: '문화' },
];

const dayNames = ['월', '화', '수', '목', '금'];
const hours = [9, 10, 11, 12, 13, 14, 15, 16];

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  '건강재활': { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800' },
  '운동': { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800' },
  '인지': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' },
  '문화': { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800' },
  '사회': { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800' },
};

function getProgram(day: number, hour: number): ProgramSlot | undefined {
  return programs.find(p => p.day === day && p.startHour === hour);
}

function isOccupied(day: number, hour: number): boolean {
  return programs.some(p => p.day === day && hour > p.startHour && hour < p.endHour);
}

function getRowSpan(p: ProgramSlot): number {
  return p.endHour - p.startHour;
}

export default function ProgramCalendarPage() {
  // Build a set of cells to skip (occupied by multi-hour programs)
  const skipCells = new Set<string>();
  programs.forEach(p => {
    for (let h = p.startHour + 1; h < p.endHour; h++) {
      skipCells.add(`${p.day}-${h}`);
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">프로그램 일정표</h1>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(categoryColors).map(([cat, colors]) => (
          <div key={cat} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${colors.bg} ${colors.border}`}>
            <span className={`text-xs font-medium ${colors.text}`}>{cat}</span>
          </div>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-3 text-sm font-medium text-gray-600 w-20">시간</th>
                {dayNames.map(d => (
                  <th key={d} className="border border-gray-200 px-3 py-3 text-sm font-medium text-gray-600">{d}요일</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour}>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-gray-500 text-center bg-gray-50 font-medium">
                    {String(hour).padStart(2, '0')}:00
                  </td>
                  {dayNames.map((_, dayIdx) => {
                    const cellKey = `${dayIdx}-${hour}`;
                    if (skipCells.has(cellKey)) return null;

                    const prog = getProgram(dayIdx, hour);
                    if (prog) {
                      const colors = categoryColors[prog.category];
                      const span = getRowSpan(prog);
                      return (
                        <td
                          key={cellKey}
                          rowSpan={span}
                          className={`border border-gray-200 p-2 ${colors.bg} align-top`}
                        >
                          <div className={`rounded-lg border p-2 ${colors.border}`}>
                            <p className={`text-sm font-semibold ${colors.text}`}>{prog.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{prog.location}</p>
                            <p className="text-xs text-gray-500">강사: {prog.instructor}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`text-xs font-medium ${prog.enrolled >= prog.capacity ? 'text-red-600' : colors.text}`}>
                                {prog.enrolled}/{prog.capacity}명
                              </span>
                              {prog.enrolled >= prog.capacity && (
                                <span className="px-1 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded">마감</span>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={cellKey} className="border border-gray-200 p-2 h-16"></td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Summary List */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">프로그램 목록</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {programs.map(prog => {
            const colors = categoryColors[prog.category];
            return (
              <div key={prog.id} className={`flex items-start gap-3 p-3 rounded-lg border ${colors.bg} ${colors.border}`}>
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">{dayNames[prog.day]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${colors.text}`}>{prog.name}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${colors.text} bg-white/60`}>{prog.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dayNames[prog.day]}요일 {String(prog.startHour).padStart(2, '0')}:00~{String(prog.endHour).padStart(2, '0')}:00 | {prog.location} | {prog.instructor}
                  </p>
                  <p className="text-xs text-gray-500">참여: {prog.enrolled}/{prog.capacity}명</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
