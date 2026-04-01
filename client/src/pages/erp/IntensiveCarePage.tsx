import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCollection, useResidents, useStaff } from '../../context/AppStateContext';

interface IntensiveCareRecord {
  id: string;
  name: string;
  room: string;
  reason: string;
  grade: '상' | '중' | '하';
  period: string;
  manager: string;
  active: boolean;
  vitals: { bp: string; hr: string; temp: string; sugar: string };
}

interface Device {
  id: string;
  name: string;
  residentName: string;
  room: string;
  type: string;
  serialNo: string;
  status: '정상' | '경고' | '오프라인';
  battery: number;
  lastSeen: string;
}

const initialData: IntensiveCareRecord[] = [
  { id: '1', name: '김영순', room: '1관 101호', reason: '고혈압 + 당뇨 복합 관리', grade: '상', period: '2026-01-15 ~ 현재', manager: '간호사 김서연', active: true, vitals: { bp: '148/92', hr: '78', temp: '36.4', sugar: '165' } },
  { id: '2', name: '이복자', room: '1관 103호', reason: '치매 진행 관찰 + 심부전 모니터링', grade: '상', period: '2026-02-01 ~ 현재', manager: '간호사 김서연', active: true, vitals: { bp: '132/84', hr: '72', temp: '36.6', sugar: '105' } },
  { id: '3', name: '최순남', room: '1관 107호', reason: '뇌졸중 후유증 재활 및 고혈압 관리', grade: '상', period: '2025-11-10 ~ 현재', manager: '간호사 이하은', active: true, vitals: { bp: '152/96', hr: '68', temp: '36.5', sugar: '102' } },
  { id: '4', name: '윤태식', room: '2관 207호', reason: '뇌졸중 + 치매 복합 와파린 복용 모니터링', grade: '상', period: '2026-02-15 ~ 현재', manager: '간호사 이하은', active: true, vitals: { bp: '118/74', hr: '64', temp: '36.3', sugar: '95' } },
  { id: '5', name: '정기원', room: '1관 109호', reason: '파킨슨병 약물 조절 + 우울증 관찰', grade: '중', period: '2026-03-01 ~ 현재', manager: '간호사 김서연', active: true, vitals: { bp: '122/76', hr: '70', temp: '36.5', sugar: '108' } },
  { id: '6', name: '한말순', room: '2관 201호', reason: '중증 치매 안전 관리 + 골다공증 낙상 예방', grade: '중', period: '2026-03-20 ~ 현재', manager: '간호사 이하은', active: true, vitals: { bp: '120/78', hr: '74', temp: '36.7', sugar: '100' } },
];

const initialDevices: Device[] = [
  { id: 'd1', name: '낙상감지 센서 A', residentName: '김영순', room: '1관 101호', type: '낙상감지', serialNo: 'FS-2024-001', status: '정상', battery: 85, lastSeen: '2026-03-30 08:42' },
  { id: 'd2', name: '심박/혈압 모니터 B', residentName: '이복자', room: '1관 103호', type: '심박/혈압', serialNo: 'HB-2024-002', status: '경고', battery: 23, lastSeen: '2026-03-30 07:55' },
  { id: 'd3', name: '낙상감지 센서 C', residentName: '최순남', room: '1관 107호', type: '낙상감지', serialNo: 'FS-2024-003', status: '정상', battery: 91, lastSeen: '2026-03-30 09:01' },
  { id: 'd4', name: '혈당 측정기 D', residentName: '윤태식', room: '2관 207호', type: '혈당측정', serialNo: 'GL-2024-004', status: '오프라인', battery: 0, lastSeen: '2026-03-28 14:22' },
  { id: 'd5', name: '체온 패치 E', residentName: '정기원', room: '1관 109호', type: '체온측정', serialNo: 'TM-2024-005', status: '정상', battery: 67, lastSeen: '2026-03-30 08:58' },
  { id: 'd6', name: '낙상감지 센서 F', residentName: '한말순', room: '2관 201호', type: '낙상감지', serialNo: 'FS-2024-006', status: '정상', battery: 78, lastSeen: '2026-03-30 09:05' },
];

