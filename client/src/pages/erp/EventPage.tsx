import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  target: string;
  department: string;
  status: '계획' | '진행중' | '완료';
}

const events: CalendarEvent[] = [
  { id: '1', title: '봄맞이 야외 나들이', date: '2026-03-05', time: '10:00~15:00', location: '배곧 생태공원', target: '전체 입소자', department: '생활지도팀', status: '완료' },
  { id: '2', title: '어르신 생신잔치 (3월)', date: '2026-03-10', time: '14:00~16:00', location: '1층 대강당', target: '3월 생일 어르신', department: '생활지도팀', status: '완료' },
  { id: '3', title: '인플루엔자 예방접종', date: '2026-03-15', time: '09:00~12:00', location: '2층 의무실', target: '전체 입소자', department: '간호팀', status: '완료' },
  { id: '4', title: '치매 예방 특강', date: '2026-03-18', time: '14:00~15:30', location: '3층 프로그램실', target: '인지 프로그램 참여자', department: '간호팀', status: '완료' },
  { id: '5', title: '가족 면회의 날', date: '2026-03-22', time: '10:00~17:00', location: '1층 로비 및 각 호실', target: '전체 입소자 가족', department: '행정팀', status: '진행중' },
  { id: '6', title: '낙상 예방 교육', date: '2026-03-25', time: '10:00~11:00', location: '1층 대강당', target: '전체 직원', department: '간호팀', status: '진행중' },
  { id: '7', title: '4월 프로그램 설명회', date: '2026-03-28', time: '15:00~16:00', location: '3층 프로그램실', target: '전체 입소자', department: '생활지도팀', status: '계획' },
  { id: '8', title: '시설 소방 훈련', date: '2026-03-31', time: '14:00~15:00', location: '전체 시설', target: '전체 직원 및 입소자', department: '행정팀', status: '계획' },
];

const statusColors: Record<string, string> = {
  '계획': 'bg-blue-100 text-blue-800',
  '진행중': 'bg-yellow-100 text-yellow-800',
  '완료': 'bg-green-100 text-green-800',
};

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

export default function EventPage() {
  const [year] = useState(2026);
  const [month] = useState(2); // March = 2 (0-indexed)

  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const getEventsForDay = (day: number) => {
    const dateStr = `2026-03-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const upcoming = events.filter(e => e.status !== '완료');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">월간행사</h1>

      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">2026년 3월</h2>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((d, i) => (
            <div key={d} className={`text-center text-sm font-medium py-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            const dayEvents = day ? getEventsForDay(day) : [];
            return (
              <div
                key={idx}
                className={`min-h-[80px] p-1 border border-gray-100 rounded-lg ${day ? 'bg-white' : 'bg-gray-50'}`}
              >
                {day && (
                  <>
                    <span className={`text-xs font-medium ${idx % 7 === 0 ? 'text-red-500' : idx % 7 === 6 ? 'text-blue-500' : 'text-gray-700'}`}>
                      {day}
                    </span>
                    {dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        className={`mt-1 px-1 py-0.5 rounded text-[10px] truncate font-medium ${
                          ev.status === '완료' ? 'bg-green-100 text-green-700' :
                          ev.status === '진행중' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">예정 행사</h2>
        <div className="space-y-3">
          {upcoming.map(ev => (
            <div key={ev.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-14 h-14 bg-blue-600 text-white rounded-lg flex flex-col items-center justify-center">
                <span className="text-lg font-bold">{ev.date.split('-')[2]}</span>
                <span className="text-[10px]">3월</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{ev.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[ev.status]}`}>
                    {ev.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span>시간: {ev.time}</span>
                  <span>장소: {ev.location}</span>
                  <span>대상: {ev.target}</span>
                  <span>주관: {ev.department}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
