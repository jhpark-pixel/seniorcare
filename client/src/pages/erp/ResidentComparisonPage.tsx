import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { residents } from '../../data/mockData';

interface ResidentProfile {
  id: string;
  name: string;
  room: string;
  age: number;
  healthScore: number;
  mobility: string;
  cognition: string;
  fallRisk: string;
  programParticipation: number;
  monthlyCost: string;
  diseases: string;
  careGrade: string;
}

function getFallRisk(r: typeof residents[0]): string {
  if (r.healthScore < 50 || r.mobilityLevel >= 4) return '고위험';
  if (r.healthScore < 65 || r.mobilityLevel >= 3 || r.cognitiveLevel !== 'NORMAL') return '중위험';
  return '저위험';
}

function getMonthlyCost(r: typeof residents[0]): string {
  // Assign based on care grade
  const costs: Record<string, string> = {
    '1등급': '340만원',
    '2등급': '310만원',
    '3등급': '280만원',
    '4등급': '257만원',
  };
  return costs[r.careGrade] ?? '280만원';
}

// Program participation % — inverse of health score danger (healthy = more participation)
function getParticipation(r: typeof residents[0]): number {
  if (r.status === 'HOSPITALIZED') return 0;
  return Math.min(100, Math.round(r.healthScore * 1.1));
}

const allResidents: ResidentProfile[] = residents.map(r => ({
  id: r.id,
  name: r.name,
  room: `${r.building} ${r.roomNumber}호`,
  age: r.age,
  healthScore: r.healthScore,
  mobility: r.mobilityLabel,
  cognition: r.cognitiveLabelKo,
  fallRisk: getFallRisk(r),
  programParticipation: getParticipation(r),
  monthlyCost: getMonthlyCost(r),
  diseases: r.diseases.length > 0 ? r.diseases.join(', ') : '없음',
  careGrade: r.careGrade,
}));

const compareFields: { key: keyof ResidentProfile; label: string }[] = [
  { key: 'age', label: '나이' },
  { key: 'healthScore', label: '건강점수' },
  { key: 'mobility', label: '이동능력' },
  { key: 'cognition', label: '인지수준' },
  { key: 'fallRisk', label: '낙상위험' },
  { key: 'programParticipation', label: '프로그램참여' },
  { key: 'monthlyCost', label: '월비용' },
  { key: 'diseases', label: '주요질환' },
  { key: 'careGrade', label: '케어등급' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function ResidentComparisonPage() {
  const [selected, setSelected] = useState<string[]>(['r1', 'r3', 'r6']);

  const selectedResidents = allResidents.filter((r) => selected.includes(r.id));

  const chartData = [
    { metric: '건강점수', ...Object.fromEntries(selectedResidents.map((r) => [r.name, r.healthScore])) },
    { metric: '프로그램참여(%)', ...Object.fromEntries(selectedResidents.map((r) => [r.name, r.programParticipation])) },
  ];

  const toggleResident = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const riskColor = (risk: string) => {
    if (risk === '고위험') return 'bg-red-100 text-red-700';
    if (risk === '중위험') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const scoreColor = (score: number) => {
    if (score < 50) return 'text-red-600 font-bold';
    if (score < 65) return 'text-orange-600 font-bold';
    return 'text-green-600 font-bold';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">입주자 비교 분석</h1>
        <p className="mt-1 text-sm text-gray-500">최대 3명의 입주자를 선택하여 건강, 활동, 비용 지표를 비교합니다.</p>
      </div>

      {/* 입주자 선택 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">비교 대상 선택 (최대 3명)</h3>
        <div className="flex flex-wrap gap-2">
          {allResidents.map((r) => {
            const isSelected = selected.includes(r.id);
            const colorIndex = selected.indexOf(r.id);
            const borderColors = ['border-blue-500', 'border-green-500', 'border-amber-500'];
            const bgColors = ['bg-blue-50', 'bg-green-50', 'bg-amber-50'];
            return (
              <button
                key={r.id}
                onClick={() => toggleResident(r.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                  isSelected
                    ? `${borderColors[colorIndex]} ${bgColors[colorIndex]} text-gray-900`
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                }`}
              >
                {r.name} ({r.room})
              </button>
            );
          })}
        </div>
      </div>

      {selectedResidents.length >= 2 && (
        <>
          {/* 비교 테이블 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">항목별 비교</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 w-32">항목</th>
                  {selectedResidents.map((r, i) => (
                    <th key={r.id} className="px-4 py-3 text-center font-semibold" style={{ color: COLORS[i] }}>
                      {r.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareFields.map((field) => (
                  <tr key={field.key} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{field.label}</td>
                    {selectedResidents.map((r) => {
                      const val = r[field.key];
                      let display: React.ReactNode = String(val);

                      if (field.key === 'healthScore') {
                        display = <span className={scoreColor(val as number)}>{val}점</span>;
                      } else if (field.key === 'fallRisk') {
                        display = <span className={`px-2 py-0.5 text-xs rounded-full ${riskColor(val as string)}`}>{val}</span>;
                      } else if (field.key === 'programParticipation') {
                        display = `${val}%`;
                      } else if (field.key === 'age') {
                        display = `${val}세`;
                      }

                      return (
                        <td key={r.id} className="px-4 py-3 text-center text-gray-700">{display}</td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 바 비교 차트 */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">수치 비교 차트</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                {selectedResidents.map((r, i) => (
                  <Bar key={r.id} dataKey={r.name} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {selectedResidents.length < 2 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
          <p className="text-gray-500">비교할 입주자를 2명 이상 선택해주세요.</p>
        </div>
      )}
    </div>
  );
}
