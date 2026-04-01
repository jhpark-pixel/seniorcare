import React, { useState, useMemo } from 'react';
import { useResidents, useStaff } from '../../context/AppStateContext';

const fields = ['혈압(수축)', '혈압(이완)', '혈당', '심박', '체온', '체중', '수면(h)', '수분(ml)', '식사량', '기분'];

// Pre-populate some sample values based on resident conditions
function getInitialValues(residentName: string, residents: any[]): string[] {
  const r = residents.find((res: any) => res.name === residentName);
  if (!r) return Array(10).fill('');
  const hasBP = r.diseases.some((d: string) => d.includes('고혈압') || d.includes('뇌졸중'));
  const hasDiabetes = r.diseases.some((d: string) => d.includes('당뇨'));
  return [
    hasBP ? '145' : '120',
    hasBP ? '90' : '76',
    hasDiabetes ? '148' : '98',
    String(65 + (r.age % 20)),
    '36.5',
    String(r.weight),
    '6.5',
    '600',
    '양호',
    '보통',
  ];
}

export default function HealthRecordBatchPage() {
  const [residents] = useResidents();
  const [staff] = useStaff();
  const activeResidents = useMemo(() => residents.filter(r => r.status !== 'DISCHARGED'), [residents]);
  const nurseOptions = useMemo(() => staff.filter(s => s.role === 'NURSE').map(s => s.name), [staff]);
  const [recordDate, setRecordDate] = useState('2026-03-30');
  const [recorder, setRecorder] = useState(nurseOptions[0]);
  const [data, setData] = useState(() =>
    activeResidents.map(r => ({
      name: r.name,
      room: `${r.building} ${r.roomNumber}호`,
      values: getInitialValues(r.name, residents),
    }))
  );
  const [saved, setSaved] = useState(false);

  const handleChange = (rowIdx: number, colIdx: number, value: string) => {
    setData((prev) => {
      const next = prev.map((d) => ({ ...d, values: [...d.values] }));
      next[rowIdx].values[colIdx] = value;
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    const filled = data.filter((d) => d.values.some((v) => v !== ''));
    setSaved(true);
    alert(`${filled.length}명의 건강기록이 일괄 저장되었습니다. (기록일: ${recordDate}, 기록자: ${recorder})`);
  };

  const handleClear = () => {
    setData(prev => prev.map(d => ({ ...d, values: Array(10).fill('') })));
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">건강기록 일괄입력</h1>
        <p className="mt-1 text-sm text-gray-500">여러 입주자의 건강 기록을 한 번에 입력합니다.</p>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <label className="text-sm font-medium text-gray-700">기록일자</label>
        <input
          type="date"
          value={recordDate}
          onChange={e => setRecordDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <label className="text-sm font-medium text-gray-700">기록자</label>
        <select
          value={recorder}
          onChange={e => setRecorder(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {nurseOptions.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        {saved && <span className="text-sm text-green-600 font-medium">저장 완료</span>}
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">입주자</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">호실</th>
                {fields.map((f) => (
                  <th key={f} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{f}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">{row.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-500 whitespace-nowrap">{row.room}</td>
                  {row.values.map((val, ci) => (
                    <td key={ci} className="px-1 py-1">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleChange(ri, ci, e.target.value)}
                        className="w-16 border border-gray-300 rounded px-1.5 py-1 text-sm text-center focus:ring-blue-500 focus:border-blue-500"
                        placeholder="-"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={handleClear} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
          전체 초기화
        </button>
        <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          일괄 저장
        </button>
      </div>
    </div>
  );
}
