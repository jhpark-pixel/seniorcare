import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { residents, generateId, daysAgo } from '../../data/mockData';

interface ComplaintItem {
  id: string;
  date: string;
  complainant: string;
  phone: string;
  type: string;
  content: string;
  processStatus: string;
  processDate: string;
  satisfaction: number | null;
}

// Use actual emergency contacts from residents
const initialData: ComplaintItem[] = [
  {
    id: '1', date: daysAgo(1),
    complainant: `${residents[0].emergencyContact.name} (${residents[0].name} ${residents[0].emergencyContact.relationship})`,
    phone: residents[0].emergencyContact.phone,
    type: '서비스', content: '야간 순회 시 소음이 크다는 불만', processStatus: '접수', processDate: '-', satisfaction: null,
  },
  {
    id: '2', date: daysAgo(2),
    complainant: `${residents[1].emergencyContact.name} (${residents[1].name} ${residents[1].emergencyContact.relationship})`,
    phone: residents[1].emergencyContact.phone,
    type: '식사', content: '저녁 식사 연하식 메뉴가 단조롭다는 의견', processStatus: '처리중', processDate: '-', satisfaction: null,
  },
  {
    id: '3', date: daysAgo(3),
    complainant: `${residents[2].emergencyContact.name} (${residents[2].name} ${residents[2].emergencyContact.relationship})`,
    phone: residents[2].emergencyContact.phone,
    type: '시설', content: '2층 복도 조명이 어두워 위험하다는 지적', processStatus: '완료', processDate: daysAgo(2), satisfaction: 4,
  },
  {
    id: '4', date: daysAgo(4),
    complainant: `${residents[3].emergencyContact.name} (${residents[3].name} ${residents[3].emergencyContact.relationship})`,
    phone: residents[3].emergencyContact.phone,
    type: '서비스', content: '세탁물 분실 건 확인 요청', processStatus: '완료', processDate: daysAgo(3), satisfaction: 3,
  },
  {
    id: '5', date: daysAgo(6),
    complainant: `${residents[4].emergencyContact.name} (${residents[4].name} ${residents[4].emergencyContact.relationship})`,
    phone: residents[4].emergencyContact.phone,
    type: '기타', content: '면회 시간 연장 요청', processStatus: '완료', processDate: daysAgo(5), satisfaction: 5,
  },
  {
    id: '6', date: daysAgo(8),
    complainant: `${residents[5].emergencyContact.name} (${residents[5].name} ${residents[5].emergencyContact.relationship})`,
    phone: residents[5].emergencyContact.phone,
    type: '식사', content: '연하식(미음) 온도 관련 개선 요청', processStatus: '완료', processDate: daysAgo(6), satisfaction: 4,
  },
  {
    id: '7', date: daysAgo(11),
    complainant: `${residents[6].emergencyContact.name} (${residents[6].name} ${residents[6].emergencyContact.relationship})`,
    phone: residents[6].emergencyContact.phone,
    type: '시설', content: '화장실 온수 온도 불안정 신고', processStatus: '완료', processDate: daysAgo(10), satisfaction: 5,
  },
  {
    id: '8', date: daysAgo(13),
    complainant: `${residents[7].emergencyContact.name} (${residents[7].name} ${residents[7].emergencyContact.relationship})`,
    phone: residents[7].emergencyContact.phone,
    type: '서비스', content: '입원 중 시설 연락 미흡 건', processStatus: '완료', processDate: daysAgo(12), satisfaction: 2,
  },
];

const typeOptions = ['시설', '서비스', '식사', '기타'];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '접수': 'bg-red-100 text-red-700',
    '처리중': 'bg-yellow-100 text-yellow-700',
    '완료': 'bg-green-100 text-green-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const typeBadge = (type: string) => {
  const map: Record<string, string> = {
    '시설': 'bg-blue-100 text-blue-700',
    '서비스': 'bg-purple-100 text-purple-700',
    '식사': 'bg-orange-100 text-orange-700',
    '기타': 'bg-gray-100 text-gray-600',
  };
  return map[type] || 'bg-gray-100 text-gray-600';
};

