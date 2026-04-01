import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useStaff, useResidents } from '../../context/AppStateContext';

const serviceRequestData = [
  { type: '시설보수', 건수: 18 },
  { type: '의료요청', 건수: 15 },
  { type: '식사변경', 건수: 12 },
  { type: '외출신청', 건수: 10 },
  { type: '물품요청', 건수: 8 },
  { type: '기타', 건수: 5 },
];

const popularPrograms = [
  { rank: 1, name: '실버체조교실', category: '운동', participants: 8, capacity: 10, rate: 80.0 },
  { rank: 2, name: '미술치료', category: '인지', participants: 7, capacity: 10, rate: 70.0 },
  { rank: 3, name: '음악감상회', category: '문화', participants: 9, capacity: 10, rate: 90.0 },
  { rank: 4, name: '원예치료', category: '사회', participants: 6, capacity: 10, rate: 60.0 },
  { rank: 5, name: '요가교실', category: '운동', participants: 5, capacity: 10, rate: 50.0 },
];

function buildStaffWorkload(staffList: { name: string; roleLabel: string }[]) {
  return staffList.map((s, i) => ({
    name: s.name,
    role: s.roleLabel,
    residents: [5, 4, 4, 3, 3][i] ?? 3,
    counseling: [5, 4, 3, 3, 2][i] ?? 2,
    services: [20, 18, 15, 14, 12][i] ?? 10,
  }));
}

const complaintTypes = [
  { type: '식사', count: 4, percent: 30, avgTime: '1.2일' },
  { type: '시설', count: 3, percent: 20, avgTime: '2.5일' },
  { type: '소음', count: 2, percent: 17.5, avgTime: '0.8일' },
  { type: '서비스', count: 2, percent: 15, avgTime: '1.5일' },
  { type: '위생', count: 1, percent: 10, avgTime: '0.5일' },
  { type: '기타', count: 1, percent: 7.5, avgTime: '1.0일' },
];

const complaintColors: Record<string, string> = {
  '식사': 'bg-red-500',
  '시설': 'bg-orange-500',
  '소음': 'bg-yellow-500',
  '서비스': 'bg-blue-500',
  '위생': 'bg-green-500',
  '기타': 'bg-gray-400',
};

const leaveData = [
  { month: '2025.10', 외출: 8, 외박: 3 },
  { month: '2025.11', 외출: 7, 외박: 2 },
  { month: '2025.12', 외출: 5, 외박: 1 },
  { month: '2026.01', 외출: 6, 외박: 2 },
  { month: '2026.02', 외출: 9, 외박: 3 },
  { month: '2026.03', 외출: 8, 외박: 2 },
];

const tabs = [
  { id: 'service', label: '서비스 요청', path: '/erp/operation-stats/service' },
  { id: 'program', label: '프로그램 참여', path: '/erp/operation-stats/program' },
  { id: 'staff', label: '직원 업무량', path: '/erp/operation-stats/staff' },
  { id: 'complaint', label: '민원 통계', path: '/erp/operation-stats/complaint' },
  { id: 'leave', label: '외출/외박', path: '/erp/operation-stats/leave' },
];

