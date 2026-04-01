import React, { useState } from 'react';
import { useResidents, useStaff } from '../context/AppStateContext';

interface TodoItem {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  dueTime?: string;
  relatedResident?: string;
  checked: boolean;
}

const priorityStyle: Record<string, string> = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-blue-100 text-blue-700 border-blue-200',
};

const priorityLabel: Record<string, string> = {
  HIGH: '긴급',
  MEDIUM: '중요',
  LOW: '참고',
};

function getTodosForRole(role: string, residents: any[], staff: any[]): TodoItem[] {
  const hospitalized = residents.filter((r: any) => r.status === 'HOSPITALIZED');
  const highRisk = residents.filter((r: any) => r.healthScore < 60);
  const dementia = residents.filter((r: any) => r.diseases.includes('치매'));

  switch (role) {
    case 'DIRECTOR':
      return [
        { id: 'd1', priority: 'HIGH', category: '경영', title: '월간 경영보고서 검토', description: '3월 경영실적 보고서가 준비되었습니다. 검토 및 승인이 필요합니다.', dueTime: '오전 중', checked: false },
        { id: 'd2', priority: 'HIGH', category: '인사', title: '직원 근무스케줄 승인', description: `4월 1주차 근무표 승인 대기 중 (${staff.filter(s => s.role !== 'DIRECTOR').length}명)`, dueTime: '오늘', checked: false },
        { id: 'd3', priority: 'MEDIUM', category: '입소', title: '신규 입소 상담 예정', description: '신규 입소 문의 2건이 접수되었습니다. 상담 일정을 확인하세요.', dueTime: '14:00', checked: false },
        { id: 'd4', priority: 'MEDIUM', category: '재무', title: '미수금 현황 확인', description: '이번 달 미수금 2건이 발생했습니다. 청구 현황을 확인하세요.', checked: false },
        { id: 'd5', priority: 'MEDIUM', category: '시설', title: '시설 안전점검 결과 확인', description: '월간 소방/전기 안전점검 결과가 등록되었습니다.', checked: false },
        { id: 'd6', priority: 'LOW', category: '운영', title: '입주율 현황 확인', description: `현재 입주자 ${residents.filter(r => r.status === 'ACTIVE').length}명 / 입원 ${hospitalized.length}명. 공실 현황을 확인하세요.`, checked: false },
        { id: 'd7', priority: 'LOW', category: '계약', title: '재계약 대상자 확인', description: '이번 분기 재계약 대상자 3명의 계약 갱신 일정을 확인하세요.', checked: false },
      ];

    case 'NURSE':
      return [
        { id: 'n1', priority: 'HIGH', category: '건강체크', title: '오전 바이탈사인 측정', description: `전체 입주자 ${residents.filter(r => r.status === 'ACTIVE').length}명의 오전 바이탈사인을 측정하세요.`, dueTime: '09:00', checked: false },
        { id: 'n2', priority: 'HIGH', category: '투약', title: '오전 투약 확인', description: `아침 투약 대상: ${residents.filter(r => r.medications.some(m => m.schedule.includes('아침'))).map(r => `${r.name}(${r.roomNumber}호)`).join(', ')}`, dueTime: '08:00', checked: false },
        { id: 'n3', priority: 'HIGH', category: '집중케어', title: '고위험 입주자 상태 확인', description: `건강점수 60점 미만: ${highRisk.map(r => `${r.name}(${r.healthScore}점)`).join(', ')}`, dueTime: '09:30', checked: false },
        { id: 'n4', priority: 'HIGH', category: '입원', title: '입원 환자 상태 확인', description: `${hospitalized.map(r => `${r.name}(${r.roomNumber}호) - ${r.diseases.join('/')}`).join('; ')} 병원 연락 필요`, checked: false },
        { id: 'n5', priority: 'MEDIUM', category: '상담', title: '건강상담 예약 확인', description: '오늘 건강상담 2건이 예약되어 있습니다. 상담 준비를 해주세요.', dueTime: '10:00, 14:00', checked: false },
        { id: 'n6', priority: 'MEDIUM', category: '치매케어', title: '치매 환자 인지활동 지원', description: `치매 환자: ${dementia.map(r => `${r.name}(${r.cognitiveLabelKo})`).join(', ')} - 인지활동 프로그램 참여 확인`, checked: false },
        { id: 'n7', priority: 'MEDIUM', category: 'IoT', title: 'IoT 장치 알림 확인', description: '미확인 IoT 알림 1건이 있습니다. 장치 상태를 점검하세요.', checked: false },
        { id: 'n8', priority: 'LOW', category: '기록', title: '건강기록 일지 정리', description: '어제 미작성 건강기록 2건을 정리하세요.', checked: false },
      ];

    case 'SOCIAL_WORKER':
      return [
        { id: 'sw1', priority: 'HIGH', category: '프로그램', title: '오전 프로그램 준비', description: '10:00 체조교실, 11:00 미술치료 프로그램 준비를 완료하세요.', dueTime: '09:30', checked: false },
        { id: 'sw2', priority: 'HIGH', category: '서비스', title: '서비스 신청 처리', description: '미처리 서비스 신청 3건이 있습니다. 확인 후 처리해주세요.', dueTime: '오전 중', checked: false },
        { id: 'sw3', priority: 'MEDIUM', category: '식사', title: '특별식 대상자 확인', description: `특별식 필요: ${residents.filter(r => r.dietaryRestrictions.length > 0).map(r => `${r.name}(${r.dietaryRestrictions[0]})`).join(', ')}`, dueTime: '11:30', checked: false },
        { id: 'sw4', priority: 'MEDIUM', category: '상담', title: '입소 상담 일정', description: '신규 입소 상담 1건이 오후에 예정되어 있습니다.', dueTime: '14:00', checked: false },
        { id: 'sw5', priority: 'MEDIUM', category: '민원', title: '민원 처리 현황', description: '미처리 민원 2건을 확인하고 처리 계획을 수립하세요.', checked: false },
        { id: 'sw6', priority: 'MEDIUM', category: '행사', title: '4월 행사 준비', description: '가족초청 다과회(4/5) 준비 현황을 점검하세요.', checked: false },
        { id: 'sw7', priority: 'LOW', category: '외출', title: '장기외출 입주자 확인', description: '현재 장기외출 중인 입주자 현황을 확인하세요.', checked: false },
        { id: 'sw8', priority: 'LOW', category: '기록', title: '프로그램 참여 기록 정리', description: '어제 프로그램 출석부 및 참여 기록을 정리하세요.', checked: false },
      ];

    default:
      return [];
  }
}