const renderStars = (score: number | null, onClick?: (v: number) => void) => {
  if (score === null && !onClick) return <span className="text-gray-300 text-xs">-</span>;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`text-sm ${onClick ? 'cursor-pointer' : ''} ${i <= (score ?? 0) ? 'text-yellow-400' : 'text-gray-200'}`}
          onClick={() => onClick?.(i)}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

const residentOptions = residents.filter(r => r.status !== 'DISCHARGED');
const emptyForm = { residentId: '', type: '서비스', content: '' };

const tabs = [
  { id: 'register', label: '민원 접수', path: '/concierge/complaint/register' },
  { id: 'status', label: '처리 현황', path: '/concierge/complaint/status' },
  { id: 'stats', label: '민원 통계', path: '/concierge/complaint/stats' },
];

export default function ComplaintPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [data, setData] = useState<ComplaintItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');

  const total = data.length;
  const completed = data.filter(d => d.processStatus === '완료').length;
  const inProgress = data.filter(d => d.processStatus === '처리중').length;
  const pending = data.filter(d => d.processStatus === '접수').length;

  const filtered = data
    .filter(d => statusFilter === '전체' || d.processStatus === statusFilter)
    .filter(d => !search || d.complainant.includes(search) || d.content.includes(search));

  const handleSave = () => {
    if (!formData.residentId || !formData.content) return;
    const res = residents.find(r => r.id === formData.residentId);
    if (!res) return;
    const newItem: ComplaintItem = {
      id: generateId('cp'),
      date: new Date().toISOString().slice(0, 10),
      complainant: `${res.emergencyContact.name} (${res.name} ${res.emergencyContact.relationship})`,
      phone: res.emergencyContact.phone,
      type: formData.type,
      content: formData.content,
      processStatus: '접수',
      processDate: '-',
      satisfaction: null,
    };
    setData(prev => [newItem, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const changeStatus = (id: string, status: string) => {
    if (status === '완료') {
      setRatingId(id);
      setRatingValue(0);
      return;
    }
    setData(prev => prev.map(d => d.id === id ? { ...d, processStatus: status } : d));
  };

  const handleRatingSave = () => {
    if (!ratingId || ratingValue === 0) return;
    setData(prev => prev.map(d => {
      if (d.id !== ratingId) return d;
      return {
        ...d,
        processStatus: '완료',
        processDate: new Date().toISOString().slice(0, 10),
        satisfaction: ratingValue,
      };
    }));
    setRatingId(null);
    setRatingValue(0);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(d => d.id !== id));
  };

  // Stats calculations
  const avgSatisfaction = (() => {
    const rated = data.filter(d => d.satisfaction !== null);
    if (rated.length === 0) return 0;
    return (rated.reduce((s, d) => s + (d.satisfaction ?? 0), 0) / rated.length).toFixed(1);
  })();

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const avgProcessDays = (() => {
    const doneWithDates = data.filter(d => d.processStatus === '완료' && d.processDate !== '-');
    if (doneWithDates.length === 0) return 0;
    const totalDays = doneWithDates.reduce((sum, d) => {
      const start = new Date(d.date).getTime();
      const end = new Date(d.processDate).getTime();
      return sum + Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    }, 0);
    return (totalDays / doneWithDates.length).toFixed(1);
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">민원관리</h1>
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

      {/* register: 민원 접수 폼 + 최근 접수 목록 */}
      {segment === 'register' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">민원 접수</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자 선택 (보호자 자동 연결)</label>
                <select
                  value={formData.residentId}
                  onChange={e => setFormData({ ...formData, residentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="">-- 입소자 선택 --</option>
                  {residentOptions.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.building} {r.roomNumber}호) - 보호자: {r.emergencyContact.name} ({r.emergencyContact.relationship})
                    </option>
                  ))}
                </select>
                {formData.residentId && (() => {
                  const res = residents.find(r => r.id === formData.residentId);
                  if (!res) return null;
                  return (
                    <p className="mt-1 text-xs text-blue-600">
                      연락처: {res.emergencyContact.phone}
                    </p>
                  );
                })()}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  placeholder="민원 내용을 입력하세요..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d] font-medium"
                >
                  접수 등록
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800">최근 접수 목록 (최근 5건)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">접수일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">민원인</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">유형</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">내용</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처리상태</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700">{row.date}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap">{row.complainant}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.content}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.processStatus)}`}>{row.processStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* status: 민원 처리 현황 */}
      {segment === 'status' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-xs text-gray-500 mt-1">총 민원</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completed}</div>
              <div className="text-xs text-gray-500 mt-1">처리완료</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{inProgress}</div>
              <div className="text-xs text-gray-500 mt-1">처리중</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{pending}</div>
              <div className="text-xs text-gray-500 mt-1">미처리</div>
            </div>
          </div>

          {/* 진행상태별 필터 */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {['전체', '접수', '처리중', '완료'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s}
                <span className="ml-1 text-xs text-gray-400">
                  ({s === '전체' ? total : data.filter(d => d.processStatus === s).length})
                </span>
              </button>
            ))}
          </div>

          <div>
            <input
              type="text"
              placeholder="민원인 또는 내용으로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A] focus:border-transparent"
            />
          </div>

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">접수일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">민원인</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">연락처</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">유형</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">내용</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처리상태</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">처리일</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">만족도</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700">{row.date}</td>
                      <td className="px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap">{row.complainant}</td>
                      <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{row.phone}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge(row.type)}`}>{row.type}</span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.content}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.processStatus)}`}>{row.processStatus}</span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">{row.processDate}</td>
                      <td className="px-4 py-2.5">{renderStars(row.satisfaction)}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex gap-1">
                          {row.processStatus === '접수' && (
                            <button onClick={() => changeStatus(row.id, '처리중')} className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600">처리중</button>
                          )}
                          {(row.processStatus === '접수' || row.processStatus === '처리중') && (
                            <button onClick={() => changeStatus(row.id, '완료')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">완료</button>
                          )}
                          <button onClick={() => handleDelete(row.id)} className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">검색 결과가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* stats: 민원 통계 */}
      {segment === 'stats' && (
        <div className="space-y-4">
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border p-5 text-center">
              <div className="text-3xl font-bold text-[#F0835A]">{completionRate}%</div>
              <div className="text-sm text-gray-500 mt-1">처리율</div>
              <div className="text-xs text-gray-400 mt-0.5">완료 {completed} / 전체 {total}</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-5 text-center">
              <div className="text-3xl font-bold text-yellow-500">{avgSatisfaction}</div>
              <div className="text-sm text-gray-500 mt-1">평균 만족도</div>
              <div className="text-xs text-gray-400 mt-0.5">5점 만점</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-5 text-center">
              <div className="text-3xl font-bold text-blue-600">{avgProcessDays}</div>
              <div className="text-sm text-gray-500 mt-1">평균 처리일수</div>
              <div className="text-xs text-gray-400 mt-0.5">완료 건 기준 (일)</div>
            </div>
          </div>

          {/* 유형별 건수 */}
          <div className="bg-white rounded-lg shadow border p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">유형별 민원 건수</h3>
            <div className="space-y-3">
              {typeOptions.map(type => {
                const typeData = data.filter(d => d.type === type);
                const count = typeData.length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const doneCount = typeData.filter(d => d.processStatus === '완료').length;
                return (
                  <div key={type} className="flex items-center gap-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium w-16 text-center ${typeBadge(type)}`}>{type}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div className="bg-[#F0835A] h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-600 w-32 text-right">{count}건 (완료 {doneCount}건)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 처리 현황 요약 */}
          <div className="bg-white rounded-lg shadow border p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">처리 상태별 현황</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: '접수', count: pending, color: 'bg-red-500', textColor: 'text-red-600' },
                { label: '처리중', count: inProgress, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
                { label: '완료', count: completed, color: 'bg-green-500', textColor: 'text-green-600' },
              ].map(item => (
                <div key={item.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${item.textColor}`}>{item.count}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                    <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${total > 0 ? Math.round((item.count / total) * 100) : 0}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{total > 0 ? Math.round((item.count / total) * 100) : 0}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 만족도 평가 모달 */}
      {ratingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">만족도 평가</h2>
            <p className="text-sm text-gray-600">민원 처리 완료 시 만족도를 입력해주세요.</p>
            <div className="flex justify-center py-2">
              {renderStars(ratingValue, (v) => setRatingValue(v))}
            </div>
            <div className="text-center text-sm text-gray-500">
              {ratingValue > 0 ? `${ratingValue}점` : '별점을 선택해주세요'}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setRatingId(null); setRatingValue(0); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleRatingSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
