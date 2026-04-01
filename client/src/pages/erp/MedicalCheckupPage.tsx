import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { residents } from '../../data/mockData';

interface Checkup {
  id: string;
  date: string;
  name: string;
  room: string;
  type: string;
  hospital: string;
  doctor: string;
  result: string;
  nextDate: string;
}

const initialData: Checkup[] = [
  { id: '1', date: '2026-03-15', name: '김영순', room: '1관 101호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '혈압 경계, 콜레스테롤 약간 상승. 고혈압/당뇨 관리 식이 조절 권고', nextDate: '2026-06-15' },
  { id: '2', date: '2026-03-18', name: '이복자', room: '1관 103호', type: '정밀', hospital: '시화병원', doctor: '박진수', result: '심부전 안정적. 도네페질 투여 중 치매 진행 모니터링 지속 필요', nextDate: '2026-06-18' },
  { id: '3', date: '2026-03-20', name: '최순남', room: '1관 107호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '뇌졸중 후유증 안정. 클로피도그렐 복용 중 출혈 소견 없음', nextDate: '2026-06-20' },
  { id: '4', date: '2026-03-22', name: '박정호', room: '1관 105호', type: '정형외과', hospital: '정형외과의원', doctor: '김정형', result: '관절염 약간 진행. 골다공증 수치 유지. 알렌드론산 지속 복용 권고', nextDate: '2026-09-22' },
  { id: '5', date: '2026-03-25', name: '오세진', room: '2관 203호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: 'COPD 폐기능 안정. 흡입기 사용 적절. 혈압 양호', nextDate: '2026-06-25' },
  { id: '6', date: '2026-04-01', name: '정기원', room: '1관 109호', type: '정밀', hospital: '시화병원', doctor: '박진수', result: '-', nextDate: '2026-07-01' },
  { id: '7', date: '2026-04-05', name: '한말순', room: '2관 201호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '-', nextDate: '2026-07-05' },
  { id: '8', date: '2026-04-10', name: '윤태식', room: '2관 207호', type: '정밀', hospital: '시화병원', doctor: '박진수', result: '-', nextDate: '2026-07-10' },
  { id: '9', date: '2026-04-15', name: '강옥희', room: '2관 209호', type: '일반', hospital: '배곧서울병원', doctor: '이상훈', result: '-', nextDate: '2026-07-15' },
];

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '일반': 'bg-blue-100 text-blue-700',
    '정밀': 'bg-red-100 text-red-700',
    '치과': 'bg-teal-100 text-teal-700',
    '안과': 'bg-purple-100 text-purple-700',
    '정형외과': 'bg-orange-100 text-orange-700',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

const residentOptions = residents.map(r => r.name);
const emptyForm = { name: residentOptions[0], type: '일반', hospital: '', doctor: '', date: '', result: '' };

const tabs = [
  { id: 'schedule', label: '검진일정 관리', path: '/erp/medical-checkup/schedule' },
  { id: 'result', label: '검진결과 입력', path: '/erp/medical-checkup/result' },
  { id: 'history', label: '검진이력 조회', path: '/erp/medical-checkup/history' },
];

// Month calendar helpers
const CALENDAR_YEAR = 2026;
const CALENDAR_MONTH = 4; // April (1-indexed)

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay(); // 0=Sun
}

export default function MedicalCheckupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [data, setData] = useState<Checkup[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [resultName, setResultName] = useState(residentOptions[0]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyType, setHistoryType] = useState('전체');

  const today = new Date('2026-03-30');
  const upcoming = data.filter(d => new Date(d.date) >= today);
  const past = data.filter(d => new Date(d.date) < today);

  const handleSave = () => {
    if (editId) {
      setData(prev => prev.map(r => r.id === editId ? { ...r, result: formData.result } : r));
    } else {
      const resident = residents.find(r => r.name === formData.name);
      const newRecord: Checkup = {
        id: crypto.randomUUID(),
        date: formData.date,
        name: formData.name,
        room: resident ? `${resident.building} ${resident.roomNumber}호` : '',
        type: formData.type,
        hospital: formData.hospital,
        doctor: formData.doctor,
        result: formData.result || '-',
        nextDate: '',
      };
      setData(prev => [...prev, newRecord]);
    }
    setFormData(emptyForm);
    setEditId(null);
    setShowModal(false);
  };

  const openEdit = (item: Checkup) => {
    setEditId(item.id);
    setFormData({ name: item.name, type: item.type, hospital: item.hospital, doctor: item.doctor, date: item.date, result: item.result === '-' ? '' : item.result });
    setShowModal(true);
  };

  const openNew = () => {
    setEditId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // Calendar data for April 2026
  const daysInMonth = getDaysInMonth(CALENDAR_YEAR, CALENDAR_MONTH);
  const firstDow = getFirstDayOfWeek(CALENDAR_YEAR, CALENDAR_MONTH);
  const aprilCheckups = data.filter(d => d.date.startsWith('2026-04'));
  const checkupByDate: Record<string, Checkup[]> = {};
  aprilCheckups.forEach(c => {
    const day = parseInt(c.date.slice(8, 10), 10).toString();
    if (!checkupByDate[day]) checkupByDate[day] = [];
    checkupByDate[day].push(c);
  });

  // Result input: filtered by selected resident
  const residentCheckups = data.filter(d => d.name === resultName && d.result === '-');

  // History filtering
  const historyData = data.filter(d => {
    const matchName = historySearch ? d.name.includes(historySearch) : true;
    const matchType = historyType === '전체' ? true : d.type === historyType;
    return matchName && matchType;
  }).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">정기검진</h1>
        <button onClick={openNew} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 검진 등록
        </button>
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

      {/* SCHEDULE TAB */}
      {segment === 'schedule' && (
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{upcoming.length}</div>
              <div className="text-xs text-gray-500 mt-1">예정 검진</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{past.length}</div>
              <div className="text-xs text-gray-500 mt-1">완료 검진</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{data.length}</div>
              <div className="text-xs text-gray-500 mt-1">전체 검진</div>
            </div>
          </div>

          {/* April 2026 Calendar */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">2026년 4월 검진 캘린더</h3>
              <span className="text-xs text-gray-500">예정된 검진 {aprilCheckups.length}건</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 mb-1">
                {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                  <div key={d} className={`text-center text-xs font-semibold py-1 ${d === '일' ? 'text-red-500' : d === '토' ? 'text-blue-500' : 'text-gray-500'}`}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDow }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = (i + 1).toString();
                  const dayCheckups = checkupByDate[day] || [];
                  const dow = (firstDow + i) % 7;
                  return (
                    <div key={day} className={`min-h-[64px] rounded-lg border p-1 ${dayCheckups.length > 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className={`text-xs font-semibold mb-0.5 ${dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-gray-600'}`}>{i + 1}</div>
                      <div className="space-y-0.5">
                        {dayCheckups.map(c => (
                          <div key={c.id} className={`text-[10px] px-1 rounded truncate ${typeBadge(c.type)}`}>{c.name}</div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming list */}
          {upcoming.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">예정된 검진 ({upcoming.length}건)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {upcoming.map(item => (
                  <div key={item.id} className="bg-white rounded-lg border border-blue-100 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(item.type)}`}>{item.type}</span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <div>{item.date} | {item.room}</div>
                      <div>{item.hospital} - {item.doctor} 의사</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESULT TAB */}
      {segment === 'result' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">입주자별 검진결과 입력</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">입주자 선택</label>
              <select
                value={resultName}
                onChange={e => setResultName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
              >
                {residentOptions.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {residentCheckups.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400 bg-gray-50 rounded-lg">
                {resultName}님의 결과 미입력 검진이 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {residentCheckups.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-semibold text-gray-800">{item.date}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(item.type)}`}>{item.type}</span>
                        <span className="ml-2 text-sm text-gray-500">{item.hospital} · {item.doctor} 의사</span>
                      </div>
                      <span className="text-xs text-orange-500 font-medium">결과 미입력</span>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">검진 결과 요약</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="검진 결과를 입력하세요..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                setData(prev => prev.map(r => r.id === item.id ? { ...r, result: val } : r));
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                            const val = input?.value.trim();
                            if (val) {
                              setData(prev => prev.map(r => r.id === item.id ? { ...r, result: val } : r));
                              if (input) input.value = '';
                            }
                          }}
                          className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d] whitespace-nowrap"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All records for this resident */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800">{resultName}님 전체 검진 기록</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진유형</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">병원명</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">담당의</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">결과요약</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">다음검진일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {data.filter(d => d.name === resultName).sort((a, b) => b.date.localeCompare(a.date)).map(row => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                        {row.date}
                        {new Date(row.date) >= today && <span className="ml-1 text-[10px] text-blue-600 font-medium">예정</span>}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">{row.hospital}</td>
                      <td className="px-4 py-2.5 text-gray-600">{row.doctor}</td>
                      <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">
                        {row.result === '-' ? <span className="text-orange-400 text-xs">미입력</span> : row.result}
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">{row.nextDate || '-'}</td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => openEdit(row)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">결과수정</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {segment === 'history' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border p-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">입소자명 검색</label>
                <input
                  type="text"
                  placeholder="이름 입력..."
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A] w-36"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">검진유형</label>
                <select
                  value={historyType}
                  onChange={e => setHistoryType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option>전체</option>
                  <option>일반</option>
                  <option>정밀</option>
                  <option>치과</option>
                  <option>안과</option>
                  <option>정형외과</option>
                </select>
              </div>
              <div className="text-sm text-gray-500 self-center pt-4">
                총 <span className="font-semibold text-gray-800">{historyData.length}</span>건
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800">검진 전체 이력</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진유형</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">병원명</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">담당의</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">결과요약</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">다음검진일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((row) => {
                    const isPast = new Date(row.date) < today;
                    return (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                          {row.date}
                          {!isPast && <span className="ml-1 text-[10px] text-blue-600 font-medium">예정</span>}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                        <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">{row.hospital}</td>
                        <td className="px-4 py-2.5 text-gray-600">{row.doctor}</td>
                        <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">
                          {row.result === '-' ? <span className="text-orange-400 text-xs">미입력</span> : row.result}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">{row.nextDate || '-'}</td>
                        <td className="px-4 py-2.5">
                          <button onClick={() => openEdit(row)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">결과수정</button>
                        </td>
                      </tr>
                    );
                  })}
                  {historyData.length === 0 && (
                    <tr><td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-400">조건에 맞는 검진 이력이 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fallback */}
      {segment !== 'schedule' && segment !== 'result' && segment !== 'history' && (
        <div className="space-y-4">
          {upcoming.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">예정된 검진</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {upcoming.map(item => (
                  <div key={item.id} className="bg-white rounded-lg border border-blue-100 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(item.type)}`}>{item.type}</span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <div>{item.date} | {item.room}</div>
                      <div>{item.hospital} - {item.doctor} 의사</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800">검진 이력</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">검진유형</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">병원명</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">담당의</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">결과요약</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">다음검진일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {[...past, ...upcoming].map((row) => {
                    const isPast = new Date(row.date) < today;
                    return (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                          {row.date}
                          {!isPast && <span className="ml-1 text-[10px] text-blue-600 font-medium">예정</span>}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                        <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">{row.hospital}</td>
                        <td className="px-4 py-2.5 text-gray-600">{row.doctor}</td>
                        <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.result || '-'}</td>
                        <td className="px-4 py-2.5 text-gray-600">{row.nextDate}</td>
                        <td className="px-4 py-2.5">
                          <button onClick={() => openEdit(row)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">결과수정</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editId ? '결과 수정' : '검진 등록'}</h2>
            <div className="space-y-3">
              {!editId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                    <select value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      {residentOptions.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">검진유형</label>
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>일반</option>
                      <option>정밀</option>
                      <option>치과</option>
                      <option>안과</option>
                      <option>정형외과</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">병원명</label>
                    <input type="text" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">담당의</label>
                    <input type="text" value={formData.doctor} onChange={e => setFormData({ ...formData, doctor: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">검진일</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">결과요약</label>
                <textarea value={formData.result} onChange={e => setFormData({ ...formData, result: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowModal(false); setEditId(null); setFormData(emptyForm); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