export default function OperationStatsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [staff] = useStaff();
  const [residents] = useResidents();
  const staffWorkload = useMemo(() => buildStaffWorkload(staff), [staff]);

  const totalComplaints = complaintTypes.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">운영통계</h1>
        <p className="mt-1 text-sm text-gray-500">서비스 요청, 프로그램 참여, 직원 업무량, 민원 현황을 확인합니다.</p>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* service: 서비스 요청 유형별 건수 */}
      {segment === 'service' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">이번 달 총 요청</p>
              <p className="text-2xl font-bold text-blue-700">{serviceRequestData.reduce((s, d) => s + d.건수, 0)}건</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium">처리 완료</p>
              <p className="text-2xl font-bold text-green-700">56건</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-xs text-yellow-600 font-medium">처리 대기</p>
              <p className="text-2xl font-bold text-yellow-700">12건</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">서비스 요청 유형별 건수</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={serviceRequestData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip formatter={(value: number) => [`${value}건`]} />
                <Bar dataKey="건수" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">유형별 상세</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">유형</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">건수</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">비율</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">평균 처리시간</th>
                </tr>
              </thead>
              <tbody>
                {serviceRequestData.map(row => {
                  const total = serviceRequestData.reduce((s, d) => s + d.건수, 0);
                  return (
                    <tr key={row.type} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.type}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{row.건수}건</td>
                      <td className="px-4 py-3 text-center text-gray-700">{Math.round(row.건수 / total * 100)}%</td>
                      <td className="px-4 py-3 text-center text-gray-600">1.5일</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* program: 프로그램 참여 */}
      {segment === 'program' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">운영 프로그램</p>
              <p className="text-2xl font-bold text-blue-700">5개</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium">평균 참여율</p>
              <p className="text-2xl font-bold text-green-700">70.0%</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
              <p className="text-xs text-indigo-600 font-medium">이번 달 총 참여</p>
              <p className="text-2xl font-bold text-indigo-700">35명</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">인기 프로그램 TOP 5</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">순위</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">프로그램</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">분류</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-600">참여/정원</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-600">참여율</th>
                </tr>
              </thead>
              <tbody>
                {popularPrograms.map((p) => (
                  <tr key={p.rank} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${p.rank <= 3 ? 'bg-[#F0835A]' : 'bg-gray-400'}`}>
                        {p.rank}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-2 text-center">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">{p.category}</span>
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700">{p.participants}/{p.capacity}명</td>
                    <td className="px-4 py-2 text-right font-medium text-blue-600">{p.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* staff: 직원 업무량 */}
      {segment === 'staff' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">전체 직원</p>
              <p className="text-2xl font-bold text-blue-700">{staff.length}명</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium">총 서비스 처리</p>
              <p className="text-2xl font-bold text-green-700">{staffWorkload.reduce((s, w) => s + w.services, 0)}건</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <p className="text-xs text-orange-600 font-medium">총 상담</p>
              <p className="text-2xl font-bold text-orange-700">{staffWorkload.reduce((s, w) => s + w.counseling, 0)}건</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">직원 업무량</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">직원명</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">직급</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">담당 입소자수</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">상담건수</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">서비스 처리건수</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">업무 부하</th>
                </tr>
              </thead>
              <tbody>
                {staffWorkload.map((s, i) => {
                  const load = s.residents + s.counseling + s.services;
                  const loadLevel = load > 30 ? '높음' : load > 20 ? '보통' : '양호';
                  const loadColor = load > 30 ? 'text-red-600 bg-red-50' : load > 20 ? 'text-yellow-700 bg-yellow-50' : 'text-green-700 bg-green-50';
                  return (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="px-4 py-3 text-center text-gray-700">{s.role}</td>
                      <td className="px-4 py-3 text-center">{s.residents}명</td>
                      <td className="px-4 py-3 text-center">{s.counseling}건</td>
                      <td className="px-4 py-3 text-center">{s.services}건</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${loadColor}`}>{loadLevel}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* complaint: 민원 통계 */}
      {segment === 'complaint' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-xs text-red-600 font-medium">이번 달 민원</p>
              <p className="text-2xl font-bold text-red-700">{totalComplaints}건</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium">처리 완료</p>
              <p className="text-2xl font-bold text-green-700">{totalComplaints - 1}건</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">평균 처리시간</p>
              <p className="text-2xl font-bold text-blue-700">1.2일</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">민원 통계</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-3">유형별 분포 (총 {totalComplaints}건)</h4>
                <div className="flex h-6 rounded-full overflow-hidden mb-3">
                  {complaintTypes.map((c) => (
                    <div key={c.type} className={`${complaintColors[c.type]} transition-all`} style={{ width: `${c.percent}%` }} title={`${c.type}: ${c.count}건 (${c.percent}%)`} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  {complaintTypes.map((c) => (
                    <div key={c.type} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <div className={`w-3 h-3 rounded-full ${complaintColors[c.type]}`} />
                      {c.type} {c.count}건 ({c.percent}%)
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500 mb-3">유형별 평균 처리시간</h4>
                <div className="space-y-2">
                  {complaintTypes.map((c) => (
                    <div key={c.type} className="flex items-center gap-3">
                      <span className="text-xs text-gray-700 w-12">{c.type}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className={`${complaintColors[c.type]} h-2 rounded-full`} style={{ width: `${(parseFloat(c.avgTime) / 3) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-10 text-right">{c.avgTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* leave: 외출/외박 통계 */}
      {segment === 'leave' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-blue-600 font-medium">이번 달 외출</p>
              <p className="text-2xl font-bold text-blue-700">8건</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
              <p className="text-xs text-indigo-600 font-medium">이번 달 외박</p>
              <p className="text-2xl font-bold text-indigo-700">2건</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-xs text-green-600 font-medium">현재 외출 중</p>
              <p className="text-2xl font-bold text-green-700">{residents.filter(r => r.status === 'OUTING').length}명</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">월별 외출/외박 현황</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={leaveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(value: number, name: string) => [`${value}건`, name]} />
                <Bar dataKey="외출" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="외박" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">현재 외출/입원 중인 입소자</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">입소자명</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">호실</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">상태</th>
                </tr>
              </thead>
              <tbody>
                {residents.filter(r => r.status === 'OUTING' || r.status === 'HOSPITALIZED').map(r => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-700">{r.building} {r.roomNumber}호</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${r.status === 'OUTING' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {r.status === 'OUTING' ? '외출' : '입원'}
                      </span>
                    </td>
                  </tr>
                ))}
                {residents.filter(r => r.status === 'OUTING' || r.status === 'HOSPITALIZED').length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-gray-400 text-sm">외출/입원 중인 입소자가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