function getRoleGreeting(role: string, name: string): { title: string; subtitle: string } {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? '좋은 아침입니다' : hour < 18 ? '안녕하세요' : '수고하셨습니다';

  switch (role) {
    case 'DIRECTOR':
      return { title: `${timeGreeting}, ${name} 시설장님`, subtitle: '오늘의 경영관리 현황입니다.' };
    case 'NURSE':
      return { title: `${timeGreeting}, ${name} 간호사님`, subtitle: '오늘의 건강관리 업무입니다.' };
    case 'SOCIAL_WORKER':
      return { title: `${timeGreeting}, ${name} 선생님`, subtitle: '오늘의 생활지도 업무입니다.' };
    default:
      return { title: `${timeGreeting}`, subtitle: '오늘의 업무입니다.' };
  }
}

interface TodoNotificationProps {
  role: string;
  name: string;
}

export default function TodoNotification({ role, name }: TodoNotificationProps) {
  const [residents] = useResidents();
  const [staff] = useStaff();
  const [todos, setTodos] = useState<TodoItem[]>(() => getTodosForRole(role, residents, staff));
  const [isMinimized, setIsMinimized] = useState(false);
  const greeting = getRoleGreeting(role, name);

  const toggleCheck = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const completedCount = todos.filter(t => t.checked).length;
  const highCount = todos.filter(t => t.priority === 'HIGH' && !t.checked).length;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="w-full bg-white rounded-lg shadow border border-gray-200 px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📋</span>
          <span className="text-sm font-semibold text-gray-800">오늘의 업무 ({completedCount}/{todos.length} 완료)</span>
          {highCount > 0 && (
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              긴급 {highCount}
            </span>
          )}
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100" style={{ background: 'linear-gradient(135deg, #FFF5F0 0%, #FFF 100%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">{greeting.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{greeting.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <div className="text-xs text-gray-500">완료율</div>
              <div className="text-sm font-bold" style={{ color: '#F0835A' }}>
                {todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0}%
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="접기"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${todos.length > 0 ? (completedCount / todos.length) * 100 : 0}%`, backgroundColor: '#F0835A' }}
          />
        </div>
      </div>

      {/* Todo list */}
      <div className="divide-y divide-gray-50">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-start gap-3 px-5 py-3 transition-colors ${todo.checked ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}
          >
            <button
              onClick={() => toggleCheck(todo.id)}
              className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                todo.checked
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 hover:border-[#F0835A]'
              }`}
            >
              {todo.checked && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded border ${priorityStyle[todo.priority]}`}>
                  {priorityLabel[todo.priority]}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">{todo.category}</span>
                {todo.dueTime && (
                  <span className="text-[10px] text-gray-400">· {todo.dueTime}</span>
                )}
              </div>
              <p className={`text-sm font-medium mt-0.5 ${todo.checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
              </p>
              <p className={`text-xs mt-0.5 ${todo.checked ? 'text-gray-300' : 'text-gray-500'}`}>
                {todo.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {completedCount === todos.length
            ? '모든 업무를 완료했습니다! 수고하셨습니다.'
            : `${todos.length - completedCount}개의 업무가 남아있습니다.`}
        </span>
        <button
          onClick={() => setTodos(prev => prev.map(t => ({ ...t, checked: false })))}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