const gradeStyle = (grade: string) => {
  const map: Record<string, { border: string; bg: string; badge: string }> = {
    '상': { border: 'border-red-300', bg: 'bg-red-50', badge: 'bg-red-500 text-white' },
    '중': { border: 'border-orange-300', bg: 'bg-orange-50', badge: 'bg-orange-500 text-white' },
    '하': { border: 'border-yellow-300', bg: 'bg-yellow-50', badge: 'bg-yellow-500 text-white' },
  };
  return map[grade] || { border: 'border-gray-300', bg: 'bg-gray-50', badge: 'bg-gray-500 text-white' };
};

const deviceStatusStyle = (status: string) => {
  const map: Record<string, string> = {
    '정상': 'bg-green-100 text-green-700',
    '경고': 'bg-orange-100 text-orange-700',
    '오프라인': 'bg-gray-200 text-gray-500',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

const tabs = [
  { id: 'register', label: '대상자 등록', path: '/erp/intensive-care/register' },
  { id: 'status', label: '대상자 현황', path: '/erp/intensive-care/status' },
  { id: 'device', label: '디바이스 관리', path: '/erp/intensive-care/device' },
];

export default function IntensiveCarePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [residents] = useResidents();
  const [staffList] = useStaff();

  const residentOptions = useMemo(() => residents.map(r => r.name), [residents]);
  const managerOptions = useMemo(() => [
    ...staffList.filter(s => s.role === 'NURSE').map(s => `간호사 ${s.name}`),
    ...staffList.filter(s => s.role === 'SOCIAL_WORKER').map(s => `생활지도사 ${s.name}`),
  ], [staffList]);
  const emptyForm = useMemo<{ name: string; reason: string; grade: '상' | '중' | '하'; manager: string }>(() => ({
    name: residentOptions[0],
    reason: '',
    grade: '상',
    manager: managerOptions[0],
  }), [residentOptions, managerOptions]);

  const [data, setData] = useCollection<IntensiveCareRecord>('intensiveCare', initialData);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [devices, setDevices] = useCollection<Device>('intensiveCareDevices', initialDevices);
  const [deviceFilter, setDeviceFilter] = useState('전체');

  const activeData = data.filter(d => d.active);
  const gradeCount = { '상': 0, '중': 0, '하': 0 };
  activeData.forEach(d => { gradeCount[d.grade as keyof typeof gradeCount]++; });

  const handleEdit = (id: string) => {
    const item = data.find(d => d.id === id);
    if (!item) return;
    setFormData({ name: item.name, reason: item.reason, grade: item.grade, manager: item.manager });
    setEditingId(id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.reason) return;
    if (editingId) {
      const resident = residents.find(r => r.name === formData.name);
      setData(prev => prev.map(d => d.id === editingId ? {
        ...d,
        name: formData.name,
        room: resident ? `${resident.building} ${resident.roomNumber}호` : d.room,
        reason: formData.reason,
        grade: formData.grade,
        manager: formData.manager,
      } : d));
    } else {
      const resident = residents.find(r => r.name === formData.name);
      const newRecord: IntensiveCareRecord = {
        id: crypto.randomUUID(),
        name: formData.name,
        room: resident ? `${resident.building} ${resident.roomNumber}호` : '',
        reason: formData.reason,
        grade: formData.grade,
        period: `${new Date().toISOString().slice(0, 10)} ~ 현재`,
        manager: formData.manager,
        active: true,
        vitals: { bp: '-', hr: '-', temp: '-', sugar: '-' },
      };
      setData(prev => [...prev, newRecord]);
    }
    setFormData(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  const handleComplete = (id: string) => {
    const today = new Date().toISOString().slice(0, 10);
    setData(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, active: false, period: r.period.replace('현재', today) };
    }));
  };

  const deviceTypes = ['전체', ...Array.from(new Set(devices.map(d => d.type)))];
  const filteredDevices = deviceFilter === '전체' ? devices : devices.filter(d => d.type === deviceFilter);

  const deviceStatusCount = {
    '정상': devices.filter(d => d.status === '정상').length,
    '경고': devices.filter(d => d.status === '경고').length,
    '오프라인': devices.filter(d => d.status === '오프라인').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">집중케어</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 대상자 등록
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

      {/* REGISTER TAB */}
      {segment === 'register' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{activeData.length}</div>
              <div className="text-xs text-gray-500 mt-1">전체 대상자</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{gradeCount['상']}</div>
              <div className="text-xs text-gray-500 mt-1">상 (긴급)</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{gradeCount['중']}</div>
              <div className="text-xs text-gray-500 mt-1">중 (주의)</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{gradeCount['하']}</div>
              <div className="text-xs text-gray-500 mt-1">하 (관찰)</div>
            </div>
          </div>

          {/* Inline registration form */}
          <div className="bg-white rounded-lg shadow border p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">집중케어 대상자 등록</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                  <select
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-transparent"
                  >
                    {residentOptions.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">관리등급</label>
                  <select
                    value={formData.grade}
                    onChange={e => setFormData({ ...formData, grade: e.target.value as '상' | '중' | '하' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-transparent"
                  >
                    <option value="상">상 (긴급)</option>
                    <option value="중">중 (주의)</option>
                    <option value="하">하 (관찰)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관리사유</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="집중케어가 필요한 사유를 입력하세요"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                <select
                  value={formData.manager}
                  onChange={e => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-transparent"
                >
                  {managerOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d] font-medium"
              >
                등록
              </button>
            </div>
          </div>

          {/* Completed records */}
          {data.filter(d => !d.active).length > 0 && (
            <div className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800">완료된 집중케어 이력</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리사유</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">등급</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">기간</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">담당자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.filter(d => !d.active).map(row => {
                      const style = gradeStyle(row.grade);
                      return (
                        <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 opacity-60">
                          <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                          <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                          <td className="px-4 py-2.5 text-gray-600">{row.reason}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>{row.grade}등급</span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-500 text-xs">{row.period}</td>
                          <td className="px-4 py-2.5 text-gray-600">{row.manager}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STATUS TAB */}
      {segment === 'status' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{activeData.length}</div>
              <div className="text-xs text-gray-500 mt-1">전체 대상자</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{gradeCount['상']}</div>
              <div className="text-xs text-gray-500 mt-1">상 (긴급)</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{gradeCount['중']}</div>
              <div className="text-xs text-gray-500 mt-1">중 (주의)</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{gradeCount['하']}</div>
              <div className="text-xs text-gray-500 mt-1">하 (관찰)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeData.map((resident) => {
              const style = gradeStyle(resident.grade);
              return (
                <div key={resident.id} className={`rounded-lg border-2 ${style.border} ${style.bg} p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{resident.name}</h3>
                      <p className="text-xs text-gray-500">{resident.room}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style.badge}`}>
                      {resident.grade}등급
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">관리사유</span>
                      <p className="text-sm text-gray-700">{resident.reason}</p>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>기간: {resident.period}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      담당: {resident.manager}
                    </div>
                  </div>

                  <div className="border-t pt-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">최근 바이탈</span>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400">혈압</div>
                        <div className={`text-xs font-semibold ${parseInt(resident.vitals.bp) > 140 ? 'text-red-600' : 'text-gray-700'}`}>
                          {resident.vitals.bp}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400">심박</div>
                        <div className="text-xs font-semibold text-gray-700">{resident.vitals.hr}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400">체온</div>
                        <div className="text-xs font-semibold text-gray-700">{resident.vitals.temp}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-400">혈당</div>
                        <div className={`text-xs font-semibold ${parseInt(resident.vitals.sugar) > 140 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {resident.vitals.sugar}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t flex gap-1">
                    <button
                      onClick={() => handleEdit(resident.id)}
                      className="flex-1 px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleComplete(resident.id)}
                      className="flex-1 px-3 py-1.5 text-xs bg-green-500 text-white rounded hover:bg-green-600 font-medium"
                    >
                      완료
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vital summary table */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-800">바이탈 현황 요약</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">등급</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">혈압</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">심박</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">체온</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">혈당</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">담당자</th>
                  </tr>
                </thead>
                <tbody>
                  {activeData.map(row => {
                    const style = gradeStyle(row.grade);
                    const bpHigh = parseInt(row.vitals.bp) > 140;
                    const sugarHigh = parseInt(row.vitals.sugar) > 140;
                    return (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-900">{row.name}</td>
                        <td className="px-4 py-2.5 text-gray-600">{row.room}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${style.badge}`}>{row.grade}</span>
                        </td>
                        <td className={`px-4 py-2.5 font-medium ${bpHigh ? 'text-red-600' : 'text-gray-700'}`}>
                          {row.vitals.bp}
                          {bpHigh && <span className="ml-1 text-[10px] text-red-500">고</span>}
                        </td>
                        <td className="px-4 py-2.5 text-gray-700">{row.vitals.hr}</td>
                        <td className="px-4 py-2.5 text-gray-700">{row.vitals.temp}</td>
                        <td className={`px-4 py-2.5 font-medium ${sugarHigh ? 'text-orange-600' : 'text-gray-700'}`}>
                          {row.vitals.sugar}
                          {sugarHigh && <span className="ml-1 text-[10px] text-orange-500">고</span>}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">{row.manager}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DEVICE TAB */}
      {segment === 'device' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{devices.length}</div>
              <div className="text-xs text-gray-500 mt-1">전체 장치</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{deviceStatusCount['정상']}</div>
              <div className="text-xs text-gray-500 mt-1">정상</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{deviceStatusCount['경고']}</div>
              <div className="text-xs text-gray-500 mt-1">경고</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-gray-500">{deviceStatusCount['오프라인']}</div>
              <div className="text-xs text-gray-500 mt-1">오프라인</div>
            </div>
          </div>

          {/* Warning/offline alert */}
          {(deviceStatusCount['경고'] > 0 || deviceStatusCount['오프라인'] > 0) && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-orange-800 mb-2">주의 필요 장치</h3>
              <div className="space-y-1.5">
                {devices.filter(d => d.status !== '정상').map(d => (
                  <div key={d.id} className="flex items-center gap-3 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${deviceStatusStyle(d.status)}`}>{d.status}</span>
                    <span className="font-medium text-gray-800">{d.name}</span>
                    <span className="text-gray-500">{d.residentName} ({d.room})</span>
                    {d.status === '경고' && <span className="text-orange-600 text-xs">배터리 {d.battery}%</span>}
                    {d.status === '오프라인' && <span className="text-gray-500 text-xs">마지막 연결: {d.lastSeen}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Type filter */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            {deviceTypes.map(t => (
              <button
                key={t}
                onClick={() => setDeviceFilter(t)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  deviceFilter === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">장치 목록</h3>
              <span className="text-xs text-gray-500">{filteredDevices.length}개</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">장치명</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">유형</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">시리얼번호</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">입소자명</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">호실</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">상태</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">배터리</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">마지막 연결</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.map(d => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-900">{d.name}</td>
                      <td className="px-4 py-2.5 text-gray-600">{d.type}</td>
                      <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">{d.serialNo}</td>
                      <td className="px-4 py-2.5 text-gray-700">{d.residentName}</td>
                      <td className="px-4 py-2.5 text-gray-600">{d.room}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${deviceStatusStyle(d.status)}`}>{d.status}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        {d.status === '오프라인' ? (
                          <span className="text-gray-400 text-xs">-</span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${d.battery > 50 ? 'bg-green-500' : d.battery > 20 ? 'bg-orange-400' : 'bg-red-500'}`}
                                style={{ width: `${d.battery}%` }}
                              />
                            </div>
                            <span className={`text-xs font-medium ${d.battery <= 20 ? 'text-red-600' : 'text-gray-600'}`}>{d.battery}%</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">{d.lastSeen}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex gap-1">
                          {d.status === '오프라인' && (
                            <button
                              onClick={() => setDevices(prev => prev.map(x => x.id === d.id ? { ...x, status: '정상', battery: 80, lastSeen: '2026-03-30 09:10' } : x))}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              재연결
                            </button>
                          )}
                          {d.status === '경고' && (
                            <button
                              onClick={() => setDevices(prev => prev.map(x => x.id === d.id ? { ...x, status: '정상' } : x))}
                              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              확인
                            </button>
                          )}
                          <button
                            onClick={() => setDevices(prev => prev.filter(x => x.id !== d.id))}
                            className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDevices.length === 0 && (
                    <tr><td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-400">장치가 없습니다.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fallback */}
      {segment !== 'register' && segment !== 'status' && segment !== 'device' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{activeData.length}</div>
              <div className="text-xs text-gray-500 mt-1">전체 대상자</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{gradeCount['상']}</div>
              <div className="text-xs text-gray-500 mt-1">상 (긴급)</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{gradeCount['중']}</div>
              <div className="text-xs text-gray-500 mt-1">중 (주의)</div>
            </div>
            <div className="bg-white rounded-lg shadow border p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{gradeCount['하']}</div>
              <div className="text-xs text-gray-500 mt-1">하 (관찰)</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeData.map((resident) => {
              const style = gradeStyle(resident.grade);
              return (
                <div key={resident.id} className={`rounded-lg border-2 ${style.border} ${style.bg} p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{resident.name}</h3>
                      <p className="text-xs text-gray-500">{resident.room}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${style.badge}`}>{resident.grade}등급</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">관리사유</span>
                      <p className="text-sm text-gray-700">{resident.reason}</p>
                    </div>
                    <div className="text-xs text-gray-500">기간: {resident.period}</div>
                    <div className="text-xs text-gray-500">담당: {resident.manager}</div>
                  </div>
                  <div className="border-t pt-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">최근 바이탈</span>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      <div className="text-center"><div className="text-[10px] text-gray-400">혈압</div><div className={`text-xs font-semibold ${parseInt(resident.vitals.bp) > 140 ? 'text-red-600' : 'text-gray-700'}`}>{resident.vitals.bp}</div></div>
                      <div className="text-center"><div className="text-[10px] text-gray-400">심박</div><div className="text-xs font-semibold text-gray-700">{resident.vitals.hr}</div></div>
                      <div className="text-center"><div className="text-[10px] text-gray-400">체온</div><div className="text-xs font-semibold text-gray-700">{resident.vitals.temp}</div></div>
                      <div className="text-center"><div className="text-[10px] text-gray-400">혈당</div><div className={`text-xs font-semibold ${parseInt(resident.vitals.sugar) > 140 ? 'text-orange-600' : 'text-gray-700'}`}>{resident.vitals.sugar}</div></div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t">
                    <button onClick={() => handleComplete(resident.id)} className="w-full px-3 py-1.5 text-xs bg-green-500 text-white rounded hover:bg-green-600 font-medium">완료</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? '수정' : '대상자 등록'}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <select value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {residentOptions.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관리사유</label>
                <input type="text" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관리등급</label>
                <select value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value as '상' | '중' | '하' })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="상">상 (긴급)</option>
                  <option value="중">중 (주의)</option>
                  <option value="하">하 (관찰)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                <select value={formData.manager} onChange={e => setFormData({ ...formData, manager: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {managerOptions.map(m => <option key={m} value={m}>{m}</option>)}
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
    </div>
  );
}
