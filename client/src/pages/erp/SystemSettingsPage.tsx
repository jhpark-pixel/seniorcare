import React, { useState } from 'react';

const tabs = ['기본정보', '코드관리', '요금설정', '알림설정'] as const;
type Tab = typeof tabs[number];

const facilityInfo = {
  name: '케어닥 케어홈 배곧신도시점',
  address: '경기도 시흥시 배곧신도시로 123, 케어닥빌딩',
  ceo: '홍길동',
  bizNumber: '123-45-67890',
  phone: '031-123-4567',
  fax: '031-123-4568',
  email: 'baegot@caredoc.kr',
  capacity: '89',
  openDate: '2023-06-01',
};

const feeTable = [
  { type: '1인실 (A타입)', deposit: '5,000만원', monthly: '280만원', meal: '45만원', utility: '15만원', total: '340만원' },
  { type: '1인실 (B타입)', deposit: '4,000만원', monthly: '250만원', meal: '45만원', utility: '15만원', total: '310만원' },
  { type: '2인실 (A타입)', deposit: '3,000만원', monthly: '200만원', meal: '45만원', utility: '12만원', total: '257만원' },
  { type: '2인실 (B타입)', deposit: '2,500만원', monthly: '180만원', meal: '45만원', utility: '12만원', total: '237만원' },
  { type: '특실', deposit: '8,000만원', monthly: '400만원', meal: '55만원', utility: '20만원', total: '475만원' },
];

const codeCategories = [
  { category: '입소자 상태', codes: ['재실', '외출', '입원', '퇴소'] },
  { category: '프로그램 분류', codes: ['건강재활', '운동', '인지', '문화', '사회', '외부'] },
  { category: '상담 유형', codes: ['전화', '방문', '온라인'] },
  { category: '서비스 요청', codes: ['시설보수', '의료요청', '식사변경', '외출신청', '물품요청'] },
];

const alertSettings = [
  { name: '낙상 감지 알림', target: '간호사, 시설장', method: '앱 푸시 + SMS', enabled: true },
  { name: '바이탈 이상 알림', target: '담당 간호사', method: '앱 푸시', enabled: true },
  { name: '미납 알림', target: '시설장', method: '이메일', enabled: true },
  { name: '입퇴소 알림', target: '전체 직원', method: '앱 푸시', enabled: false },
  { name: '프로그램 알림', target: '생활지도사', method: '앱 푸시', enabled: true },
  { name: '야간 이상행동 알림', target: '야간 당직자', method: '앱 푸시 + SMS', enabled: true },
];

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('기본정보');
  const [form, setForm] = useState(facilityInfo);
  const [alerts, setAlerts] = useState(alertSettings);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAlert = (index: number) => {
    setAlerts((prev) => prev.map((a, i) => i === index ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">시스템설정</h1>
        <p className="mt-1 text-sm text-gray-500">시설 기본정보, 코드, 요금, 알림을 설정합니다.</p>
      </div>

      {/* 탭 */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#F0835A] text-[#F0835A]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* 기본정보 */}
      {activeTab === '기본정보' && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">시설 기본정보</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '시설명', field: 'name' },
              { label: '대표자', field: 'ceo' },
              { label: '주소', field: 'address' },
              { label: '사업자번호', field: 'bizNumber' },
              { label: '전화번호', field: 'phone' },
              { label: '팩스번호', field: 'fax' },
              { label: '이메일', field: 'email' },
              { label: '정원(실)', field: 'capacity' },
              { label: '개원일', field: 'openDate' },
            ].map((item) => (
              <div key={item.field} className={item.field === 'address' ? 'col-span-2' : ''}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{item.label}</label>
                <input
                  type="text"
                  value={(form as any)[item.field]}
                  onChange={(e) => handleChange(item.field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F0835A] focus:border-[#F0835A] outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
              저장
            </button>
          </div>
        </div>
      )}

      {/* 코드관리 */}
      {activeTab === '코드관리' && (
        <div className="space-y-4">
          {codeCategories.map((cat) => (
            <div key={cat.category} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">{cat.category}</h3>
                <button className="text-xs text-[#F0835A] hover:underline font-medium">+ 코드 추가</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.codes.map((code) => (
                  <span key={code} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-200 cursor-default">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 요금설정 */}
      {activeTab === '요금설정' && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">호실 유형별 요금표</h3>
            <button className="text-xs text-[#F0835A] hover:underline font-medium">+ 요금 유형 추가</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">호실 유형</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">보증금</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">월 관리비</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">식사비</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">수도광열비</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">월 합계</th>
              </tr>
            </thead>
            <tbody>
              {feeTable.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.type}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.deposit}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.monthly}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.meal}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.utility}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-700">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 알림설정 */}
      {activeTab === '알림설정' && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">알림 설정</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">알림 유형</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">수신 대상</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">발송 방법</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">활성화</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{alert.name}</td>
                  <td className="px-4 py-3 text-gray-700">{alert.target}</td>
                  <td className="px-4 py-3 text-gray-700">{alert.method}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleAlert(i)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        alert.enabled ? 'bg-[#F0835A]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          alert.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
