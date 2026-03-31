import React, { useState } from 'react';

type ReportType = '월간' | '분기' | '연간' | '커스텀';
type ReportStatus = '완료' | '생성중';

interface Report {
  id: string;
  name: string;
  type: ReportType;
  period: string;
  createdAt: string;
  creator: string;
  status: ReportStatus;
}

const typeColor: Record<ReportType, string> = {
  '월간': 'bg-blue-100 text-blue-700',
  '분기': 'bg-purple-100 text-purple-700',
  '연간': 'bg-green-100 text-green-700',
  '커스텀': 'bg-orange-100 text-orange-700',
};

const statusColor: Record<ReportStatus, string> = {
  '완료': 'bg-green-100 text-green-700',
  '생성중': 'bg-yellow-100 text-yellow-700',
};

const mockReports: Report[] = [
  { id: '1', name: '2026년 3월 운영현황 보고서', type: '월간', period: '2026.03.01 ~ 2026.03.31', createdAt: '2026-03-30', creator: '홍길동', status: '생성중' },
  { id: '2', name: '2026년 1분기 경영실적 보고서', type: '분기', period: '2026.01.01 ~ 2026.03.31', createdAt: '2026-03-28', creator: '홍길동', status: '완료' },
  { id: '3', name: '2026년 2월 운영현황 보고서', type: '월간', period: '2026.02.01 ~ 2026.02.28', createdAt: '2026-03-01', creator: '홍길동', status: '완료' },
  { id: '4', name: '2025년 연간 경영실적 보고서', type: '연간', period: '2025.01.01 ~ 2025.12.31', createdAt: '2026-01-15', creator: '홍길동', status: '완료' },
  { id: '5', name: '낙상사고 분석 특별보고서', type: '커스텀', period: '2025.10.01 ~ 2026.03.15', createdAt: '2026-03-20', creator: '김간호', status: '완료' },
];

export default function ReportPage() {
  const [reports] = useState<Report[]>(mockReports);
  const [filterType, setFilterType] = useState<ReportType | '전체'>('전체');

  const filtered = filterType === '전체' ? reports : reports.filter((r) => r.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">경영 리포트</h1>
          <p className="mt-1 text-sm text-gray-500">생성된 경영 보고서를 확인하고 새 보고서를 생성합니다.</p>
        </div>
        <button className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
          + 새 보고서 생성
        </button>
      </div>

      {/* 필터 */}
      <div className="flex gap-2">
        {(['전체', '월간', '분기', '연간', '커스텀'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              filterType === type
                ? 'bg-[#F0835A] text-white border-[#F0835A]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-xs text-blue-600 font-medium">전체 보고서</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{reports.length}건</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-xs text-green-600 font-medium">완료</div>
          <div className="text-2xl font-bold text-green-700 mt-1">{reports.filter((r) => r.status === '완료').length}건</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-xs text-yellow-600 font-medium">생성중</div>
          <div className="text-2xl font-bold text-yellow-700 mt-1">{reports.filter((r) => r.status === '생성중').length}건</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-xs text-purple-600 font-medium">이번 달 생성</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">2건</div>
        </div>
      </div>

      {/* 보고서 테이블 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-600">보고서명</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">유형</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">기간</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">생성일</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">생성자</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">상태</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{report.name}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${typeColor[report.type]}`}>
                    {report.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{report.period}</td>
                <td className="px-4 py-3 text-center text-gray-700">{report.createdAt}</td>
                <td className="px-4 py-3 text-center text-gray-700">{report.creator}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColor[report.status]}`}>
                    {report.status === '생성중' && '⏳ '}{report.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {report.status === '완료' ? (
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-xs text-blue-600 hover:underline font-medium">보기</button>
                      <button className="text-xs text-green-600 hover:underline font-medium">다운로드</button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">생성 대기중...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
