import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateId } from '../../data/mockData';
import { useResidents } from '../../context/AppStateContext';

interface SpecialDiet {
  id: string;
  residentId: string;
  residentName: string;
  room: string;
  dietType: string;
  reason: string;
  startDate: string;
  note: string;
  status: '활성' | '종료';
}

const dietTypeColors: Record<string, string> = {
  '저염식': 'bg-blue-100 text-blue-800',
  '저당식': 'bg-yellow-100 text-yellow-800',
  '연하식(다진식)': 'bg-red-100 text-red-800',
  '연하식(미음)': 'bg-red-200 text-red-900',
  '저단백식': 'bg-purple-100 text-purple-800',
  '저지방식': 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  '활성': 'bg-emerald-100 text-emerald-800',
  '종료': 'bg-gray-100 text-gray-500',
};

const dietTypeOptions = ['저염식', '저당식', '연하식(다진식)', '연하식(미음)', '저단백식', '저지방식'];
const emptyForm = { residentId: '', dietType: '저염식', reason: '', startDate: '' };

const tabs = [
  { id: 'targets', label: '특별식 대상자', path: '/meal/special/targets' },
  { id: 'types', label: '특별식 유형 관리', path: '/meal/special/types' },
  { id: 'status', label: '신청 현황', path: '/meal/special/status' },
];

