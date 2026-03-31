import React from 'react';

const mockData = [
  {
    id: 1, name: '김영순', room: '1관 301호', reason: '고혈압 + 당뇨 복합 관리', grade: '상',
    period: '2026-01-15 ~ 현재', manager: '간호사 김미영',
    vitals: { bp: '148/92', hr: '78', temp: '36.4', sugar: '165' },
  },
  {
    id: 2, name: '이순자', room: '2관 205호', reason: '당뇨 인슐린 집중 관리', grade: '상',
    period: '2026-02-01 ~ 현재', manager: '간호사 이정은',
    vitals: { bp: '132/84', hr: '72', temp: '36.6', sugar: '198' },
  },
  {
    id: 3, name: '박정희', room: '1관 402호', reason: '치매 진행 관찰 및 안전 관리', grade: '상',
    period: '2025-11-10 ~ 현재', manager: '간호사 김미영',
    vitals: { bp: '126/78', hr: '68', temp: '36.5', sugar: '102' },
  },
  {
    id: 4, name: '한순이', room: '2관 302호', reason: '심장질환 와파린 복용 모니터링', grade: '중',
    period: '2026-02-15 ~ 현재', manager: '간호사 이정은',
    vitals: { bp: '118/74', hr: '64', temp: '36.3', sugar: '95' },
  },
  {
    id: 5, name: '정미숙', room: '1관 201호', reason: '낙상 고위험 + 수면장애', grade: '중',
    period: '2026-03-01 ~ 현재', manager: '간호사 김미영',
    vitals: { bp: '122/76', hr: '70', temp: '36.5', sugar: '108' },
  },
  {
    id: 6, name: '강순덕', room: '2관 401호', reason: '퇴원 후 회복기 관찰', grade: '하',
    period: '2026-03-20 ~ 현재', manager: '간호사 이정은',
    vitals: { bp: '120/78', hr: '74', temp: '36.7', sugar: '100' },
  },
];

const gradeStyle = (grade: string) => {
  const map: Record<string, { border: string; bg: string; badge: string }> = {
    '상': { border: 'border-red-300', bg: 'bg-red-50', badge: 'bg-red-500 text-white' },
    '중': { border: 'border-orange-300', bg: 'bg-orange-50', badge: 'bg-orange-500 text-white' },
    '하': { border: 'border-yellow-300', bg: 'bg-yellow-50', badge: 'bg-yellow-500 text-white' },
  };
  return map[grade] || { border: 'border-gray-300', bg: 'bg-gray-50', badge: 'bg-gray-500 text-white' };
};

export default function IntensiveCarePage() {
  const gradeCount = { '상': 0, '중': 0, '하': 0 };
  mockData.forEach(d => { gradeCount[d.grade as keyof typeof gradeCount]++; });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">집중케어</h1>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#e0734a]">
          + 대상자 등록
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{mockData.length}</div>
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
        {mockData.map((resident) => {
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
