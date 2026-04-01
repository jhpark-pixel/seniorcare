import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateId } from '../../data/mockData';

const statusColor: Record<string, string> = {
  '대기': 'bg-yellow-100 text-yellow-800',
  '완료': 'bg-green-100 text-green-800',
  '취소': 'bg-red-100 text-red-800',
};

const typeColor: Record<string, string> = {
  '전화': 'bg-blue-100 text-blue-700',
  '방문': 'bg-purple-100 text-purple-700',
  '온라인': 'bg-teal-100 text-teal-700',
};

interface CounselingItem {
  id: string;
  date: string;
  name: string;
  phone: string;
  type: string;
  summary: string;
  result: string;
  next: string;
  status: string;
}

const initialData: CounselingItem[] = [
  { id: '1', date: '2026-03-28 10:00', name: '김철수', phone: '010-9876-5432', type: '전화', summary: '어머니(김영순) 입소 관련 비용 및 시설 안내 요청', result: '자료 발송 완료', next: '2026-04-02 14:00', status: '완료' },
  { id: '2', date: '2026-03-28 11:30', name: '이상훈', phone: '010-7654-3210', type: '방문', summary: '어머니(이복자) 1인실 시설 견학 및 케어 프로그램 문의', result: '시설 투어 완료, 청약 안내', next: '2026-04-01 10:00', status: '완료' },
  { id: '3', date: '2026-03-27 14:00', name: '박미선', phone: '010-6543-2109', type: '전화', summary: '아버지(박정호) 관절염 등급 관련 입소 가능 여부 문의', result: '등급 확인 후 회신 예정', next: '2026-03-31 09:00', status: '대기' },
  { id: '4', date: '2026-03-27 16:00', name: '최민호', phone: '010-4321-0987', type: '온라인', summary: '어머니(최순남) 뇌졸중 후 재활 케어 및 비용 문의', result: '이메일 안내 발송', next: '-', status: '완료' },
  { id: '5', date: '2026-03-26 09:30', name: '정수진', phone: '010-3210-9876', type: '방문', summary: '아버지(정기원) 파킨슨병 케어 프로그램 상담', result: '2관 1인실 배정 가능 안내', next: '2026-04-03 11:00', status: '대기' },
  { id: '6', date: '2026-03-25 13:00', name: '한지훈', phone: '010-1111-2222', type: '전화', summary: '할머니(한말순) 중증 치매 케어 가능 여부 문의', result: '장기요양 1등급 전문 케어 안내 발송', next: '-', status: '완료' },
  { id: '7', date: '2026-03-25 15:30', name: '오수빈', phone: '010-3333-4444', type: '온라인', summary: '아버지(오세진) 입소 후 외부 병원 진료 동행 서비스 문의', result: '서비스 내용 안내 완료', next: '-', status: '완료' },
  { id: '8', date: '2026-03-24 10:00', name: '송현우', phone: '010-5555-6666', type: '방문', summary: '어머니(송미경) 심부전 입원 후 시설 복귀 가능 여부 상담', result: '복귀 조건 및 의료 지원 안내', next: '2026-03-30 14:00', status: '대기' },
  { id: '9', date: '2026-03-23 11:00', name: '윤지영', phone: '010-6666-7777', type: '전화', summary: '아버지(윤태식) 입소 대기 신청 및 예상 대기 기간 문의', result: '현재 대기 2명 안내', next: '-', status: '취소' },
  { id: '10', date: '2026-03-22 14:30', name: '강준호', phone: '010-8888-9999', type: '방문', summary: '어머니(강옥희) 시설 식단 및 영양 관리 프로그램 문의', result: '주간 식단표 제공, 영양사 면담 안내', next: '2026-03-29 10:00', status: '완료' },
];

const emptyForm = { date: '', name: '', phone: '', type: '전화', summary: '', result: '' };

const tabs = [
  { id: 'register', label: '상담등록', path: '/resident/counseling/register' },
  { id: 'schedule', label: '일정조회', path: '/resident/counseling/schedule' },
  { id: 'history', label: '상담내역', path: '/resident/counseling/history' },
  { id: 'stats', label: '통계', path: '/resident/counseling/stats' },
];

// Schedule sub-view: upcoming counseling appointments
const scheduleData = [
  { date: '2026-04-01', time: '10:00', name: '이상훈', type: '방문', memo: '청약서 작성 안내' },
  { date: '2026-04-02', time: '14:00', name: '김철수', type: '전화', memo: '비용 재문의' },
  { date: '2026-04-03', time: '11:00', name: '정수진', type: '방문', memo: '파킨슨 케어 추가 상담' },
  { date: '2026-04-04', time: '09:30', name: '박미선', type: '전화', memo: '등급 확인 결과 전달' },
  { date: '2026-04-05', time: '15:00', name: '신규문의', type: '온라인', memo: '온라인 상담 신청 (치매 케어)' },
  { date: '2026-04-07', time: '13:30', name: '송현우', type: '방문', memo: '복귀 의사 최종 확인' },
];

// Stats sub-view: type counts + monthly trend + completion rate
const typeStats = [
  { type: '전화', count: 18, color: 'bg-blue-500' },
  { type: '방문', count: 12, color: 'bg-purple-500' },
  { type: '온라인', count: 8, color: 'bg-teal-500' },
];
const monthlyStats = [
  { month: '2026-01', total: 12, done: 10 },
  { month: '2026-02', total: 15, done: 13 },
  { month: '2026-03', total: 10, done: 7 },
];

