import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResidents } from '../../context/AppStateContext';

interface DayMeal {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  calories: number;
}

const initialMeals: DayMeal[] = [
  { day: '월요일', breakfast: '흰죽, 계란찜, 깍두기, 배추김치, 우유', lunch: '보리밥, 된장찌개, 제육볶음, 시금치나물, 배추김치', dinner: '흰밥, 미역국, 고등어구이, 콩나물무침, 깍두기', calories: 1650 },
  { day: '화요일', breakfast: '잡곡밥, 북어국, 두부조림, 열무김치, 요구르트', lunch: '흰밥, 김치찌개, 불고기, 도라지무침, 깍두기', dinner: '흰밥, 콩나물국, 생선까스, 오이소박이, 배추김치', calories: 1720 },
  { day: '수요일', breakfast: '누룽지죽, 감자조림, 멸치볶음, 배추김치, 바나나', lunch: '비빔밥, 계란국, 잡채, 깻잎장아찌, 깍두기', dinner: '흰밥, 소고기무국, 두부구이, 숙주나물, 배추김치', calories: 1580 },
  { day: '목요일', breakfast: '잡곡밥, 시래기국, 어묵볶음, 총각김치, 우유', lunch: '흰밥, 순두부찌개, 닭갈비, 미나리무침, 깍두기', dinner: '흰밥, 떡국, 동태전, 고사리나물, 배추김치', calories: 1690 },
  { day: '금요일', breakfast: '흰죽, 호박전, 장조림, 배추김치, 사과', lunch: '카레라이스, 달걀파국, 치킨너겟, 양배추샐러드, 깍두기', dinner: '흰밥, 오징어무국, 갈치구이, 무생채, 배추김치', calories: 1640 },
  { day: '토요일', breakfast: '잡곡밥, 감자국, 김구이, 젓갈, 요구르트', lunch: '흰밥, 부대찌개, 잔치국수, 단무지, 깍두기', dinner: '흰밥, 아욱국, 삼치구이, 깻잎절임, 배추김치', calories: 1610 },
  { day: '일요일', breakfast: '야채죽, 계란말이, 김치전, 배추김치, 우유', lunch: '흰밥, 갈비탕, 잡채, 오이무침, 깍두기', dinner: '흰밥, 배추국, 제육볶음, 도토리묵무침, 배추김치', calories: 1700 },
];

interface DietAlert {
  resident: string;
  room: string;
  type: string;
  note: string;
}

const alertTypeColors: Record<string, string> = {
  '저염식': 'bg-blue-100 text-blue-800',
  '저당식': 'bg-yellow-100 text-yellow-800',
  '연하식(다진식)': 'bg-red-100 text-red-800',
  '연하식(미음)': 'bg-red-100 text-red-800',
  '저단백식': 'bg-purple-100 text-purple-800',
  '저지방식': 'bg-green-100 text-green-800',
};

type MealType = 'breakfast' | 'lunch' | 'dinner';

const tabs = [
  { id: 'register', label: '주간식단 등록', path: '/meal/plan/register' },
  { id: 'view', label: '식단표 조회', path: '/meal/plan/view' },
  { id: 'ai', label: 'AI 맞춤식단', path: '/meal/plan/ai' },
];

