import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStaff } from '../../context/AppStateContext';

interface MaintenanceRequest {
  id: string;
  requestDate: string;
  requester: string;
  location: string;
  description: string;
  priority: '긴급' | '높음' | '보통' | '낮음';
  status: '요청' | '진행중' | '완료';
  completionDate: string | null;
  cost: number | null;
}

function buildInitialRequests(staff: { role: string; name: string }[]): MaintenanceRequest[] {
  const nurse1 = staff.find(s => s.role === 'NURSE')?.name ?? '김서연';
  const nurse2 = staff.filter(s => s.role === 'NURSE')[1]?.name ?? '이하은';
  const social1 = staff.find(s => s.role === 'SOCIAL_WORKER')?.name ?? '최민정';
  const director = staff.find(s => s.role === 'DIRECTOR')?.name ?? '박준혁';
  return [
    { id: '1', requestDate: '2026-03-28', requester: nurse1, location: '1관 107호 화장실', description: '온수 배관 누수 발생, 바닥 물 고임', priority: '긴급', status: '진행중', completionDate: null, cost: null },
    { id: '2', requestDate: '2026-03-27', requester: social1, location: '2관 203호', description: '에어컨 작동 불량 (냉방 안됨)', priority: '높음', status: '진행중', completionDate: null, cost: null },
    { id: '3', requestDate: '2026-03-26', requester: nurse2, location: '1관 3층 복도', description: '형광등 3개 깜빡임 현상', priority: '보통', status: '요청', completionDate: null, cost: null },
    { id: '4', requestDate: '2026-03-25', requester: director, location: '2관 엘리베이터', description: '정기 안전 점검 (분기별)', priority: '높음', status: '완료', completionDate: '2026-03-28', cost: 350000 },
    { id: '5', requestDate: '2026-03-24', requester: social1, location: '1층 대강당', description: '프로젝터 램프 교체 필요', priority: '보통', status: '완료', completionDate: '2026-03-27', cost: 180000 },
    { id: '6', requestDate: '2026-03-23', requester: nurse1, location: '2관 1층 현관', description: '자동문 센서 오작동 (열림 지연)', priority: '높음', status: '완료', completionDate: '2026-03-25', cost: 120000 },
    { id: '7', requestDate: '2026-03-22', requester: nurse2, location: '1관 105호', description: '창문 잠금장치 고장', priority: '낮음', status: '요청', completionDate: null, cost: null },
    { id: '8', requestDate: '2026-03-20', requester: director, location: '옥상 물탱크', description: '정수 필터 교체 및 물탱크 청소', priority: '보통', status: '완료', completionDate: '2026-03-22', cost: 250000 },
  ];
}

const priorityColors: Record<string, string> = {
  '긴급': 'bg-red-100 text-red-800 border border-red-300',
  '높음': 'bg-orange-100 text-orange-800',
  '보통': 'bg-blue-100 text-blue-800',
  '낮음': 'bg-gray-100 text-gray-600',
};

const statusColors: Record<string, string> = {
  '요청': 'bg-yellow-100 text-yellow-800',
  '진행중': 'bg-blue-100 text-blue-800',
  '완료': 'bg-green-100 text-green-800',
};

const emptyForm = { location: '', description: '', priority: '보통' as MaintenanceRequest['priority'] };

const tabs = [
  { id: 'register', label: '보수요청 등록', path: '/erp/maintenance/register' },
  { id: 'status', label: '보수진행 현황', path: '/erp/maintenance/status' },
  { id: 'history', label: '보수이력 조회', path: '/erp/maintenance/history' },
];

