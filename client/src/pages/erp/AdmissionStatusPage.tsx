import React from 'react';

const summaryCards = [
  { label: '총 입소자', value: 48, color: 'text-gray-900', bg: 'bg-blue-50' },
  { label: '현재 입주중', value: 38, color: 'text-green-600', bg: 'bg-green-50' },
  { label: '외출중', value: 3, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: '입원중', value: 2, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: '퇴소', value: 5, color: 'text-red-600', bg: 'bg-red-50' },
];

const recentAdmissions = [
  { name: '김영순', room: '1관 301호', date: '2026-03-15', reason: '노인성 질환 관리', guardian: '김철수 (장남)' },
  { name: '이순자', room: '2관 205호', date: '2026-03-10', reason: '독거노인 보호', guardian: '이미영 (장녀)' },
  { name: '박정희', room: '1관 402호', date: '2026-02-28', reason: '치매 초기 관리', guardian: '박준호 (차남)' },
  { name: '최옥순', room: '2관 103호', date: '2026-02-20', reason: '거동 불편', guardian: '최수정 (장녀)' },
  { name: '정미숙', room: '1관 201호', date: '2026-02-15', reason: '가족 요청', guardian: '정민호 (장남)' },
];

const recentDischarges = [
  { name: '한순이', room: '2관 302호', date: '2026-03-20', reason: '건강 호전으로 자택 복귀', guardian: '한지민 (장녀)' },
  { name: '서복순', room: '2관 401호', date: '2026-03-05', reason: '타 시설 이전', guardian: '서영호 (장남)' },
  { name: '강말숙', room: '1관 105호', date: '2026-02-25', reason: '가족 요청 퇴소', guardian: '강민수 (차남)' },
];

export default function AdmissionStatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">입퇴소자현황</h1>
        <p className="mt-1 text-sm text-gray-500">입소 및 퇴소 현황을 한눈에 확인합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-5 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`${c.bg} rounded-lg shadow border border-gray-200 p-5`}>
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}명</div>
          </div>
        ))}
      </div>

      {/* 최근 입소자 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 입소자</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['이름', '호실', '입소일', '사유', '보호자'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAdmissions.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.guardian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 최근 퇴소자 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">최근 퇴소자</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['이름', '호실', '퇴소일', '사유', '보호자'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentDischarges.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.guardian}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
