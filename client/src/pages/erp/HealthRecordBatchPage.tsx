import React, { useState } from 'react';

const fields = ['혈압(수축)', '혈압(이완)', '혈당', '심박', '체온', '체중', '수면(h)', '수분(ml)', '식사량', '기분'];

const initialData = [
  { name: '김영순', room: '1관 301호', values: ['128', '82', '105', '72', '36.5', '54.2', '7.0', '650', '양호', '좋음'] },
  { name: '이순자', room: '2관 205호', values: ['135', '88', '130', '68', '36.3', '48.5', '6.5', '500', '보통', '보통'] },
  { name: '박정희', room: '1관 402호', values: ['', '', '', '', '', '', '', '', '', ''] },
  { name: '최옥순', room: '2관 103호', values: ['142', '92', '145', '78', '36.8', '62.0', '5.5', '700', '양호', '좋음'] },
  { name: '정미숙', room: '1관 201호', values: ['120', '75', '98', '65', '36.4', '56.8', '', '', '', ''] },
];

export default function HealthRecordBatchPage() {
  const [data, setData] = useState(initialData.map((d) => ({ ...d, values: [...d.values] })));

  const handleChange = (rowIdx: number, colIdx: number, value: string) => {
    setData((prev) => {
      const next = prev.map((d) => ({ ...d, values: [...d.values] }));
      next[rowIdx].values[colIdx] = value;
      return next;
    });
  };

  const handleSave = () => {
    const filled = data.filter((d) => d.values.some((v) => v !== ''));
    alert(`${filled.length}명의 건강기록이 일괄 저장되었습니다.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">건강기록 일괄입력</h1>
        <p className="mt-1 text-sm text-gray-500">여러 입주자의 건강 기록을 한 번에 입력합니다.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">기록일자</label>
        <input type="date" defaultValue="2026-03-30" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
        <label className="text-sm font-medium text-gray-700">기록자</label>
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
          <option>김간호</option>
          <option>이간호</option>
          <option>박간호</option>
        </select>
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

      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
          일괄 저장
        </button>
      </div>
    </div>
  );
}