export default function CounselingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || 'register';

  const [data, setData] = useState<CounselingItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const filtered = search
    ? data.filter(d => d.name.includes(search) || d.summary.includes(search))
    : data;

  const handleSave = () => {
    if (!formData.name || !formData.date) return;
    const newItem: CounselingItem = {
      id: generateId('counsel'),
      date: formData.date.replace('T', ' '),
      name: formData.name,
      phone: formData.phone,
      type: formData.type,
      summary: formData.summary,
      result: formData.result,
      next: '-',
      status: '대기',
    };
    setData(prev => [newItem, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const changeStatus = (id: string, status: string) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  const recentFive = [...data].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상담관리</h1>
          <p className="mt-1 text-sm text-gray-500">입소 상담 내역을 관리하고 일정을 추적합니다.</p>
        </div>
        {segment === 'register' && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors"
          >
            + 신규 상담등록
          </button>
        )}
      </div>

      {/* 탭 바 */}
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

      {/* 상담등록 탭 */}
      {segment === 'register' && (
        <div className="space-y-6">
          {/* 등록 폼 (인라인 퀵 등록) */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">빠른 상담 등록</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담일시</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담자명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담유형</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="전화">전화</option>
                  <option value="방문">방문</option>
                  <option value="온라인">온라인</option>
                </select>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담내용</label>
                <textarea
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">결과</label>
                <textarea
                  value={formData.result}
                  onChange={e => setFormData({ ...formData, result: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d] font-medium"
              >
                등록
              </button>
            </div>
          </div>

          {/* 최근 등록 목록 */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">최근 등록 (5건)</h2>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">상담일시</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">상담자명</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">유형</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">상담내용</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentFive.map(row => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeColor[row.type]}`}>{row.type}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{row.summary}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status]}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 일정조회 탭 */}
      {segment === 'schedule' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium">다음주 예정된 상담 일정 ({scheduleData.length}건)</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">날짜</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">시간</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">유형</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">메모</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700 font-medium">{row.date}</td>
                      <td className="px-4 py-3 text-gray-700">{row.time}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeColor[row.type] ?? 'bg-gray-100 text-gray-700'}`}>{row.type}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.memo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* 요일별 분포 */}
          <div className="grid grid-cols-7 gap-2">
            {['월', '화', '수', '목', '금', '토', '일'].map((day, i) => {
              const counts = [2, 1, 1, 1, 1, 0, 0];
              return (
                <div key={day} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                  <div className="text-xs text-gray-500 mb-1">{day}</div>
                  <div className={`text-xl font-bold ${counts[i] > 0 ? 'text-[#F0835A]' : 'text-gray-300'}`}>{counts[i]}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 상담내역 탭 */}
      {segment === 'history' && (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="상담자명 또는 내용으로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A] focus:border-transparent"
            />
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담일시</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담자명</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담유형</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담내용</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">결과</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">다음일정</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-gray-700">{row.phone}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeColor[row.type]}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{row.summary}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{row.result}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.next}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          {row.status === '대기' && (
                            <>
                              <button
                                onClick={() => changeStatus(row.id, '완료')}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                완료
                              </button>
                              <button
                                onClick={() => changeStatus(row.id, '취소')}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                취소
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(row.id)}
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
      )}

      {/* 통계 탭 */}
      {segment === 'stats' && (
        <div className="space-y-6">
          {/* 유형별 건수 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">상담유형별 건수</h2>
            <div className="grid grid-cols-3 gap-4">
              {typeStats.map(s => (
                <div key={s.type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900">{s.count}</div>
                  <div className="mt-2 text-sm text-gray-500">{s.type} 상담</div>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div
                      className={`${s.color} h-2 rounded-full`}
                      style={{ width: `${Math.round(s.count / 38 * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 월별 추이 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">월별 상담 추이</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">월</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">총 상담</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">완료</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">완료율</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map(m => {
                    const rate = Math.round(m.done / m.total * 100);
                    return (
                      <tr key={m.month} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{m.month}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{m.total}건</td>
                        <td className="px-4 py-3 text-right text-green-600 font-medium">{m.done}건</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">{rate}%</td>
                        <td className="px-4 py-3">
                          <div className="bg-gray-200 rounded-full h-2 w-32">
                            <div
                              className="bg-[#F0835A] h-2 rounded-full"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 완료율 요약 카드 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">38</div>
              <div className="text-sm text-gray-500 mt-1">총 상담건수</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">30</div>
              <div className="text-sm text-gray-500 mt-1">완료</div>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-[#F0835A]">78.9%</div>
              <div className="text-sm text-gray-500 mt-1">완료율</div>
            </div>
          </div>
        </div>
      )}

      {/* 신규 상담등록 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">신규 상담등록</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담일시</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담자명</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상담유형</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="전화">전화</option>
                  <option value="방문">방문</option>
                  <option value="온라인">온라인</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상담내용</label>
              <textarea
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">결과</label>
              <input
                type="text"
                value={formData.result}
                onChange={e => setFormData({ ...formData, result: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowModal(false); setFormData(emptyForm); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