export default function MaintenancePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [staff] = useStaff();
  const director = useMemo(() => staff.find(s => s.role === 'DIRECTOR')?.name ?? '박준혁', [staff]);
  const initialRequests = useMemo(() => buildInitialRequests(staff), [staff]);

  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [completeCost, setCompleteCost] = useState('');

  const totalCost = requests.reduce((sum, r) => sum + (r.cost || 0), 0);
  const pending = requests.filter(r => r.status !== '완료').length;
  const completed = requests.filter(r => r.status === '완료').length;
  const inProgressRequests = requests.filter(r => r.status !== '완료');
  const historyRequests = requests.filter(r => r.status === '완료');

  const handleEdit = (id: string) => {
    const item = requests.find(r => r.id === id);
    if (!item) return;
    setFormData({ location: item.location, description: item.description, priority: item.priority });
    setEditingId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setRequests(prev => prev.map(r => r.id === editingId ? {
        ...r,
        location: formData.location,
        description: formData.description,
        priority: formData.priority,
      } : r));
    } else {
      const newReq: MaintenanceRequest = {
        id: crypto.randomUUID(),
        requestDate: new Date().toISOString().slice(0, 10),
        requester: director,
        location: formData.location,
        description: formData.description,
        priority: formData.priority,
        status: '요청',
        completionDate: null,
        cost: null,
      };
      setRequests(prev => [newReq, ...prev]);
    }
    setFormData(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  const handleProgress = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: '진행중' as const } : r));
  };

  const openComplete = (id: string) => {
    setCompleteId(id);
    setCompleteCost('');
  };

  const handleComplete = () => {
    if (!completeId) return;
    const cost = parseInt(completeCost) || 0;
    setRequests(prev => prev.map(r => r.id === completeId ? { ...r, status: '완료' as const, completionDate: new Date().toISOString().slice(0, 10), cost } : r));
    setCompleteId(null);
    setCompleteCost('');
  };

  const RequestTable = ({ rows }: { rows: MaintenanceRequest[] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">요청일</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">요청자</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">위치</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">내용</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">우선순위</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">상태</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">완료일</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">비용</th>
              <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(req => (
              <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-600">{req.requestDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{req.requester}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{req.location}</td>
                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{req.description}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded ${priorityColors[req.priority]}`}>{req.priority}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[req.status]}`}>{req.status}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{req.completionDate || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">
                  {req.cost ? `${req.cost.toLocaleString()}원` : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-1">
                    {req.status === '요청' && (
                      <button onClick={() => handleProgress(req.id)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">진행</button>
                    )}
                    {req.status === '진행중' && (
                      <button onClick={() => openComplete(req.id)} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">완료</button>
                    )}
                    {req.status !== '완료' && (
                      <button onClick={() => handleEdit(req.id)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">수정</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">유지보수</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#d9714d]">
          + 요청 등록
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* register: 보수요청 등록 폼 */}
      {segment === 'register' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">전체 요청</p>
              <p className="text-3xl font-bold text-gray-900">{requests.length}<span className="text-base font-normal text-gray-500">건</span></p>
            </div>
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-center">
              <p className="text-sm text-yellow-700">미처리</p>
              <p className="text-3xl font-bold text-yellow-700">{pending}<span className="text-base font-normal text-yellow-500">건</span></p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
              <p className="text-sm text-green-700">완료</p>
              <p className="text-3xl font-bold text-green-700">{completed}<span className="text-base font-normal text-green-500">건</span></p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
              <p className="text-sm text-blue-600">이번 달 비용</p>
              <p className="text-2xl font-bold text-blue-700">{totalCost.toLocaleString()}<span className="text-sm font-normal text-blue-500">원</span></p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">보수요청 등록</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="예: 1관 101호 화장실" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="보수 내용을 상세히 입력하세요" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as MaintenanceRequest['priority'] })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]">
                  <option>긴급</option>
                  <option>높음</option>
                  <option>보통</option>
                  <option>낮음</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button onClick={handleSave} className="px-6 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#d9714d]">등록</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* status: 보수진행 현황 */}
      {segment === 'status' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-sm text-yellow-700">요청</p>
              <p className="text-3xl font-bold text-yellow-700">{requests.filter(r => r.status === '요청').length}<span className="text-base font-normal">건</span></p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600">진행중</p>
              <p className="text-3xl font-bold text-blue-700">{requests.filter(r => r.status === '진행중').length}<span className="text-base font-normal">건</span></p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm text-red-600">긴급 요청</p>
              <p className="text-3xl font-bold text-red-700">{requests.filter(r => r.priority === '긴급' && r.status !== '완료').length}<span className="text-base font-normal">건</span></p>
            </div>
          </div>
          <RequestTable rows={inProgressRequests} />
        </div>
      )}

      {/* history: 보수이력 조회 */}
      {segment === 'history' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-600">완료 건수</p>
              <p className="text-3xl font-bold text-green-700">{historyRequests.length}<span className="text-base font-normal">건</span></p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-600">총 누적 비용</p>
              <p className="text-2xl font-bold text-blue-700">{totalCost.toLocaleString()}<span className="text-base font-normal">원</span></p>
            </div>
          </div>
          <RequestTable rows={historyRequests} />
        </div>
      )}

      {/* New request modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? '수정' : '요청 등록'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">위치</label>
                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value as MaintenanceRequest['priority'] })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>긴급</option>
                  <option>높음</option>
                  <option>보통</option>
                  <option>낮음</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowModal(false); setFormData(emptyForm); setEditingId(null); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* Complete modal with cost */}
      {completeId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">작업 완료 처리</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비용 (원)</label>
              <input type="number" value={completeCost} onChange={e => setCompleteCost(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setCompleteId(null)} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleComplete} className="px-4 py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600">완료 처리</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
