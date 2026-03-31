import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const serviceRequestData = [
  { type: '시설보수', 건수: 18 },
  { type: '의료요청', 건수: 15 },
  { type: '식사변경', 건수: 12 },
  { type: '외출신청', 건수: 10 },
  { type: '물품요청', 건수: 8 },
  { type: '기타', 건수: 5 },
];

const popularPrograms = [
  { rank: 1, name: '실버체조교실', category: '운동', participants: 42, capacity: 50, rate: 84.0 },
  { rank: 2, name: '미술치료', category: '인지', participants: 38, capacity: 45, rate: 84.4 },
  { rank: 3, name: '음악감상회', category: '문화', participants: 35, capacity: 40, rate: 87.5 },
  { rank: 4, name: '원예치료', category: '사회', participants: 30, capacity: 40, rate: 75.0 },
  { rank: 5, name: '요가교실', category: '운동', participants: 28, capacity: 35, rate: 80.0 },
];

const staffWorkload = [
  { name: '김간호', role: '간호사', residents: 18, counseling: 12, services: 45 },
  { name: '이간호', role: '간호사', residents: 17, counseling: 10, services: 42 },
  { name: '최생활', role: '생활지도사', residents: 16, counseling: 8, services: 38 },
  { name: '박생활', role: '생활지도사', residents: 17, counseling: 9, services: 40 },
  { name: '정요양', role: '요양보호사', residents: 15, counseling: 5, services: 52 },
  { name: '한요양', role: '요양보호사', residents: 14, counseling: 4, services: 48 },
];

const complaintTypes = [
  { type: '식사', count: 12, percent: 30, avgTime: '1.2일' },
  { type: '시설', count: 8, percent: 20, avgTime: '2.5일' },
  { type: '소음', count: 7, percent: 17.5, avgTime: '0.8일' },
  { type: '서비스', count: 6, percent: 15, avgTime: '1.5일' },
  { type: '위생', count: 4, percent: 10, avgTime: '0.5일' },
  { type: '기타', count: 3, percent: 7.5, avgTime: '1.0일' },
];

const complaintColors: Record<string, string> = {
  '식사': 'bg-red-500',
  '시설': 'bg-orange-500',
  '소음': 'bg-yellow-500',
  '서비스': 'bg-blue-500',
  '위생': 'bg-green-500',
  '기타': 'bg-gray-400',
};

export default function OperationStatsPage() {
  const totalComplaints = complaintTypes.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">운영통계</h1>
        <p className="mt-1 text-sm text-gray-500">서비스 요청, 프로그램 참여, 직원 업무량, 민원 현황을 확인합니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 서비스 요청 유형별 건수 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">서비스 요청 유형별 건수</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={serviceRequestData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(value: number) => [`${value}건`]} />
              <Bar dataKey="건수" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 인기 프로그램 */}
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

      {/* 직원 업무량 */}
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
              const loadLevel = load > 70 ? '높음' : load > 50 ? '보통' : '양호';
              const loadColor = load > 70 ? 'text-red-600 bg-red-50' : load > 50 ? 'text-yellow-700 bg-yellow-50' : 'text-green-700 bg-green-50';
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

      {/* 민원 통계 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">민원 통계</h3>
        <div className="grid grid-cols-2 gap-6">
          {/* 유형별 분포 */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-3">유형별 분포 (총 {totalComplaints}건)</h4>
            <div className="flex h-6 rounded-full overflow-hidden mb-3">
              {complaintTypes.map((c) => (
                <div
                  key={c.type}
                  className={`${complaintColors[c.type]} transition-all`}
                  style={{ width: `${c.percent}%` }}
                  title={`${c.type}: ${c.count}건 (${c.percent}%)`}
                />
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
          {/* 평균 처리시간 */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-3">유형별 평균 처리시간</h4>
            <div className="space-y-2">
              {complaintTypes.map((c) => (
                <div key={c.type} className="flex items-center gap-3">
                  <span className="text-xs text-gray-700 w-12">{c.type}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`${complaintColors[c.type]} h-2 rounded-full`}
                      style={{ width: `${(parseFloat(c.avgTime) / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 w-10 text-right">{c.avgTime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
