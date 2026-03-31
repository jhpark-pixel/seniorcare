import React, { useState } from 'react';

const residents = ['김영순', '이순자', '박정희', '최옥순', '정미숙', '한순이', '서복순', '강말숙', '조순옥', '배영자'];

function genRecords() {
  const recorders = ['김간호', '이간호', '박간호'];
  const moods = ['좋음', '보통', '우울', '불안'];
  const meals = ['양호', '보통', '소량', '거부'];
  const rows = [];
  for (let i = 0; i < 20; i++) {
    const d = new Date(2026, 2, 30 - i);
    const systolic = 110 + Math.floor(Math.random() * 50);
    const diastolic = 60 + Math.floor(Math.random() * 30);
    const glucose = 80 + Math.floor(Math.random() * 80);
    const hr = 55 + Math.floor(Math.random() * 40);
    const temp = +(36.0 + Math.random() * 1.5).toFixed(1);
    const weight = +(52 + Math.random() * 5).toFixed(1);
    const sleep = +(4 + Math.random() * 5).toFixed(1);
    const water = 400 + Math.floor(Math.random() * 800);
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
      meal: meals[Math.floor(Math.random() * meals.length)],
      mood: moods[Math.floor(Math.random() * moods.length)],
      recorder: recorders[Math.floor(Math.random() * recorders.length)],
    });
  }
  return rows;
}

const records = genRecords();

const red = 'text-red-600 font-semibold';

export default function HealthRecordHistoryPage() {
  const [selected, setSelected] = useState(residents[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">건강기록 이력조회</h1>
        <p className="mt-1 text-sm text-gray-500">입주자별 건강 기록 이력을 조회합니다.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">입주자 선택</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
          {residents.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <span className="text-sm text-gray-500">최근 20건의 기록을 표시합니다.</span>
      </div>

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