export default function MealPlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split('/').pop() || '';

  const [residents] = useResidents();
  const dietAlerts = useMemo<DietAlert[]>(() =>
    residents
      .filter(r => r.status !== 'DISCHARGED' && r.dietaryRestrictions.length > 0)
      .map(r => ({
        resident: r.name,
        room: `${r.roomNumber}호`,
        type: r.dietaryRestrictions[0],
        note: r.dietaryRestrictions.join(', ') + ` (${r.diseases.slice(0, 2).join(', ')})`,
      })),
    [residents],
  );

  const [meals, setMeals] = useState<DayMeal[]>(initialMeals);
  const [editCell, setEditCell] = useState<{ dayIdx: number; meal: MealType } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [registerForm, setRegisterForm] = useState({ week: '2026-04-W1', note: '' });

  const startEdit = (dayIdx: number, meal: MealType) => {
    setEditCell({ dayIdx, meal });
    setEditValue(meals[dayIdx][meal]);
  };

  const saveEdit = () => {
    if (!editCell) return;
    setMeals(prev => prev.map((m, i) => {
      if (i !== editCell.dayIdx) return m;
      return { ...m, [editCell.meal]: editValue };
    }));
    setEditCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditCell(null);
    setEditValue('');
  };

  const mealLabel = (meal: MealType) => {
    const map: Record<MealType, string> = { breakfast: '아침', lunch: '점심', dinner: '저녁' };
    return map[meal];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">식단관리</h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* register: 주간식단 등록 폼 */}
      {segment === 'register' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">주간 평균 칼로리</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(meals.reduce((s, m) => s + m.calories, 0) / 7)} kcal</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">특별식 대상자</p>
              <p className="text-2xl font-bold text-orange-600">{dietAlerts.length}명</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">등록 주차</p>
              <p className="text-2xl font-bold text-blue-600">4월 1주차</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">주간식단 등록</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주차 선택</label>
                <input
                  type="week"
                  value={registerForm.week}
                  onChange={e => setRegisterForm({ ...registerForm, week: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
                <input
                  type="text"
                  value={registerForm.note}
                  onChange={e => setRegisterForm({ ...registerForm, note: e.target.value })}
                  placeholder="특이사항 입력"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">아래 표에서 셀을 클릭하면 식단을 수정할 수 있습니다.</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 w-20">요일</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">아침</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">점심</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">저녁</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600 w-24">칼로리</th>
                  </tr>
                </thead>
                <tbody>
                  {meals.map((meal, idx) => (
                    <tr key={meal.day} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${
                          meal.day === '토요일' ? 'text-blue-600' :
                          meal.day === '일요일' ? 'text-red-600' : 'text-gray-900'
                        }`}>{meal.day}</span>
                      </td>
                      {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(mealType => (
                        <td
                          key={mealType}
                          className="px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => startEdit(idx, mealType)}
                        >
                          {meal[mealType]}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-sm text-gray-700 text-center font-medium">{meal.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#d9714d]">식단 저장</button>
            </div>
          </div>
        </div>
      )}

      {/* view: 식단표 조회 */}
      {segment === 'view' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">주간 평균 칼로리</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(meals.reduce((s, m) => s + m.calories, 0) / 7)} kcal</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">특별식 대상자</p>
              <p className="text-2xl font-bold text-orange-600">{dietAlerts.length}명</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-500">이번 주 식단</p>
              <p className="text-2xl font-bold text-blue-600">4월 1주차</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">주간 식단표 (4/1 ~ 4/7)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 w-20">요일</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">아침</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">점심</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">저녁</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600 w-24">칼로리</th>
                  </tr>
                </thead>
                <tbody>
                  {meals.map((meal, idx) => (
                    <tr key={meal.day} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${
                          meal.day === '토요일' ? 'text-blue-600' :
                          meal.day === '일요일' ? 'text-red-600' : 'text-gray-900'
                        }`}>{meal.day}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{meal.breakfast}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{meal.lunch}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{meal.dinner}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 text-center font-medium">{meal.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">특별식 주의사항</h2>
            <div className="space-y-3">
              {dietAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <span className="text-xl">&#9888;&#65039;</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{alert.resident}</span>
                      <span className="text-sm text-gray-500">{alert.room}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${alertTypeColors[alert.type] ?? 'bg-gray-100 text-gray-700'}`}>
                        {alert.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{alert.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ai: AI 맞춤식단 추천 */}
      {segment === 'ai' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">AI 맞춤식단 추천</h2>
            <p className="text-sm text-gray-600">입주자 개인별 건강상태, 질환, 식이제한을 분석하여 최적 식단을 추천합니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {residents.filter(r => r.status !== 'DISCHARGED').slice(0, 6).map(r => (
              <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-700">{r.roomNumber}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.building} {r.roomNumber}호 · 건강점수 {r.healthScore}점</p>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {r.dietaryRestrictions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {r.dietaryRestrictions.map(d => (
                        <span key={d} className="px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 rounded font-medium">{d}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">주요 질환: {r.diseases.slice(0, 2).join(', ') || '없음'}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-800 mb-1">AI 추천 식단 포인트</p>
                  <p className="text-xs text-blue-700">
                    {r.dietaryRestrictions.includes('저염식') ? '나트륨 1,500mg 이하 유지 · ' : ''}
                    {r.dietaryRestrictions.includes('저당식') ? '당류 30g 이하 · ' : ''}
                    {r.dietaryRestrictions.some(d => d.includes('연하식')) ? '다진식/미음 형태 제공 · ' : ''}
                    단백질 {r.mobilityLevel >= 3 ? '60g 이상' : '50g 이상'} 권장
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">주간 AI 추천 식단 (샘플)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">요일</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">일반식</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">저염식</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">연하식</th>
                  </tr>
                </thead>
                <tbody>
                  {['월', '화', '수', '목', '금'].map((day, i) => (
                    <tr key={day} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{day}요일</td>
                      <td className="px-4 py-3 text-gray-700">{meals[i].lunch}</td>
                      <td className="px-4 py-3 text-gray-600">저염 {meals[i].lunch.split(',')[0]}, 나트륨 조절 국물</td>
                      <td className="px-4 py-3 text-gray-600">다진 {meals[i].lunch.split(',')[0]}, 부드러운 반찬</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-6 py-2 bg-[#F0835A] text-white rounded-lg text-sm font-medium hover:bg-[#d9714d]">AI 추천 식단 적용</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {meals[editCell.dayIdx].day} {mealLabel(editCell.meal)} 수정
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">메뉴</label>
              <textarea value={editValue} onChange={e => setEditValue(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#F0835A]" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={cancelEdit} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={saveEdit} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