export default function SpecialDietPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [residents] = useResidents();
  const activeResidents = useMemo(() => residents.filter(r => r.status !== 'DISCHARGED'), [residents]);

  const initialDiets = useMemo<SpecialDiet[]>(() => {
    const result: SpecialDiet[] = [];
    residents.forEach(r => {
      if (r.dietaryRestrictions.length === 0) return;
      r.dietaryRestrictions.forEach((diet, idx) => {
        result.push({
          id: `init-${r.id}-${idx}`,
          residentId: r.id,
          residentName: r.name,
          room: `${r.building} ${r.roomNumber}호`,
          dietType: diet,
          reason: r.diseases.slice(0, 2).join(', ') || '개인 요청',
          startDate: r.moveInDate,
          note: idx === 0 ? `${r.dietaryRestrictions.join(' + ')} 적용` : '',
          status: r.status === 'DISCHARGED' ? '종료' : '활성',
        });
      });
    });
    return result;
  }, [residents]);

  const [diets, setDiets] = useState<SpecialDiet[]>(initialDiets);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState<'전체' | '활성' | '종료'>('전체');

  const activeDiets = diets.filter(d => d.status === '활성');
  const filteredDiets = filterStatus === '전체' ? diets : diets.filter(d => d.status === filterStatus);

  const typeCounts: Record<string, number> = {};
  activeDiets.forEach(d => {
    typeCounts[d.dietType] = (typeCounts[d.dietType] || 0) + 1;
  });

  const handleSave = () => {
    if (!formData.residentId || !formData.dietType) return;
    const res = residents.find(r => r.id === formData.residentId);
    if (!res) return;
    const newDiet: SpecialDiet = {
      id: generateId('sd'),
      residentId: res.id,
      residentName: res.name,
      room: `${res.building} ${res.roomNumber}호`,
      dietType: formData.dietType,
      reason: formData.reason,
      startDate: formData.startDate || new Date().toISOString().slice(0, 10),
      note: '',
      status: '활성',
    };
    setDiets(prev => [newDiet, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const handleEnd = (id: string) => {
    setDiets(prev => prev.map(d =>
      d.id === id ? { ...d, status: '종료' as const, note: `${new Date().toISOString().slice(0, 10)} 종료` } : d
    ));
  };

  const handleDelete = (id: string) => {
    setDiets(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">특별식 관리</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#d9714d]">
          + 특별식 등록
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

      {/* targets: 특별식 대상자 목록 */}
      {segment === 'targets' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {dietTypeOptions.map(type => (
              <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
                <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mb-2 ${dietTypeColors[type] ?? 'bg-gray-100 text-gray-700'}`}>{type}</span>
                <p className="text-3xl font-bold text-gray-900">{typeCounts[type] || 0}<span className="text-base font-normal text-gray-500">명</span></p>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-orange-700">{activeDiets.length}</span>
            <span className="text-sm text-orange-700">명의 입소자가 현재 특별식을 제공받고 있습니다.</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">입소자명</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">호실</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">특별식 유형</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">사유</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">시작일</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDiets.map(diet => (
                    <tr key={diet.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{diet.residentName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{diet.room}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${dietTypeColors[diet.dietType] ?? 'bg-gray-100 text-gray-700'}`}>{diet.dietType}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{diet.reason}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{diet.startDate}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[diet.status]}`}>{diet.status}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleEnd(diet.id)} className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">종료</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* types: 특별식 유형 관리 */}
      {segment === 'types' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">특별식 유형 목록</h2>
              <button className="px-3 py-1.5 bg-[#F0835A] text-white rounded-lg text-xs font-medium hover:bg-[#d9714d]">+ 유형 추가</button>
            </div>
            <div className="space-y-3">
              {dietTypeOptions.map(type => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded ${dietTypeColors[type] ?? 'bg-gray-100 text-gray-700'}`}>{type}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {type === '저염식' ? '나트륨 제한 식이 (1,500mg/일 이하)' :
                         type === '저당식' ? '당류 제한 식이 (30g/일 이하)' :
                         type === '연하식(다진식)' ? '연하곤란 대상 다진 형태 제공' :
                         type === '연하식(미음)' ? '연하곤란 중증 미음 형태 제공' :
                         type === '저단백식' ? '단백질 제한 식이 (40g/일 이하)' :
                         '지방 제한 식이 (30g/일 이하)'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">현재 적용: {typeCounts[type] || 0}명</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">수정</button>
                    <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">유형 관리 안내</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>새 유형 추가 시 담당 영양사 승인이 필요합니다.</li>
              <li>기존 유형 수정 시 해당 유형을 적용 중인 입소자 식단이 자동 갱신됩니다.</li>
              <li>적용 중인 입소자가 있는 유형은 삭제할 수 없습니다.</li>
            </ul>
          </div>
        </div>
      )}

      {/* status: 특별식 신청 현황 */}
      {segment === 'status' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {(['전체', '활성', '종료'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === s ? 'bg-[#F0835A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
                <span className="ml-1 text-xs opacity-70">
                  ({s === '전체' ? diets.length : diets.filter(d => d.status === s).length})
                </span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">입소자명</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">호실</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">특별식 유형</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">사유</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">시작일</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">비고</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDiets.map(diet => (
                    <tr key={diet.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{diet.residentName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{diet.room}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${dietTypeColors[diet.dietType] ?? 'bg-gray-100 text-gray-700'}`}>{diet.dietType}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{diet.reason}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{diet.startDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{diet.note}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[diet.status]}`}>{diet.status}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          {diet.status === '활성' && (
                            <button onClick={() => handleEnd(diet.id)} className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">종료</button>
                          )}
                          <button onClick={() => handleDelete(diet.id)} className="px-2 py-1 text-xs bg-red-400 text-white rounded hover:bg-red-500">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDiets.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">해당하는 특별식 항목이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">특별식 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자 선택</label>
                <select
                  value={formData.residentId}
                  onChange={e => setFormData({ ...formData, residentId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                >
                  <option value="">-- 선택 --</option>
                  {activeResidents.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.building} {r.roomNumber}호)</option>
                  ))}
                </select>
                {formData.residentId && (() => {
                  const res = residents.find(r => r.id === formData.residentId);
                  if (!res || res.dietaryRestrictions.length === 0) return null;
                  return (
                    <p className="mt-1 text-xs text-blue-600">기존 식이제한: {res.dietaryRestrictions.join(', ')}</p>
                  );
                })()}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">특별식 유형</label>
                <select
                  value={formData.dietType}
                  onChange={e => setFormData({ ...formData, dietType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                >
                  {dietTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사유</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="진단명 또는 사유"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => { setShowModal(false); setFormData(emptyForm); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
