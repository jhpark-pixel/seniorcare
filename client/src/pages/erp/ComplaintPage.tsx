import React, { useState } from 'react';
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

export default function ComplaintPage() {
  const [data, setData] = useState<ComplaintItem[]>(initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = search ? data.filter(d => d.complainant.includes(search) || d.content.includes(search)) : data;

  const total = data.length;
  const completed = data.filter(d => d.processStatus === '완료').length;
  const inProgress = data.filter(d => d.processStatus === '처리중').length;
  const pending = data.filter(d => d.processStatus === '접수').length;

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">민원관리</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]"
        >
          + 민원 접수
        </button>
      </div>

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

      {/* 검색 */}
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
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-800">민원 목록</h3>
        </div>
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
                        <button
                          onClick={() => changeStatus(row.id, '처리중')}
                          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          처리중
                        </button>
                      )}
                      {(row.processStatus === '접수' || row.processStatus === '처리중') && (
                        <button
                          onClick={() => changeStatus(row.id, '완료')}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          완료
                        </button>
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">검색 결과가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 신규 등록 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">민원 접수</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
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
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                >
                  {typeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
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
              <button
                onClick={() => { setRatingId(null); setRatingValue(0); }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleRatingSave}
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
