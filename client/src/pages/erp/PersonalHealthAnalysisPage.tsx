import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { residents } from '../../data/mockData';

const residentList = residents.map(r => r.name);

function getHealthData(residentName: string) {
  const r = residents.find(res => res.name === residentName);
  if (!r) return { score: 70, itemScores: [], riskTags: [], opinion: '' };

  const hasBP = r.diseases.some(d => d.includes('고혈압') || d.includes('뇌졸중'));
  const hasDiabetes = r.diseases.some(d => d.includes('당뇨'));
  const hasDementia = r.diseases.some(d => d.includes('치매'));
  const hasParkinson = r.diseases.some(d => d.includes('파킨슨'));
  const hasHeartFailure = r.diseases.some(d => d.includes('심부전'));
  const hasCOPD = r.diseases.some(d => d.includes('만성폐쇄성'));
  const hasDepression = r.diseases.some(d => d.includes('우울증'));
  const hasArthritis = r.diseases.some(d => d.includes('관절염'));
  const hasOsteoporosis = r.diseases.some(d => d.includes('골다공증'));

  const bmiScore = r.weight / ((r.height / 100) ** 2);
  const bmiNormal = bmiScore >= 18.5 && bmiScore < 25;

  const itemScores = [
    { label: 'BMI', score: bmiNormal ? 85 : 62, status: bmiNormal ? '정상' : '주의' },
    { label: '혈압', score: hasBP ? 55 : 82, status: hasBP ? '주의' : '정상' },
    { label: '혈당', score: hasDiabetes ? 60 : 85, status: hasDiabetes ? '경계' : '정상' },
    { label: '인지기능', score: hasDementia ? 40 : hasParkinson ? 65 : 85, status: hasDementia ? '위험' : hasParkinson ? '주의' : '정상' },
    { label: '활동성', score: r.mobilityLevel <= 1 ? 88 : r.mobilityLevel === 2 ? 70 : r.mobilityLevel === 3 ? 50 : 30, status: r.mobilityLevel <= 1 ? '양호' : r.mobilityLevel === 2 ? '보통' : r.mobilityLevel === 3 ? '주의' : '위험' },
    { label: '수면/수분', score: hasDepression ? 62 : 78, status: hasDepression ? '주의' : '양호' },
  ];

  const riskTags: { label: string; color: string }[] = [];
  if (hasBP) riskTags.push({ label: '고혈압 주의', color: 'bg-red-100 text-red-700' });
  if (hasDiabetes) riskTags.push({ label: '혈당 경계', color: 'bg-yellow-100 text-yellow-700' });
  if (hasDementia) riskTags.push({ label: '치매 관리', color: 'bg-purple-100 text-purple-700' });
  if (hasParkinson) riskTags.push({ label: '파킨슨 관리', color: 'bg-indigo-100 text-indigo-700' });
  if (r.mobilityLevel >= 3) riskTags.push({ label: '낙상 고위험', color: 'bg-orange-100 text-orange-700' });
  if (hasHeartFailure) riskTags.push({ label: '심부전 모니터링', color: 'bg-red-100 text-red-700' });
  if (hasCOPD) riskTags.push({ label: 'COPD 주의', color: 'bg-blue-100 text-blue-700' });
  if (hasDepression) riskTags.push({ label: '우울증 관찰', color: 'bg-pink-100 text-pink-700' });
  if (hasArthritis) riskTags.push({ label: '관절 보호', color: 'bg-teal-100 text-teal-700' });
  if (hasOsteoporosis) riskTags.push({ label: '골다공증 주의', color: 'bg-amber-100 text-amber-700' });

  const diseaseNotes = r.diseases.map(d => {
    if (d.includes('고혈압')) return '혈압 관리를 위해 저염식 유지 및 정기적인 혈압 모니터링을 권고합니다.';
    if (d.includes('당뇨')) return '혈당 관리를 위해 저당식 및 규칙적인 혈당 측정이 필요합니다.';
    if (d.includes('치매')) return '인지 자극 프로그램 참여 및 안전 환경 유지가 필요합니다.';
    if (d.includes('파킨슨')) return '파킨슨병 약물 복용 시간을 엄수하고 보행 안전에 주의하십시오.';
    if (d.includes('뇌졸중')) return '뇌졸중 재발 예방을 위해 항혈전제 복용을 철저히 관리합니다.';
    if (d.includes('심부전')) return '심부전 모니터링을 위해 하지 부종 및 호흡 곤란 여부를 매일 확인합니다.';
    if (d.includes('만성폐쇄성')) return 'COPD 흡입기를 매일 사용하고 호흡 기능 변화를 관찰합니다.';
    if (d.includes('관절염')) return '관절 보호 운동 및 온열 치료를 병행합니다.';
    if (d.includes('골다공증')) return '낙상 예방 환경 조성 및 칼슘·비타민D 보충이 필요합니다.';
    if (d.includes('우울증')) return '정서 지지 프로그램 참여 및 정기적인 심리 상태 확인이 필요합니다.';
    return '';
  }).filter(Boolean).join(' ');

  const opinion = `${r.name}님(${r.age}세, ${r.building} ${r.roomNumber}호)의 종합 건강점수는 ${r.healthScore}점입니다. ${diseaseNotes} 낙상 예방을 위한 하체 근력 운동 프로그램 참여를 추천합니다.`;

  return { score: r.healthScore, itemScores, riskTags, opinion };
}

