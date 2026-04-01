import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { staff, generateId } from '../../data/mockData';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  target: string;
  department: string;
  status: '계획' | '진행중' | '완료';
}

const initialEvents: CalendarEvent[] = [
  { id: '1', title: '봄맞이 야외 나들이', description: '', date: '2026-04-05', time: '10:00~15:00', location: '배곧 생태공원', target: '전체 입소자', department: '생활지도팀', status: '계획' },
  { id: '2', title: '어르신 생신잔치 (4월)', description: '', date: '2026-04-10', time: '14:00~16:00', location: '1층 대강당', target: '4월 생일 어르신', department: '생활지도팀', status: '계획' },
  { id: '3', title: '인플루엔자 예방접종', description: '', date: '2026-04-05', time: '09:00~12:00', location: '2층 의무실', target: '전체 입소자', department: '간호팀', status: '계획' },
  { id: '4', title: '치매 예방 특강', description: '', date: '2026-04-08', time: '14:00~15:30', location: '3층 프로그램실', target: '인지 프로그램 참여자', department: '간호팀', status: '계획' },
  { id: '5', title: '가족 면회의 날', description: '', date: '2026-04-12', time: '10:00~17:00', location: '1층 로비 및 각 호실', target: '전체 입소자 가족', department: '행정팀', status: '계획' },
  { id: '6', title: '낙상 예방 교육', description: '', date: '2026-04-15', time: '10:00~11:00', location: '1층 대강당', target: '전체 직원', department: '간호팀', status: '계획' },
  { id: '7', title: '4월 프로그램 설명회', description: '', date: '2026-04-03', time: '15:00~16:00', location: '3층 프로그램실', target: '전체 입소자', department: '생활지도팀', status: '진행중' },
  { id: '8', title: '시설 소방 훈련', description: '', date: '2026-04-20', time: '14:00~15:00', location: '전체 시설', target: '전체 직원 및 입소자', department: '행정팀', status: '계획' },
];

const statusColors: Record<string, string> = {
  '계획': 'bg-blue-100 text-blue-800',
  '진행중': 'bg-yellow-100 text-yellow-800',
  '완료': 'bg-green-100 text-green-800',
};

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

const departmentOptions = ['생활지도팀', '간호팀', '행정팀', '영양팀', '시설관리팀'];

const emptyForm = { title: '', description: '', date: '', time: '', location: '', target: '', department: '' };

const tabs = [
  { id: 'register', label: '행사 계획 등록', path: '/community/event/register' },
  { id: 'status', label: '행사 계획 현황', path: '/community/event/status' },
];

export default function EventPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3); // April = index 3
  const [formData, setFormData] = useState(emptyForm);

  const totalDays = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const monthStr = String(month + 1).padStart(2, '0');

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${monthStr}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const upcoming = events.filter(e => e.status !== '완료');

  const handleSave = () => {
    if (!formData.title || !formData.date) return;
    const newEvent: CalendarEvent = {
      id: generateId('ev'),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      target: formData.target,
      department: formData.department,
      status: '계획',
    };
    setEvents(prev => [...prev, newEvent]);
    setFormData(emptyForm);
    navigate('/community/event/status');
  };

  const handleStatusChange = (id: string, newStatus: CalendarEvent['status']) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const nextStatus = (current: CalendarEvent['status']): CalendarEvent['status'] | null => {
    if (current === '계획') return '진행중';
    if (current === '진행중') return '완료';
    return null;
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">월간행사</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* register: 행사 계획 등록 폼 */}
      {segment === 'register' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">행사 계획 등록</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">행사명</label>
              <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="행사 제목을 입력하세요..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="행사 설명을 입력하세요..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">일시</label>
                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                <input type="text" placeholder="10:00~15:00" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="행사 장소를 입력하세요..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">대상</label>
                <input type="text" value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} placeholder="참여 대상을 입력하세요..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주관부서</label>
              <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]">
                <option value="">-- 선택 --</option>
                {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { setFormData(emptyForm); navigate('/community/event/status'); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave} className="px-6 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d] font-medium">등록</button>
            </div>
          </div>
        </div>
      )}

      {/* status: 행사 계획 현황 — 월별 캘린더 + 예정/진행 목록 */}
      {segment === 'status' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{events.filter(e => e.status === '계획').length}</div>
              <div className="text-xs text-gray-500 mt-1">계획</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{events.filter(e => e.status === '진행중').length}</div>
              <div className="text-xs text-gray-500 mt-1">진행중</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{events.filter(e => e.status === '완료').length}</div>
              <div className="text-xs text-gray-500 mt-1">완료</div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">이전</button>
              <h2 className="text-lg font-semibold text-gray-900">{year}년 {month + 1}월</h2>
              <button onClick={nextMonth} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">다음</button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map((d, i) => (
                <div key={d} className={`text-center text-sm font-medium py-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, idx) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                return (
                  <div key={idx} className={`min-h-[80px] p-1 border border-gray-100 rounded-lg ${day ? 'bg-white' : 'bg-gray-50'}`}>
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

          {/* Upcoming list */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">예정/진행 행사 목록</h2>
            <div className="space-y-3">
              {upcoming.map(ev => {
                const next = nextStatus(ev.status);
                const evMonth = new Date(ev.date).getMonth() + 1;
                return (
                  <div key={ev.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-600 text-white rounded-lg flex flex-col items-center justify-center">
                      <span className="text-lg font-bold">{ev.date.split('-')[2]}</span>
                      <span className="text-[10px]">{evMonth}월</span>
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
                    <div className="flex gap-1">
                      {next && (
                        <button onClick={() => handleStatusChange(ev.id, next)} className="flex-shrink-0 px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium">
                          {next}으로 변경
                        </button>
                      )}
                      <button onClick={() => handleDelete(ev.id)} className="flex-shrink-0 px-2 py-1.5 text-xs bg-gray-400 text-white rounded hover:bg-gray-500">
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })}
              {upcoming.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-6">예정된 행사가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
