import React from 'react';

const statusColor: Record<string, string> = {
  '대기': 'bg-yellow-100 text-yellow-800',
  '완료': 'bg-green-100 text-green-800',
  '취소': 'bg-red-100 text-red-800',
};

const typeColor: Record<string, string> = {
  '전화': 'bg-blue-100 text-blue-700',
  '방문': 'bg-purple-100 text-purple-700',
  '온라인': 'bg-teal-100 text-teal-700',
};

const mockData = [
  { date: '2026-03-28 10:00', name: '김영호', phone: '010-3456-7890', type: '전화', summary: '어머니 입소 관련 비용 및 시설 안내 요청', result: '자료 발송 완료', next: '2026-04-02 14:00', status: '완료' },
  { date: '2026-03-28 11:30', name: '이정숙', phone: '010-9876-5432', type: '방문', summary: '1인실 시설 견학 및 케어 프로그램 문의', result: '시설 투어 완료, 청약 안내', next: '2026-04-01 10:00', status: '완료' },
  { date: '2026-03-27 14:00', name: '박현우', phone: '010-1234-5678', type: '전화', summary: '아버지 치매 등급 관련 입소 가능 여부 문의', result: '등급 확인 후 회신 예정', next: '2026-03-31 09:00', status: '대기' },
  { date: '2026-03-27 16:00', name: '최미영', phone: '010-5555-1234', type: '온라인', summary: '2인실 비용 및 보증금 납부 조건 문의', result: '이메일 안내 발송', next: '-', status: '완료' },
  { date: '2026-03-26 09:30', name: '정대호', phone: '010-2222-3333', type: '방문', summary: '부모님 동반 입소 가능 여부 상담', result: '2인실 배정 가능 안내', next: '2026-04-03 11:00', status: '대기' },
  { date: '2026-03-25 13:00', name: '한서연', phone: '010-7777-8888', type: '전화', summary: '장기요양등급 신청 절차 안내 요청', result: '등급 신청 가이드 발송', next: '-', status: '완료' },
  { date: '2026-03-25 15:30', name: '윤재석', phone: '010-4444-5555', type: '온라인', summary: '입소 후 외부 병원 진료 동행 서비스 문의', result: '서비스 내용 안내 완료', next: '-', status: '완료' },
  { date: '2026-03-24 10:00', name: '송미라', phone: '010-6666-7777', type: '방문', summary: '어머니 단기 입소(1개월) 가능 여부 상담', result: '단기 입소 계약 조건 안내', next: '2026-03-30 14:00', status: '대기' },
  { date: '2026-03-23 11:00', name: '오성호', phone: '010-8888-9999', type: '전화', summary: '입소 대기 신청 및 예상 대기 기간 문의', result: '현재 대기 2명 안내', next: '-', status: '취소' },
  { date: '2026-03-22 14:30', name: '임지현', phone: '010-1111-2222', type: '방문', summary: '시설 식단 및 영양 관리 프로그램 문의', result: '주간 식단표 제공, 영양사 면담 안내', next: '2026-03-29 10:00', status: '완료' },
];

export default function CounselingPage() {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상담관리</h1>
          <p className="mt-1 text-sm text-gray-500">입소 상담 내역을 관리하고 일정을 추적합니다.</p>
        </div>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
          + 신규 상담등록
        </button>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상담일시</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상담자명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상담유형</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상담내용</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">결과</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">다음일정</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.date}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-gray-700">{row.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${typeColor[row.type]}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{row.summary}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{row.result}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.next}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor[row.status]}`}>
                      {row.status}
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