function genTrendData(residentName: string) {
  const r = residents.find(res => res.name === residentName);
  const baseIdx = residents.findIndex(res => res.name === residentName);
  const hasBP = r?.diseases.some(d => d.includes('고혈압') || d.includes('뇌졸중')) ?? false;
  const hasDiabetes = r?.diseases.some(d => d.includes('당뇨')) ?? false;
  const bpBase = hasBP ? 148 : 118;
  const sugarBase = hasDiabetes ? 155 : 92;
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 2, 30 - i);
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      혈압_수축: bpBase + ((i * 3 + baseIdx * 7) % 20) - 10,
      혈당: sugarBase + ((i * 5 + baseIdx * 11) % 40) - 20,
      건강점수: (r?.healthScore ?? 70) + ((i * 4 + baseIdx * 2) % 20) - 10,
    });
  }
  return data;
}

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
  const [selected, setSelected] = useState(residentList[0]);
  const { score, itemScores, riskTags, opinion: defaultOpinion } = getHealthData(selected);
  const trendData = genTrendData(selected);
  const [opinion, setOpinion] = useState(defaultOpinion);
  const [savedOpinion, setSavedOpinion] = useState(false);

  const handleResidentChange = (name: string) => {
    setSelected(name);
    const { opinion: newOpinion } = getHealthData(name);
    setOpinion(newOpinion);
    setSavedOpinion(false);
  };

  const handleSaveOpinion = () => {
    setSavedOpinion(true);
    alert('소견이 저장되었습니다.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">개인 건강분석표</h1>
        <p className="mt-1 text-sm text-gray-500">입주자별 건강 상태를 종합적으로 분석합니다.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">입주자 선택</label>
        <select value={selected} onChange={(e) => handleResidentChange(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
          {residentList.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        {(() => {
          const r = residents.find(res => res.name === selected);
          if (!r) return null;
          return (
            <span className="text-sm text-gray-500">
              {r.building} {r.roomNumber}호 · {r.age}세 · {r.diseases.join(', ')} · {r.careGrade}
            </span>
          );
        })()}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 건강점수 게이지 */}
        <ScoreGauge score={score} />

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
      {riskTags.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-700">위험 태그:</span>
          {riskTags.map((tag) => (
            <span key={tag.label} className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}>{tag.label}</span>
          ))}
        </div>
      )}

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
          onChange={(e) => { setOpinion(e.target.value); setSavedOpinion(false); }}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex items-center justify-end gap-3 mt-3">
          {savedOpinion && <span className="text-sm text-green-600 font-medium">저장 완료</span>}
          <button onClick={handleSaveOpinion} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">소견 저장</button>
        </div>
      </div>
    </div>
  );
}
