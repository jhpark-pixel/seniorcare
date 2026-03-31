import React, { useState } from 'react';

interface SpecialDiet {
  id: string;
  residentName: string;
  room: string;
  dietType: '저염식' | '저당식' | '연하곤란식' | '저단백식' | '채식';
  reason: string;
  startDate: string;
  note: string;
  status: '활성' | '종료';
}

const initialDiets: SpecialDiet[] = [
  { id: '1', residentName: '김영숙', room: '101호', dietType: '저염식', reason: '고혈압 (150/95mmHg)', startDate: '2025-06-15', note: '국물류 염분 50% 감량', status: '활성' },
  { id: '2', residentName: '이순자', room: '203호', dietType: '저당식', reason: '제2형 당뇨 (HbA1c 7.2%)', startDate: '2025-08-20', note: '밥 2/3 배식, 과일 1회/일 제한', status: '활성' },
  { id: '3', residentName: '박정희', room: '105호', dietType: '연하곤란식', reason: '뇌졸중 후유증 삼킴장애', startDate: '2025-11-03', note: '다진식 또는 죽식, 물 토로미 첨가', status: '활성' },
  { id: '4', residentName: '최옥순', room: '302호', dietType: '채식', reason: '개인 신념 (불교)', startDate: '2025-03-01', note: '육류 대체 두부/콩류 제공', status: '활성' },
  { id: '5', residentName: '한미경', room: '207호', dietType: '저단백식', reason: '만성신부전 3기', startDate: '2025-09-10', note: '단백질 40g/일 이하, 칼륨 제한', status: '활성' },
  { id: '6', residentName: '윤정자', room: '304호', dietType: '저염식', reason: '심부전 관리', startDate: '2025-07-22', note: '나트륨 2g/일 이하', status: '활성' },
  { id: '7', residentName: '강순옥', room: '102호', dietType: '저당식', reason: '제2형 당뇨 (식이요법)', startDate: '2025-04-18', note: '간식 제한, 잡곡밥 제공', status: '활성' },
  { id: '8', residentName: '정복순', room: '201호', dietType: '연하곤란식', reason: '파킨슨병 진행', startDate: '2025-10-05', note: '2026-02-28 일반식 전환 완료', status: '종료' },
];

const dietTypeColors: Record<string, string> = {
  '저염식': 'bg-blue-100 text-blue-800',
  '저당식': 'bg-yellow-100 text-yellow-800',
  '연하곤란식': 'bg-red-100 text-red-800',
  '저단백식': 'bg-purple-100 text-purple-800',
  '채식': 'bg-green-100 text-green-800',
};

const statusColors: Record<string, string> = {
  '활성': 'bg-emerald-100 text-emerald-800',
  '종료': 'bg-gray-100 text-gray-500',
};

const emptyForm = { residentName: '', room: '', dietType: '저염식' as SpecialDiet['dietType'], reason: '', startDate: '' };

export default function SpecialDietPage() {
  const [diets, setDiets] = useState<SpecialDiet[]>(initialDiets);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const activeDiets = diets.filter(d => d.status === '활성');
  const typeCounts: Record<string, number> = {};
  activeDiets.forEach(d => {
    typeCounts[d.dietType] = (typeCounts[d.dietType] || 0) + 1;
  });

  const handleSave = () => {
    const newDiet: SpecialDiet = {
      id: crypto.randomUUID(),
      residentName: formData.residentName,
      room: formData.room,
      dietType: formData.dietType,
      reason: formData.reason,
      startDate: formData.startDate,
      note: '',
      status: '활성',
    };
    setDiets(prev => [newDiet, ...prev]);
    setFormData(emptyForm);
    setShowModal(false);
  };

  const handleEnd = (id: string) => {
    setDiets(prev => prev.map(d => d.id === id ? { ...d, status: '종료' as const, note: `${new Date().toISOString().slice(0, 10)} 종료` } : d));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">특별식 관리</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#d9714d]">
          + 특별식 등록
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(dietTypeColors).map(([type, color]) => (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mb-2 ${color}`}>{type}</span>
            <p className="text-3xl font-bold text-gray-900">{typeCounts[type] || 0}<span className="text-base font-normal text-gray-500">명</span></p>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
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
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">비고</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody>
              {diets.map(diet => (
                <tr key={diet.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{diet.residentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{diet.room}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${dietTypeColors[diet.dietType]}`}>
                      {diet.dietType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{diet.reason}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{diet.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{diet.note}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[diet.status]}`}>
                      {diet.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {diet.status === '활성' && (
                      <button onClick={() => handleEnd(diet.id)} className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600">종료</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">특별식 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">입소자명</label>
                <input type="text" value={formData.residentName} onChange={e => setFormData({ ...formData, residentName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">호실</label>
                <input type="text" value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">특별식 유형</label>
                <select value={formData.dietType} onChange={e => setFormData({ ...formData, dietType: e.target.value as SpecialDiet['dietType'] })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>저염식</option>
                  <option>저당식</option>
                  <option>연하곤란식</option>
                  <option>저단백식</option>
                  <option>채식</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사유</label>
                <input type="text" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
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
