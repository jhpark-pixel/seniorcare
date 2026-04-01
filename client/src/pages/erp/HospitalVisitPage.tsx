import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateId, daysAgo } from '../../data/mockData';
import { useCollection, useResidents, useStaff } from '../../context/AppStateContext';

interface HospitalVisit {
  id: string;
  date: string;
  name: string;
  room: string;
  hospital: string;
  dept: string;
  companion: string;
  note: string;
  status: '예약' | '완료' | '취소';
}

const buildInitialData = (staffList: any[]): HospitalVisit[] => [
  { id: '1', date: daysAgo(-1), name: '김영순', room: '1관 101호', hospital: '배곧서울병원', dept: '내과', companion: `간호사 ${staffList[1]?.name ?? ''}`, note: '혈압약 처방 변경 상담', status: '예약' },
  { id: '2', date: daysAgo(-2), name: '송미경', room: '2관 205호', hospital: '시화병원', dept: '심장내과', companion: `간호사 ${staffList[2]?.name ?? ''}`, note: '심부전 외래 진료 및 약 조정', status: '예약' },
  { id: '3', date: daysAgo(-5), name: '이복자', room: '1관 103호', hospital: '분당서울대병원', dept: '신경과', companion: `간호사 ${staffList[1]?.name ?? ''}`, note: '치매 정기 외래 (보호자 동행)', status: '예약' },
  { id: '4', date: daysAgo(3), name: '최순남', room: '1관 107호', hospital: '배곧서울병원', dept: '신경과', companion: `생활지도사 ${staffList[4]?.name ?? ''}`, note: '뇌졸중 재활 경과 확인', status: '완료' },
  { id: '5', date: daysAgo(5), name: '윤태식', room: '2관 207호', hospital: '시화병원', dept: '신경과', companion: `간호사 ${staffList[2]?.name ?? ''}`, note: 'INR 수치 확인 및 와파린 조절', status: '완료' },
  { id: '6', date: daysAgo(6), name: '정기원', room: '1관 109호', hospital: '배곧서울병원', dept: '정신건강의학과', companion: `생활지도사 ${staffList[3]?.name ?? ''}`, note: '우울증 약 처방 및 상담', status: '완료' },
  { id: '7', date: daysAgo(9), name: '박정호', room: '1관 105호', hospital: '배곧좋은치과', dept: '치과', companion: `생활지도사 ${staffList[4]?.name ?? ''}`, note: '틀니 수리 완료 수령', status: '완료' },
  { id: '8', date: daysAgo(-3), name: '강옥희', room: '2관 209호', hospital: '배곧서울병원', dept: '정형외과', companion: `간호사 ${staffList[2]?.name ?? ''}`, note: '관절염 진료 및 약 처방', status: '예약' },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    '예약': 'bg-blue-100 text-blue-700',
    '완료': 'bg-green-100 text-green-700',
    '취소': 'bg-gray-100 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const emptyForm = { residentId: '', hospital: '', dept: '', date: '', companionId: '', note: '' };

const tabs = [
  { id: 'apply', label: '병원동행 신청', path: '/concierge/hospital/apply' },
  { id: 'schedule', label: '예정 일정', path: '/concierge/hospital/schedule' },
  { id: 'history', label: '이력 조회', path: '/concierge/hospital/history' },
];

export default function HospitalVisitPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [residents] = useResidents();
  const [staff] = useStaff();

  const initialData = useMemo(() => buildInitialData(staff), [staff]);
  const residentOptions = useMemo(() => residents.filter(r => r.status !== 'DISCHARGED'), [residents]);

  const [data, setData] = useCollection<HospitalVisit>('hospitalVisits', initialData);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const upcoming = data.filter(d => d.status === '예약');
  const completed = data.filter(d => d.status === '완료');

  const handleEdit = (id: string) => {
    const item = data.find(d => d.id === id);
    if (!item) return;
    const res = residents.find(r => r.name === item.name);
    const comp = staff.find(s => item.companion.includes(s.name));
    setFormData({ residentId: res?.id || '', hospital: item.hospital, dept: item.dept, date: item.date, companionId: comp?.id || '', note: item.note });
    setEditingId(id);
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (!formData.residentId || !formData.hospital || !formData.date) return;
    const res = residents.find(r => r.id === formData.residentId);
    if (!res) return;
    const companion = staff.find(s => s.id === formData.companionId);
    if (editingId) {
      setData(prev => prev.map(d => d.id === editingId ? {
        ...d,
        date: formData.date,
        name: res.name,
        room: `${res.building} ${res.roomNumber}호`,
        hospital: formData.hospital,
        dept: formData.dept,
        companion: companion ? `${companion.roleLabel} ${companion.name}` : '-',
        note: formData.note,
      } : d));
      setEditingId(null);
      setShowEditModal(false);
    } else {
      const newRecord: HospitalVisit = {
        id: generateId('hv'),
        date: formData.date,
        name: res.name,
        room: `${res.building} ${res.roomNumber}호`,
        hospital: formData.hospital,
        dept: formData.dept,
        companion: companion ? `${companion.roleLabel} ${companion.name}` : '-',
        note: formData.note,
        status: '예약',
      };
      setData(prev => [newRecord, ...prev]);
    }
    setFormData(emptyForm);
  };

  const handleStatusChange = (id: string, newStatus: '완료' | '취소') => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">병원동행</h1>
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

      {/* apply: 병원동행 신청 폼 */}
      {segment === 'apply' && (
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">병원동행 신청</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">입소자 선택</label>
              <select
                value={formData.residentId}
                onChange={e => setFormData({ ...formData, residentId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
              >
                <option value="">-- 선택 --</option>
                {residentOptions.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.building} {r.roomNumber}호)</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">병원명</label>
                <input type="text" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} placeholder="예: 배곧서울병원" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">진료과</label>
                <input type="text" value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} placeholder="예: 내과" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">예정일</label>
                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">동행자</label>
                <select
                  value={formData.companionId}
                  onChange={e => setFormData({ ...formData, companionId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="">-- 선택 --</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.roleLabel} {s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
              <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} placeholder="특이사항 입력..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleSave} className="px-6 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d] font-medium">
                신청 등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* schedule: 병원동행 예정 일정표 */}
      {segment === 'schedule' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{upcoming.length}</div>
              <div className="text-xs text-gray-500 mt-1">예약 중</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completed.length}</div>
              <div className="text-xs text-gray-500 mt-1">완료</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{data.length}</div>
              <div className="text-xs text-gray-500 mt-1">전체</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800">예정 일정 ({upcoming.length}건)</h3>
            </div>
            {upcoming.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">예정된 병원동행 일정이 없습니다.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {upcoming.map(row => (
                  <div key={row.id} className="px-4 py-4 flex items-start gap-4 hover:bg-blue-50/30">
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-600 text-white rounded-lg flex flex-col items-center justify-center">
                      <span className="text-lg font-bold">{row.date.split('-')[2]}</span>
                      <span className="text-[10px]">{parseInt(row.date.split('-')[1])}월</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{row.name}</span>
                        <span className="text-xs text-gray-500">{row.room}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.status)}`}>{row.status}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>병원: {row.hospital}</span>
                        <span>진료과: {row.dept}</span>
                        <span>동행자: {row.companion}</span>
                      </div>
                      {row.note && <p className="text-xs text-gray-400 mt-1">{row.note}</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => handleEdit(row.id)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">수정</button>
                      <button onClick={() => handleStatusChange(row.id, '완료')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">완료</button>
                      <button onClick={() => handleStatusChange(row.id, '취소')} className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500">취소</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">수정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자 선택</label>
                <select value={formData.residentId} onChange={e => setFormData({ ...formData, residentId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]">
                  <option value="">-- 선택 --</option>
                  {residentOptions.map(r => (<option key={r.id} value={r.id}>{r.name} ({r.building} {r.roomNumber}호)</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">병원명</label>
                  <input type="text" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">진료과</label>
                  <input type="text" value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">예정일</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">동행자</label>
                  <select value={formData.companionId} onChange={e => setFormData({ ...formData, companionId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]">
                    <option value="">-- 선택 --</option>
                    {staff.map(s => (<option key={s.id} value={s.id}>{s.roleLabel} {s.name}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
                <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowEditModal(false); setFormData(emptyForm); setEditingId(null); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* history: 병원동행 이력 조회 */}
      {segment === 'history' && (
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">병원동행 전체 이력 ({data.length}건)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">날짜</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">병원명</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">진료과</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">동행자</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">비고</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className={`border-b border-gray-50 hover:bg-gray-50 ${row.status === '예약' ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                    <td className="px-4 py-2.5 text-gray-700">{row.hospital}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.dept}</td>
                    <td className="px-4 py-2.5 text-gray-600">{row.companion}</td>
                    <td className="px-4 py-2.5 text-gray-600 max-w-xs truncate">{row.note}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(row.status)}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
