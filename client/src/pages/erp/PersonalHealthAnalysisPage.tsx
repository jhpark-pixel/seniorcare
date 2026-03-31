import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const residents = ['김영순', '이순자', '박정희', '최옥순', '정미숙', '한순이', '서복순', '강말숙', '조순옥', '배영자'];

const healthScore = 75;

const itemScores = [
  { label: 'BMI', score: 82, status: '정상' },
  { label: '혈압', score: 60, status: '주의' },
  { label: '혈당', score: 70, status: '경계' },
  { label: '콜레스테롤', score: 85, status: '정상' },
  { label: '활동성', score: 65, status: '주의' },
  { label: '수면/수분', score: 78, status: '양호' },
];

const riskTags = [
  { label: '고혈압 주의', color: 'bg-red-100 text-red-700' },
  { label: '낙상 고위험', color: 'bg-orange-100 text-orange-700' },
  { label: '혈당 경계', color: 'bg-yellow-100 text-yellow-700' },
];

function genTrendData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 2, 30 - i);
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      혈압_수축: 120 + Math.floor(Math.random() * 30),
      혈당: 90 + Math.floor(Math.random() * 50),
      체중: +(53 + Math.random() * 3).toFixed(1),
      건강점수: 65 + Math.floor(Math.random() * 20),
    });
  }
  return data;
}

const trendData = genTrendData();

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  const bgColor = score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100';
  return (
    <div className={`${bgColor} rounded-xl p-6 flex flex-col items-center justify-center`}>
      <div className="text-sm text-gray-600 mb-2">종합 건강점수</div>
      <div className={`text-5xl font-bold ${color}`}>{score}</div>
      <div className="text-sm text-gray-500 mt-1">/ 100점</div>
      <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
        <div className={`h-3 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function PersonalHealthAnalysisPage() {
  const [selected, setSelected] = useState(residents[0]);
  const [opinion, setOpinion] = useState('전반적으로 혈압 관리가 필요합니다. 저염식 유지 및 정기적인 혈압 모니터링을 권고합니다. 낙상 예방을 위한 하체 근력 운동 프로그램 참여를 추천합니다.');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">개인 건강분석표</h1>
        <p className="mt-1 text-sm text-gray-500">입주자별 건강 상태를 종합적으로 분석합니다.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">입주자 선택</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
          {residents.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 건강점수 게이지 */}
        <ScoreGauge score={healthScore} />

        {/* 항목별 점수 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">항목별 점수</h3>
          <div className="space-y-3">
            {itemScores.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-24">{item.label}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.score}점</span>
                <span className={`text-xs px-2 py-0.5 rounded ${item.score >= 80 ? 'bg-green-100 text-green-700' : item.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 위험 태그 */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">위험 태그:</span>
        {riskTags.map((tag) => (
          <span key={tag.label} className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}>{tag.label}</span>
        ))}
      </div>

      {/* 30일 추이 차트 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">30일 건강 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="혈압_수축" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="혈당" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="건강점수" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 종합 소견 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">종합 소견</h3>
        <textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex justify-end mt-3">
          <button onClick={() => alert('소견이 저장되었습니다.')} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">소견 저장</button>
        </div>
      </div>
    </div>
  );
}
