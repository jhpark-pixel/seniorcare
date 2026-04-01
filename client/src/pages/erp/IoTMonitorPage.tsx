import React, { useMemo } from 'react';
import { useResidents } from '../../context/AppStateContext';

const statusConfig: Record<string, { label: string; dot: string; border: string; bg: string }> = {
  normal: { label: '정상', dot: 'bg-green-500', border: 'border-green-200', bg: 'bg-green-50' },
  warning: { label: '주의', dot: 'bg-yellow-500', border: 'border-yellow-200', bg: 'bg-yellow-50' },
  error: { label: '오류', dot: 'bg-red-500', border: 'border-red-200', bg: 'bg-red-50' },
};

export default function IoTMonitorPage() {
  const [residents] = useResidents();

  const devices = useMemo(() => [
    { id: 'IOT-001', location: `1관 101호 (${residents[0]?.name ?? ''})`, battery: 92, lastComm: '3초 전', status: 'normal' },
    { id: 'IOT-002', location: `1관 103호 (${residents[1]?.name ?? ''})`, battery: 85, lastComm: '5초 전', status: 'normal' },
    { id: 'IOT-003', location: `1관 105호 (${residents[2]?.name ?? ''})`, battery: 23, lastComm: '1분 전', status: 'warning' },
    { id: 'IOT-004', location: `1관 107호 (${residents[3]?.name ?? ''})`, battery: 78, lastComm: '8초 전', status: 'normal' },
    { id: 'IOT-005', location: `1관 109호 (${residents[4]?.name ?? ''})`, battery: 0, lastComm: '45분 전', status: 'error' },
    { id: 'IOT-006', location: `2관 201호 (${residents[5]?.name ?? ''})`, battery: 65, lastComm: '12초 전', status: 'normal' },
    { id: 'IOT-007', location: `2관 203호 (${residents[6]?.name ?? ''})`, battery: 41, lastComm: '3초 전', status: 'warning' },
    { id: 'IOT-008', location: `2관 205호 (${residents[7]?.name ?? ''})`, battery: 95, lastComm: '2초 전', status: 'normal' },
    { id: 'IOT-009', location: `2관 207호 (${residents[8]?.name ?? ''})`, battery: 88, lastComm: '7초 전', status: 'normal' },
    { id: 'IOT-010', location: `2관 209호 (${residents[9]?.name ?? ''})`, battery: 12, lastComm: '30분 전', status: 'error' },
  ], [residents]);

  const normalCount = devices.filter((d) => d.status === 'normal').length;
  const warningCount = devices.filter((d) => d.status === 'warning').length;
  const errorCount = devices.filter((d) => d.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">장치상태 모니터링</h1>
          <p className="mt-1 text-sm text-gray-500">IoT 장치의 실시간 상태를 모니터링합니다.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          마지막 업데이트: 3초 전
        </div>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
          <div className="text-sm text-gray-500">정상</div>
          <div className="text-2xl font-bold text-green-600">{normalCount}대</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 text-center">
          <div className="text-sm text-gray-500">주의</div>
          <div className="text-2xl font-bold text-yellow-600">{warningCount}대</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
          <div className="text-sm text-gray-500">오류</div>
          <div className="text-2xl font-bold text-red-600">{errorCount}대</div>
        </div>
      </div>

      {/* 장치 그리드 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {devices.map((d) => {
          const cfg = statusConfig[d.status];
          return (
            <div key={d.id} className={`rounded-lg border-2 ${cfg.border} ${cfg.bg} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-gray-700">{d.id}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-xs font-medium text-gray-600">{cfg.label}</span>
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-3">{d.location}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">배터리</span>
                  <span className={`font-medium ${d.battery <= 20 ? 'text-red-600' : d.battery <= 50 ? 'text-yellow-600' : 'text-green-600'}`}>{d.battery}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${d.battery <= 20 ? 'bg-red-500' : d.battery <= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${d.battery}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">마지막 통신</span>
                  <span className="text-gray-700">{d.lastComm}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
