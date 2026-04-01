import React, { useState, useMemo } from 'react';
import { useResidents } from '../../context/AppStateContext';

function genRecords(residentName: string, residents: any[]) {
  const resident = residents.find((r: any) => r.name === residentName);
  const recorders = ['김서연', '이하은'];
  const moods = ['좋음', '보통', '우울', '불안'];
  const meals = ['양호', '보통', '소량', '거부'];
  // seed-like deterministic values based on resident index for consistency
  const baseIdx = residents.findIndex((r: any) => r.name === residentName);
  const bpBase = resident?.diseases.includes('고혈압') || resident?.diseases.includes('뇌졸중') ? 145 : 118;
  const sugarBase = resident?.diseases.includes('당뇨병') ? 150 : 95;
  const rows = [];
  for (let i = 0; i < 20; i++) {
    const d = new Date(2026, 2, 30 - i);
    const systolic = bpBase + ((i * 3 + baseIdx * 7) % 20) - 10;
    const diastolic = 70 + ((i * 2 + baseIdx * 5) % 20) - 5;
    const glucose = sugarBase + ((i * 5 + baseIdx * 11) % 40) - 20;
    const hr = 65 + ((i * 4 + baseIdx * 3) % 30) - 10;
    const temp = +(36.2 + ((i + baseIdx) % 10) * 0.1).toFixed(1);
    const weight = resident ? +(resident.weight + ((i + baseIdx) % 5) * 0.2 - 0.4).toFixed(1) : 55.0;
    const sleep = +(5 + ((i * 3 + baseIdx) % 40) * 0.1).toFixed(1);
    const water = 450 + ((i * 50 + baseIdx * 30) % 600);
    rows.push({
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      bp: `${systolic}/${diastolic}`,
      bpHigh: systolic >= 140 || diastolic >= 90,
      glucose,
      glucoseHigh: glucose >= 140,
      hr,
      hrAbnormal: hr < 60 || hr > 90,
      temp,
      tempHigh: temp >= 37.5,
      weight,
      sleep,
      sleepLow: sleep < 5,
      water,
      waterLow: water < 500,
      meal: meals[(i + baseIdx) % meals.length],
      mood: moods[(i * 2 + baseIdx) % moods.length],
      recorder: recorders[(i + baseIdx) % recorders.length],
    });
  }
  return rows;
}

const red = 'text-red-600 font-semibold';

export default function HealthRecordHistoryPage() {
  const [residents] = useResidents();
  const residentList = useMemo(() => residents.map(r => r.name), [residents]);

  const [selected, setSelected] = useState(residentList[0]);
  const records = genRecords(selected, residents);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">건강기록 이력조회</h1>
        <p className="mt-1 text-sm text-gray-500">입주자별 건강 기록 이력을 조회합니다.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">입주자 선택</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
          {residentList.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <span className="text-sm text-gray-500">최근 20건의 기록을 표시합니다.</span>
      </div>

      {/* 선택된 입주자 기본 정보 */}
      {(() => {
        const r = residents.find(res => res.name === selected);
        if (!r) return null;
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-wrap gap-4 text-sm">
            <span className="text-gray-700"><span className="font-medium">호실:</span> {r.building} {r.roomNumber}호</span>
            <span className="text-gray-700"><span className="font-medium">나이:</span> {r.age}세</span>
            <span className="text-gray-700"><span className="font-medium">질환:</span> {r.diseases.join(', ')}</span>
            <span className="text-gray-700"><span className="font-medium">케어등급:</span> {r.careGrade}</span>
          </div>
        );
      })()}

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['기록일', '혈압', '혈당', '심박', '체온', '체중', '수면(h)', '수분(ml)', '식사량', '기분', '기록자'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{r.date}</td>
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${r.bpHigh ? red : 'text-gray-500'}`}>{r.bp}</td>
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${r.glucoseHigh ? red : 'text-gray-500'}`}>{r.glucose}</td>
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${r.hrAbnormal ? red : 'text-gray-500'}`}>{r.hr}</td>
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${r.tempHigh ? red : 'text-gray-500'}`}>{r.temp}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.weight}</td>
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${r.sleepLow ? red : 'text-gray-500'}`}>{r.sleep}</td>
                  <td className={`px-4 py-3 text-sm whitespace-nowrap ${r.waterLow ? red : 'text-gray-500'}`}>{r.water}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.meal}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.mood}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{r.recorder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800"><span className="font-semibold">참고:</span> 이상 수치는 <span className={red}>빨간색</span>으로 표시됩니다. (혈압 140/90 이상, 혈당 140 이상, 심박 60 미만 또는 90 초과, 체온 37.5 이상, 수면 5시간 미만, 수분 500ml 미만)</p>
      </div>
    </div>
  );
}
