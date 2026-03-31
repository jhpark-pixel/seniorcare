import React from 'react';

interface MaintenanceRequest {
  id: string;
  requestDate: string;
  requester: string;
  location: string;
  description: string;
  priority: '긴급' | '높음' | '보통' | '낮음';
  status: '요청' | '진행중' | '완료';
  completionDate: string | null;
  cost: number | null;
}

const requests: MaintenanceRequest[] = [
  { id: '1', requestDate: '2026-03-28', requester: '김간호사', location: '1관 204호 화장실', description: '온수 배관 누수 발생, 바닥 물 고임', priority: '긴급', status: '진행중', completionDate: null, cost: null },
  { id: '2', requestDate: '2026-03-27', requester: '최생활지도사', location: '2관 202호', description: '에어컨 작동 불량 (냉방 안됨)', priority: '높음', status: '진행중', completionDate: null, cost: null },
  { id: '3', requestDate: '2026-03-26', requester: '이간호사', location: '1관 3층 복도', description: '형광등 3개 깜빡임 현상', priority: '보통', status: '요청', completionDate: null, cost: null },
  { id: '4', requestDate: '2026-03-25', requester: '박관리과장', location: '2관 엘리베이터', description: '정기 안전 점검 (분기별)', priority: '높음', status: '완료', completionDate: '2026-03-28', cost: 350000 },
  { id: '5', requestDate: '2026-03-24', requester: '최생활지도사', location: '1층 대강당', description: '프로젝터 램프 교체 필요', priority: '보통', status: '완료', completionDate: '2026-03-27', cost: 180000 },
  { id: '6', requestDate: '2026-03-23', requester: '김간호사', location: '2관 1층 현관', description: '자동문 센서 오작동 (열림 지연)', priority: '높음', status: '완료', completionDate: '2026-03-25', cost: 120000 },
  { id: '7', requestDate: '2026-03-22', requester: '이간호사', location: '1관 105호', description: '창문 잠금장치 고장', priority: '낮음', status: '요청', completionDate: null, cost: null },
  { id: '8', requestDate: '2026-03-20', requester: '박관리과장', location: '옥상 물탱크', description: '정수 필터 교체 및 물탱크 청소', priority: '보통', status: '완료', completionDate: '2026-03-22', cost: 250000 },
];

const priorityColors: Record<string, string> = {
  '긴급': 'bg-red-100 text-red-800 border border-red-300',
  '높음': 'bg-orange-100 text-orange-800',
  '보통': 'bg-blue-100 text-blue-800',
  '낮음': 'bg-gray-100 text-gray-600',
};

const statusColors: Record<string, string> = {
  '요청': 'bg-yellow-100 text-yellow-800',
  '진행중': 'bg-blue-100 text-blue-800',
  '완료': 'bg-green-100 text-green-800',
};

export default function MaintenancePage() {
  const totalCost = requests.reduce((sum, r) => sum + (r.cost || 0), 0);
  const pending = requests.filter(r => r.status !== '완료').length;
  const completed = requests.filter(r => r.status === '완료').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">유지보수</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <p className="text-sm text-gray-500">전체 요청</p>
          <p className="text-3xl font-bold text-gray-900">{requests.length}<span className="text-base font-normal text-gray-500">건</span></p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 text-center">
          <p className="text-sm text-yellow-700">미처리</p>
          <p className="text-3xl font-bold text-yellow-700">{pending}<span className="text-base font-normal text-yellow-500">건</span></p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <p className="text-sm text-green-700">완료</p>
          <p className="text-3xl font-bold text-green-700">{completed}<span className="text-base font-normal text-green-500">건</span></p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
          <p className="text-sm text-blue-600">이번 달 비용</p>
          <p className="text-2xl font-bold text-blue-700">{totalCost.toLocaleString()}<span className="text-sm font-normal text-blue-500">원</span></p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">요청일</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">요청자</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">위치</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">내용</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">우선순위</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">상태</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">완료일</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">비용</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-600">{req.requestDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{req.requester}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{req.description}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${priorityColors[req.priority]}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{req.completionDate || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">
                    {req.cost ? `${req.cost.toLocaleString()}원` : '-'}
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
