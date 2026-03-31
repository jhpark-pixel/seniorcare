import React from 'react';

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

const specialDiets: SpecialDiet[] = [
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

export default function SpecialDietPage() {
  const activeDiets = specialDiets.filter(d => d.status === '활성');
  const typeCounts: Record<string, number> = {};
  activeDiets.forEach(d => {
    typeCounts[d.dietType] = (typeCounts[d.dietType] || 0) + 1;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">특별식 관리</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(dietTypeColors).map(([type, color]) => (
          <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mb-2 ${color}`}>{type}</span>
            <p className="text-3xl font-bold text-gray-900">{typeCounts[type] || 0}<span className="text-base font-normal text-gray-500">명</span></p>
          </div>
        ))}
      </div>

      {/* Total active */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <span className="text-2xl font-bold text-orange-700">{activeDiets.length}</span>
        <span className="text-sm text-orange-700">명의 입소자가 현재 특별식을 제공받고 있습니다.</span>
      </div>

      {/* Table */}
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
              </tr>
            </thead>
            <tbody>
              {specialDiets.map(diet => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
