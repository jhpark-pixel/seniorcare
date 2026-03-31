import React, { useState } from 'react';

export default function ExcelExportPage() {
  const [categories, setCategories] = useState({
    basic: true,
    health: true,
    medication: false,
    program: false,
    finance: false,
  });
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-03-30');
  const [format, setFormat] = useState('excel');

  const toggleCategory = (key: keyof typeof categories) => {
    setCategories({ ...categories, [key]: !categories[key] });
  };

  const categoryLabels: { key: keyof typeof categories; label: string; desc: string }[] = [
    { key: 'basic', label: '기본정보', desc: '이름, 호실, 나이, 성별, 입소일, 상태 등' },
    { key: 'health', label: '건강기록', desc: '혈압, 혈당, 체온, 체중, 수면, 수분 등' },
    { key: 'medication', label: '투약정보', desc: '투약 내역, 복약 일정, 부작용 기록 등' },
    { key: 'program', label: '프로그램참여', desc: '프로그램명, 참여일, 출석률, 평가 등' },
    { key: 'finance', label: '재무정보', desc: '월별 청구액, 수납액, 미수금, 보증금 등' },
  ];

  const selectedCount = Object.values(categories).filter(Boolean).length;

  const handleDownload = () => {
    const selected = categoryLabels.filter((c) => categories[c.key]).map((c) => c.label);
    alert(`다운로드를 시작합니다. (데모)\n\n선택 항목: ${selected.join(', ')}\n기간: ${startDate} ~ ${endDate}\n형식: ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">엑셀 일괄 다운로드</h1>
        <p className="mt-1 text-sm text-gray-500">원하는 데이터를 선택하여 일괄 다운로드합니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 데이터 항목 선택 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">데이터 항목 선택</h2>
          <div className="space-y-3">
            {categoryLabels.map((c) => (
              <label key={c.key} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${categories[c.key] ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={categories[c.key]}
                  onChange={() => toggleCategory(c.key)}
                  className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.desc}</div>
                </div>
              </label>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-500">{selectedCount}개 항목 선택됨</div>
        </div>

        {/* 다운로드 설정 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">기간 설정</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">파일 형식</h2>
            <div className="space-y-2">
              {[
                { value: 'excel', label: 'Excel (.xlsx)', desc: 'Microsoft Excel 형식' },
                { value: 'csv', label: 'CSV (.csv)', desc: '쉼표 구분 텍스트' },
                { value: 'pdf', label: 'PDF (.pdf)', desc: 'PDF 문서 형식' },
              ].map((f) => (
                <label key={f.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${format === f.value ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="format"
                    value={f.value}
                    checked={format === f.value}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{f.label}</div>
                    <div className="text-xs text-gray-500">{f.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={selectedCount === 0}
            className={`w-full py-3 text-sm font-medium rounded-md ${selectedCount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            다운로드
          </button>
        </div>
      </div>
    </div>
  );
}
