import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateId } from '../../data/mockData';
import { useCollection, useStaff } from '../../context/AppStateContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PhoneConsultation {
  id: string;
  date: string;
  time: string;
  callerName: string;
  callerPhone: string;
  relationship: string;
  residentName: string;
  residentAge: number;
  residentGender: '남' | '여';
  careGrade: string;
  currentCondition: string;
  inquiryType: string;
  summary: string;
  result: string;
  counselor: string;
  status: '상담완료' | '콜백예정' | '방문예약' | '입주확정';
  callbackDate?: string;
}

interface VisitConsultation {
  id: string;
  visitDate: string;
  visitTime: string;
  visitorName: string;
  visitorPhone: string;
  relationship: string;
  residentName: string;
  residentAge: number;
  careGrade: string;
  tourType: '시설견학' | '상담방문' | '체험입주';
  areas: string[];
  counselor: string;
  summary: string;
  result: '입주확정' | '재방문예정' | '검토중' | '거절';
  followUpDate?: string;
  status: '예약' | '완료' | '취소';
}

// ---------------------------------------------------------------------------
// Color maps
// ---------------------------------------------------------------------------
const phoneStatusColor: Record<string, string> = {
  '상담완료': 'bg-green-100 text-green-800',
  '콜백예정': 'bg-yellow-100 text-yellow-800',
  '방문예약': 'bg-blue-100 text-blue-800',
  '입주확정': 'bg-purple-100 text-purple-800',
};

const visitStatusColor: Record<string, string> = {
  '예약': 'bg-blue-100 text-blue-800',
  '완료': 'bg-green-100 text-green-800',
  '취소': 'bg-red-100 text-red-800',
};

const visitResultColor: Record<string, string> = {
  '입주확정': 'bg-purple-100 text-purple-800',
  '재방문예정': 'bg-blue-100 text-blue-800',
  '검토중': 'bg-yellow-100 text-yellow-800',
  '거절': 'bg-red-100 text-red-800',
};

const tourTypeColor: Record<string, string> = {
  '시설견학': 'bg-teal-100 text-teal-700',
  '상담방문': 'bg-orange-100 text-orange-700',
  '체험입주': 'bg-indigo-100 text-indigo-700',
};

const inquiryTypeColor: Record<string, string> = {
  '비용문의': 'bg-green-100 text-green-700',
  '시설문의': 'bg-blue-100 text-blue-700',
  '프로그램문의': 'bg-purple-100 text-purple-700',
  '입소절차': 'bg-orange-100 text-orange-700',
  '기타': 'bg-gray-100 text-gray-700',
};

// ---------------------------------------------------------------------------
// Initial data
// ---------------------------------------------------------------------------
const initialPhoneData: PhoneConsultation[] = [
  { id: 'pc-1', date: '2026-03-28', time: '09:30', callerName: '김민수', callerPhone: '010-2345-6789', relationship: '자녀', residentName: '김영순', residentAge: 82, residentGender: '여', careGrade: '3등급', currentCondition: '치매 초기, 고혈압', inquiryType: '비용문의', summary: '어머니 요양시설 입소 비용 및 장기요양보험 적용 범위 문의', result: '월 비용 안내 완료, 등급별 본인부담금 설명', counselor: '박지연', status: '콜백예정', callbackDate: '2026-04-02' },
  { id: 'pc-2', date: '2026-03-28', time: '11:00', callerName: '이정희', callerPhone: '010-3456-7890', relationship: '본인', residentName: '이정희', residentAge: 78, residentGender: '여', careGrade: '등급외', currentCondition: '관절염, 경미한 보행장애', inquiryType: '시설문의', summary: '1인실 시설 환경 및 편의시설, 식사 서비스 문의', result: '시설 안내 자료 이메일 발송, 방문 상담 권유', counselor: '최수진', status: '방문예약' },
  { id: 'pc-3', date: '2026-03-27', time: '14:00', callerName: '박상훈', callerPhone: '010-4567-8901', relationship: '자녀', residentName: '박복순', residentAge: 85, residentGender: '여', careGrade: '4등급', currentCondition: '뇌졸중 후유증, 편마비', inquiryType: '입소절차', summary: '어머니 뇌졸중 후 재활 가능한 시설 입소 절차 문의', result: '입소 서류 목록 안내, 장기요양인정서 필요 설명', counselor: '박지연', status: '상담완료' },
  { id: 'pc-4', date: '2026-03-27', time: '16:30', callerName: '최영호', callerPhone: '010-5678-9012', relationship: '배우자', residentName: '최말자', residentAge: 79, residentGender: '여', careGrade: '3등급', currentCondition: '파킨슨병, 경도 인지장애', inquiryType: '프로그램문의', summary: '파킨슨 환자 전문 케어 프로그램 및 물리치료 가능 여부', result: '케어 프로그램 브로셔 발송, 담당 간호사 상담 연결 예정', counselor: '최수진', status: '콜백예정', callbackDate: '2026-04-01' },
  { id: 'pc-5', date: '2026-03-26', time: '10:00', callerName: '정수빈', callerPhone: '010-6789-0123', relationship: '자녀', residentName: '정기태', residentAge: 88, residentGender: '남', careGrade: '4등급', currentCondition: '치매 중기, 당뇨', inquiryType: '비용문의', summary: '아버지 장기요양 4등급 판정 후 입소 비용 및 보증금 문의', result: '보증금 및 월 비용 상세 안내, 청약 절차 설명', counselor: '박지연', status: '입주확정' },
  { id: 'pc-6', date: '2026-03-25', time: '13:30', callerName: '한미영', callerPhone: '010-7890-1234', relationship: '자녀', residentName: '한말순', residentAge: 90, residentGender: '여', careGrade: '3등급', currentCondition: '고혈압, 골다공증', inquiryType: '시설문의', summary: '2인실 환경 및 동반 입소 가능 여부 문의', result: '2인실 현재 대기 1명, 입소 가능 시기 안내', counselor: '최수진', status: '상담완료' },
  { id: 'pc-7', date: '2026-03-25', time: '15:00', callerName: '오세진', callerPhone: '010-8901-2345', relationship: '본인', residentName: '오세진', residentAge: 76, residentGender: '남', careGrade: '등급외', currentCondition: '경미한 관절염', inquiryType: '프로그램문의', summary: '건강한 노후 생활 위한 프로그램 및 커뮤니티 활동 문의', result: '프로그램 일정표 및 커뮤니티 활동 안내 발송', counselor: '박지연', status: '상담완료' },
  { id: 'pc-8', date: '2026-03-24', time: '09:00', callerName: '송현우', callerPhone: '010-9012-3456', relationship: '자녀', residentName: '송미경', residentAge: 83, residentGender: '여', careGrade: '3등급', currentCondition: '심부전, 고혈압', inquiryType: '입소절차', summary: '어머니 퇴원 후 요양시설 입소 긴급 상담', result: '긴급 입소 절차 안내, 의료 기록 확인 필요 설명', counselor: '최수진', status: '방문예약' },
  { id: 'pc-9', date: '2026-03-23', time: '11:30', callerName: '윤지영', callerPhone: '010-0123-4567', relationship: '자녀', residentName: '윤태식', residentAge: 81, residentGender: '남', careGrade: '4등급', currentCondition: '뇌졸중 후유증, 치매 초기', inquiryType: '비용문의', summary: '아버지 장기요양 4등급 시설 이용 비용 및 국가 지원 문의', result: '장기요양보험 급여 안내, 본인부담금 계산서 발송', counselor: '박지연', status: '콜백예정', callbackDate: '2026-04-03' },
  { id: 'pc-10', date: '2026-03-22', time: '14:30', callerName: '강민호', callerPhone: '010-1234-5670', relationship: '기타', residentName: '강옥희', residentAge: 87, residentGender: '여', careGrade: '3등급', currentCondition: '관절염, 우울증', inquiryType: '기타', summary: '지인 소개로 시설 평판 및 입소 후기 문의', result: '시설 소개 자료 및 만족도 조사 결과 공유', counselor: '최수진', status: '상담완료' },
];

const initialVisitData: VisitConsultation[] = [
  { id: 'vc-1', visitDate: '2026-04-02', visitTime: '10:00', visitorName: '이정희', visitorPhone: '010-3456-7890', relationship: '본인', residentName: '이정희', residentAge: 78, careGrade: '등급외', tourType: '시설견학', areas: ['거실', '식당', '프로그램실', '호실'], counselor: '박지연', summary: '1인실 환경 직접 확인 희망, 식단 및 프로그램 체험 관심', result: '검토중', followUpDate: '2026-04-05', status: '예약' },
  { id: 'vc-2', visitDate: '2026-04-01', visitTime: '14:00', visitorName: '송현우', visitorPhone: '010-9012-3456', relationship: '자녀', residentName: '송미경', residentAge: 83, careGrade: '3등급', tourType: '상담방문', areas: ['거실', '호실', '간호스테이션'], counselor: '최수진', summary: '어머니 퇴원 후 입소 가능 여부 최종 상담', result: '검토중', followUpDate: '2026-04-03', status: '예약' },
  { id: 'vc-3', visitDate: '2026-03-29', visitTime: '11:00', visitorName: '김민수', visitorPhone: '010-2345-6789', relationship: '자녀', residentName: '김영순', residentAge: 82, careGrade: '3등급', tourType: '시설견학', areas: ['거실', '식당', '프로그램실', '호실', '정원'], counselor: '박지연', summary: '어머니 치매 케어 환경 확인, 전체 시설 투어', result: '재방문예정', followUpDate: '2026-04-05', status: '완료' },
  { id: 'vc-4', visitDate: '2026-03-28', visitTime: '15:00', visitorName: '정수빈', visitorPhone: '010-6789-0123', relationship: '자녀', residentName: '정기태', residentAge: 88, careGrade: '4등급', tourType: '상담방문', areas: ['호실', '간호스테이션'], counselor: '최수진', summary: '아버지 입소 계약 관련 최종 상담, 호실 배정 논의', result: '입주확정', status: '완료' },
  { id: 'vc-5', visitDate: '2026-03-27', visitTime: '10:30', visitorName: '최영호', visitorPhone: '010-5678-9012', relationship: '배우자', residentName: '최말자', residentAge: 79, careGrade: '3등급', tourType: '체험입주', areas: ['호실', '식당', '프로그램실', '물리치료실'], counselor: '박지연', summary: '파킨슨 환자 체험 입주 3일간 진행, 케어 환경 체험', result: '재방문예정', followUpDate: '2026-04-08', status: '완료' },
  { id: 'vc-6', visitDate: '2026-03-26', visitTime: '14:00', visitorName: '한미영', visitorPhone: '010-7890-1234', relationship: '자녀', residentName: '한말순', residentAge: 90, careGrade: '3등급', tourType: '시설견학', areas: ['거실', '식당', '호실'], counselor: '최수진', summary: '2인실 환경 확인, 식사 시간 참관', result: '검토중', followUpDate: '2026-04-10', status: '완료' },
  { id: 'vc-7', visitDate: '2026-03-25', visitTime: '09:30', visitorName: '박상훈', visitorPhone: '010-4567-8901', relationship: '자녀', residentName: '박복순', residentAge: 85, careGrade: '4등급', tourType: '상담방문', areas: ['간호스테이션', '호실', '재활실'], counselor: '박지연', summary: '뇌졸중 재활 프로그램 상세 상담, 의료진 면담', result: '거절', status: '완료' },
  { id: 'vc-8', visitDate: '2026-04-04', visitTime: '11:00', visitorName: '강민호', visitorPhone: '010-1234-5670', relationship: '기타', residentName: '강옥희', residentAge: 87, careGrade: '3등급', tourType: '시설견학', areas: ['거실', '식당', '프로그램실', '정원'], counselor: '최수진', summary: '지인 대리 방문, 시설 전반 견학 예정', result: '검토중', status: '예약' },
];

// ---------------------------------------------------------------------------
// Sub-tab definitions
// ---------------------------------------------------------------------------
const tabs = [
  { id: 'phone/register', label: '전화상담 접수', path: '/consultation/phone/register' },
  { id: 'phone/list', label: '전화상담 내역', path: '/consultation/phone/list' },
  { id: 'phone/callback', label: '콜백 관리', path: '/consultation/phone/callback' },
  { id: 'visit/schedule', label: '방문 예약', path: '/consultation/visit/schedule' },
  { id: 'visit/list', label: '방문 내역', path: '/consultation/visit/list' },
  { id: 'visit/tour', label: '시설견학', path: '/consultation/visit/tour' },
  { id: 'status/pipeline', label: '파이프라인', path: '/consultation/status/pipeline' },
  { id: 'status/stats', label: '통계', path: '/consultation/status/stats' },
];

const allAreas = ['거실', '식당', '프로그램실', '호실', '정원', '간호스테이션', '물리치료실', '재활실'];

// ---------------------------------------------------------------------------
// Empty form templates
// ---------------------------------------------------------------------------
const emptyPhoneForm = {
  date: '', time: '', callerName: '', callerPhone: '', relationship: '자녀',
  residentName: '', residentAge: '', residentGender: '여' as '남' | '여',
  careGrade: '3등급', currentCondition: '', inquiryType: '비용문의',
  summary: '', result: '', counselor: '',
};

const emptyVisitForm = {
  visitDate: '', visitTime: '', visitorName: '', visitorPhone: '', relationship: '자녀',
  residentName: '', residentAge: '', careGrade: '3등급',
  tourType: '시설견학' as '시설견학' | '상담방문' | '체험입주',
  areas: [] as string[], counselor: '', summary: '',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdmissionCounselingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const segments = location.pathname.replace('/consultation/', '');
  const segment = segments || 'phone/register';

  const [staffList] = useStaff();
  const counselors = useMemo(() => staffList.filter(s => s.role === 'SOCIAL_WORKER' || s.role === 'MANAGER' || s.role === 'DIRECTOR').map(s => s.name), [staffList]);

  const [phoneData, setPhoneData] = useCollection<PhoneConsultation>('admissionPhone', initialPhoneData);
  const [visitData, setVisitData] = useCollection<VisitConsultation>('admissionVisit', initialVisitData);

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [phoneForm, setPhoneForm] = useState(emptyPhoneForm);
  const [visitForm, setVisitForm] = useState(emptyVisitForm);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [phoneStatusFilter, setPhoneStatusFilter] = useState('전체');
  const [visitSearch, setVisitSearch] = useState('');
  const [tourTypeFilter, setTourTypeFilter] = useState('전체');

  // Derived data
  const callbackList = useMemo(() => phoneData.filter(p => p.callbackDate), [phoneData]);
  const upcomingVisits = useMemo(() => visitData.filter(v => v.status === '예약').sort((a, b) => a.visitDate.localeCompare(b.visitDate)), [visitData]);

  const filteredPhone = useMemo(() => {
    let list = phoneData;
    if (phoneStatusFilter !== '전체') list = list.filter(p => p.status === phoneStatusFilter);
    if (phoneSearch) list = list.filter(p => p.callerName.includes(phoneSearch) || p.residentName.includes(phoneSearch) || p.summary.includes(phoneSearch));
    return list;
  }, [phoneData, phoneStatusFilter, phoneSearch]);

  const filteredVisit = useMemo(() => {
    let list = visitData;
    if (visitSearch) list = list.filter(v => v.visitorName.includes(visitSearch) || v.residentName.includes(visitSearch));
    return list;
  }, [visitData, visitSearch]);

  const filteredTour = useMemo(() => {
    let list = visitData;
    if (tourTypeFilter !== '전체') list = list.filter(v => v.tourType === tourTypeFilter);
    return list;
  }, [visitData, tourTypeFilter]);

  // Handlers
  const handlePhoneSave = () => {
    if (!phoneForm.callerName || !phoneForm.date) return;
    const newItem: PhoneConsultation = {
      id: generateId('apc'),
      date: phoneForm.date,
      time: phoneForm.time,
      callerName: phoneForm.callerName,
      callerPhone: phoneForm.callerPhone,
      relationship: phoneForm.relationship,
      residentName: phoneForm.residentName,
      residentAge: Number(phoneForm.residentAge) || 0,
      residentGender: phoneForm.residentGender,
      careGrade: phoneForm.careGrade,
      currentCondition: phoneForm.currentCondition,
      inquiryType: phoneForm.inquiryType,
      summary: phoneForm.summary,
      result: phoneForm.result,
      counselor: phoneForm.counselor || counselors[0] || '담당자',
      status: '상담완료',
    };
    setPhoneData(prev => [newItem, ...prev]);
    setPhoneForm(emptyPhoneForm);
    setShowPhoneModal(false);
  };

  const handleVisitSave = () => {
    if (!visitForm.visitorName || !visitForm.visitDate) return;
    const newItem: VisitConsultation = {
      id: generateId('avc'),
      visitDate: visitForm.visitDate,
      visitTime: visitForm.visitTime,
      visitorName: visitForm.visitorName,
      visitorPhone: visitForm.visitorPhone,
      relationship: visitForm.relationship,
      residentName: visitForm.residentName,
      residentAge: Number(visitForm.residentAge) || 0,
      careGrade: visitForm.careGrade,
      tourType: visitForm.tourType,
      areas: visitForm.areas,
      counselor: visitForm.counselor || counselors[0] || '담당자',
      summary: visitForm.summary,
      result: '검토중',
      status: '예약',
    };
    setVisitData(prev => [newItem, ...prev]);
    setVisitForm(emptyVisitForm);
    setShowVisitModal(false);
  };

  const changePhoneStatus = (id: string, status: PhoneConsultation['status']) => {
    setPhoneData(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const deletePhone = (id: string) => {
    setPhoneData(prev => prev.filter(p => p.id !== id));
  };

  const changeVisitStatus = (id: string, status: VisitConsultation['status']) => {
    setVisitData(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const changeVisitResult = (id: string, result: VisitConsultation['result']) => {
    setVisitData(prev => prev.map(v => v.id === id ? { ...v, result } : v));
  };

  const deleteVisit = (id: string) => {
    setVisitData(prev => prev.filter(v => v.id !== id));
  };

  // Pipeline stats
  const pipelineStats = useMemo(() => {
    const phoneTotal = phoneData.length;
    const visitTotal = visitData.filter(v => v.status === '완료').length;
    const trialTotal = visitData.filter(v => v.tourType === '체험입주' && v.status === '완료').length;
    const confirmedPhone = phoneData.filter(p => p.status === '입주확정').length;
    const confirmedVisit = visitData.filter(v => v.result === '입주확정').length;
    const confirmed = confirmedPhone + confirmedVisit;
    return { phoneTotal, visitTotal, trialTotal, confirmed };
  }, [phoneData, visitData]);

  // Stats
  const statsData = useMemo(() => {
    const byInquiry: Record<string, number> = {};
    phoneData.forEach(p => { byInquiry[p.inquiryType] = (byInquiry[p.inquiryType] || 0) + 1; });
    const byMonth: Record<string, { total: number; confirmed: number }> = {};
    phoneData.forEach(p => {
      const m = p.date.substring(0, 7);
      if (!byMonth[m]) byMonth[m] = { total: 0, confirmed: 0 };
      byMonth[m].total++;
      if (p.status === '입주확정') byMonth[m].confirmed++;
    });
    visitData.forEach(v => {
      const m = v.visitDate.substring(0, 7);
      if (!byMonth[m]) byMonth[m] = { total: 0, confirmed: 0 };
      byMonth[m].total++;
      if (v.result === '입주확정') byMonth[m].confirmed++;
    });
    const byCareGrade: Record<string, number> = {};
    phoneData.forEach(p => { byCareGrade[p.careGrade] = (byCareGrade[p.careGrade] || 0) + 1; });
    const totalConsult = phoneData.length + visitData.length;
    const totalConfirmed = phoneData.filter(p => p.status === '입주확정').length + visitData.filter(v => v.result === '입주확정').length;
    const conversionRate = totalConsult > 0 ? Math.round((totalConfirmed / totalConsult) * 100) : 0;
    return { byInquiry, byMonth, byCareGrade, totalConsult, totalConfirmed, conversionRate };
  }, [phoneData, visitData]);

  const recentFive = phoneData.slice(0, 5);

  // Shared input class
  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">입주상담</h1>
          <p className="mt-1 text-sm text-gray-500">예비 입주자 전화상담, 방문상담, 시설견학을 관리합니다.</p>
        </div>
        {(segment === 'phone/register' || segment === 'phone/list') && (
          <button onClick={() => setShowPhoneModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
            + 전화상담 접수
          </button>
        )}
        {(segment === 'visit/schedule' || segment === 'visit/list' || segment === 'visit/tour') && (
          <button onClick={() => setShowVisitModal(true)} className="px-4 py-2 bg-[#F0835A] text-white rounded-lg hover:bg-[#d9714d] font-medium text-sm transition-colors">
            + 방문상담 예약
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              segment === tab.id ? 'bg-white text-[#F0835A] shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================================================================= */}
      {/* phone/register - 전화상담 접수 */}
      {/* ================================================================= */}
      {segment === 'phone/register' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '총 전화상담', value: phoneData.length, color: 'text-gray-900' },
              { label: '콜백예정', value: phoneData.filter(p => p.status === '콜백예정').length, color: 'text-yellow-600' },
              { label: '방문예약 전환', value: phoneData.filter(p => p.status === '방문예약').length, color: 'text-blue-600' },
              { label: '입주확정', value: phoneData.filter(p => p.status === '입주확정').length, color: 'text-purple-600' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                <div className="text-sm text-gray-500 mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Quick registration form */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">빠른 전화상담 접수</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className={labelClass}>상담일자</label>
                <input type="date" value={phoneForm.date} onChange={e => setPhoneForm({ ...phoneForm, date: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>상담시간</label>
                <input type="time" value={phoneForm.time} onChange={e => setPhoneForm({ ...phoneForm, time: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>문의자명</label>
                <input type="text" value={phoneForm.callerName} onChange={e => setPhoneForm({ ...phoneForm, callerName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>연락처</label>
                <input type="text" value={phoneForm.callerPhone} onChange={e => setPhoneForm({ ...phoneForm, callerPhone: e.target.value })} placeholder="010-0000-0000" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
              <div>
                <label className={labelClass}>관계</label>
                <select value={phoneForm.relationship} onChange={e => setPhoneForm({ ...phoneForm, relationship: e.target.value })} className={inputClass}>
                  <option value="본인">본인</option>
                  <option value="자녀">자녀</option>
                  <option value="배우자">배우자</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>입주대상자</label>
                <input type="text" value={phoneForm.residentName} onChange={e => setPhoneForm({ ...phoneForm, residentName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>장기요양등급</label>
                <select value={phoneForm.careGrade} onChange={e => setPhoneForm({ ...phoneForm, careGrade: e.target.value })} className={inputClass}>
                  <option value="등급외">등급외</option>
                  <option value="1등급">1등급</option>
                  <option value="2등급">2등급</option>
                  <option value="3등급">3등급</option>
                  <option value="4등급">4등급</option>
                  <option value="5등급">5등급</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>문의유형</label>
                <select value={phoneForm.inquiryType} onChange={e => setPhoneForm({ ...phoneForm, inquiryType: e.target.value })} className={inputClass}>
                  <option value="비용문의">비용문의</option>
                  <option value="시설문의">시설문의</option>
                  <option value="프로그램문의">프로그램문의</option>
                  <option value="입소절차">입소절차</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>상담내용</label>
                <textarea value={phoneForm.summary} onChange={e => setPhoneForm({ ...phoneForm, summary: e.target.value })} rows={2} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>결과</label>
                <textarea value={phoneForm.result} onChange={e => setPhoneForm({ ...phoneForm, result: e.target.value })} rows={2} className={inputClass} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={handlePhoneSave} className="px-5 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d] font-medium">접수</button>
            </div>
          </div>

          {/* Recent 5 */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">최근 접수 (5건)</h2>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">일자</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">문의자</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">입주대상자</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">등급</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">유형</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">상담내용</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentFive.map(row => (
                      <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-4 py-3 text-gray-900 font-medium">{row.callerName}</td>
                        <td className="px-4 py-3 text-gray-700">{row.residentName} ({row.residentAge}세)</td>
                        <td className="px-4 py-3 text-gray-700">{row.careGrade}</td>
                        <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${inquiryTypeColor[row.inquiryType] || 'bg-gray-100 text-gray-700'}`}>{row.inquiryType}</span></td>
                        <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{row.summary}</td>
                        <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${phoneStatusColor[row.status]}`}>{row.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* phone/list - 전화상담 내역 */}
      {/* ================================================================= */}
      {segment === 'phone/list' && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <input type="text" placeholder="문의자 / 대상자 / 내용 검색..." value={phoneSearch} onChange={e => setPhoneSearch(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A] focus:border-transparent" />
            <select value={phoneStatusFilter} onChange={e => setPhoneStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]">
              <option value="전체">전체 상태</option>
              <option value="상담완료">상담완료</option>
              <option value="콜백예정">콜백예정</option>
              <option value="방문예약">방문예약</option>
              <option value="입주확정">입주확정</option>
            </select>
            <span className="text-sm text-gray-500 whitespace-nowrap">{filteredPhone.length}건</span>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">일자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">시간</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">문의자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">관계</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입주대상자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">등급</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">문의유형</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담내용</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담원</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhone.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-3 text-gray-700">{row.time}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.callerName}</td>
                      <td className="px-4 py-3 text-gray-700">{row.callerPhone}</td>
                      <td className="px-4 py-3 text-gray-700">{row.relationship}</td>
                      <td className="px-4 py-3 text-gray-700">{row.residentName} ({row.residentAge}세/{row.residentGender})</td>
                      <td className="px-4 py-3 text-gray-700">{row.careGrade}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${inquiryTypeColor[row.inquiryType] || 'bg-gray-100 text-gray-700'}`}>{row.inquiryType}</span></td>
                      <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={row.summary}>{row.summary}</td>
                      <td className="px-4 py-3 text-gray-700">{row.counselor}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${phoneStatusColor[row.status]}`}>{row.status}</span></td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          {row.status !== '입주확정' && (
                            <button onClick={() => changePhoneStatus(row.id, '입주확정')} className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600">확정</button>
                          )}
                          {row.status === '상담완료' && (
                            <button onClick={() => changePhoneStatus(row.id, '방문예약')} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">방문전환</button>
                          )}
                          <button onClick={() => deletePhone(row.id)} className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* phone/callback - 콜백 관리 */}
      {/* ================================================================= */}
      {segment === 'phone/callback' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700 font-medium">콜백 예정 건수: {callbackList.length}건</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">콜백일자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">최초상담일</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">문의자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">입주대상자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">등급</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">문의유형</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담내용</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">담당</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {callbackList.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-orange-600 font-medium whitespace-nowrap">{row.callbackDate}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.callerName}</td>
                      <td className="px-4 py-3 text-gray-700">{row.callerPhone}</td>
                      <td className="px-4 py-3 text-gray-700">{row.residentName} ({row.residentAge}세)</td>
                      <td className="px-4 py-3 text-gray-700">{row.careGrade}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${inquiryTypeColor[row.inquiryType] || 'bg-gray-100 text-gray-700'}`}>{row.inquiryType}</span></td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{row.summary}</td>
                      <td className="px-4 py-3 text-gray-700">{row.counselor}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${phoneStatusColor[row.status]}`}>{row.status}</span></td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          <button onClick={() => changePhoneStatus(row.id, '상담완료')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">완료</button>
                          <button onClick={() => changePhoneStatus(row.id, '방문예약')} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">방문전환</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* visit/schedule - 방문상담 예약 */}
      {/* ================================================================= */}
      {segment === 'visit/schedule' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '총 방문상담', value: visitData.length, color: 'text-gray-900' },
              { label: '예약 중', value: visitData.filter(v => v.status === '예약').length, color: 'text-blue-600' },
              { label: '완료', value: visitData.filter(v => v.status === '완료').length, color: 'text-green-600' },
              { label: '입주확정', value: visitData.filter(v => v.result === '입주확정').length, color: 'text-purple-600' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                <div className="text-sm text-gray-500 mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Quick visit registration form */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">빠른 방문상담 예약</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className={labelClass}>방문일자</label>
                <input type="date" value={visitForm.visitDate} onChange={e => setVisitForm({ ...visitForm, visitDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>방문시간</label>
                <input type="time" value={visitForm.visitTime} onChange={e => setVisitForm({ ...visitForm, visitTime: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>방문자명</label>
                <input type="text" value={visitForm.visitorName} onChange={e => setVisitForm({ ...visitForm, visitorName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>연락처</label>
                <input type="text" value={visitForm.visitorPhone} onChange={e => setVisitForm({ ...visitForm, visitorPhone: e.target.value })} placeholder="010-0000-0000" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
              <div>
                <label className={labelClass}>입주대상자</label>
                <input type="text" value={visitForm.residentName} onChange={e => setVisitForm({ ...visitForm, residentName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>방문유형</label>
                <select value={visitForm.tourType} onChange={e => setVisitForm({ ...visitForm, tourType: e.target.value as any })} className={inputClass}>
                  <option value="시설견학">시설견학</option>
                  <option value="상담방문">상담방문</option>
                  <option value="체험입주">체험입주</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>장기요양등급</label>
                <select value={visitForm.careGrade} onChange={e => setVisitForm({ ...visitForm, careGrade: e.target.value })} className={inputClass}>
                  <option value="등급외">등급외</option>
                  <option value="1등급">1등급</option>
                  <option value="2등급">2등급</option>
                  <option value="3등급">3등급</option>
                  <option value="4등급">4등급</option>
                  <option value="5등급">5등급</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>상담내용</label>
                <input type="text" value={visitForm.summary} onChange={e => setVisitForm({ ...visitForm, summary: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={handleVisitSave} className="px-5 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d] font-medium">예약 등록</button>
            </div>
          </div>

          {/* Upcoming visits */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">다가오는 방문 예약</h2>
            {upcomingVisits.length === 0 ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center text-gray-500">예약된 방문 상담이 없습니다.</div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">방문일자</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">시간</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">방문자</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">입주대상자</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">유형</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">견학영역</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">담당</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingVisits.map(row => (
                        <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-blue-600 font-medium whitespace-nowrap">{row.visitDate}</td>
                          <td className="px-4 py-3 text-gray-700">{row.visitTime}</td>
                          <td className="px-4 py-3 text-gray-900 font-medium">{row.visitorName}</td>
                          <td className="px-4 py-3 text-gray-700">{row.residentName} ({row.residentAge}세)</td>
                          <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${tourTypeColor[row.tourType]}`}>{row.tourType}</span></td>
                          <td className="px-4 py-3 text-gray-700 text-xs">{row.areas.join(', ')}</td>
                          <td className="px-4 py-3 text-gray-700">{row.counselor}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex gap-1">
                              <button onClick={() => changeVisitStatus(row.id, '완료')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">완료</button>
                              <button onClick={() => changeVisitStatus(row.id, '취소')} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">취소</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* visit/list - 방문상담 내역 */}
      {/* ================================================================= */}
      {segment === 'visit/list' && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <input type="text" placeholder="방문자 / 대상자 검색..." value={visitSearch} onChange={e => setVisitSearch(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A] focus:border-transparent" />
            <span className="text-sm text-gray-500 whitespace-nowrap">{filteredVisit.length}건</span>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">방문일</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">시간</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">방문자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">연락처</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">대상자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">등급</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">유형</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상담내용</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">결과</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisit.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.visitDate}</td>
                      <td className="px-4 py-3 text-gray-700">{row.visitTime}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.visitorName}</td>
                      <td className="px-4 py-3 text-gray-700">{row.visitorPhone}</td>
                      <td className="px-4 py-3 text-gray-700">{row.residentName} ({row.residentAge}세)</td>
                      <td className="px-4 py-3 text-gray-700">{row.careGrade}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${tourTypeColor[row.tourType]}`}>{row.tourType}</span></td>
                      <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={row.summary}>{row.summary}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${visitResultColor[row.result]}`}>{row.result}</span></td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${visitStatusColor[row.status]}`}>{row.status}</span></td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          {row.status === '예약' && (
                            <button onClick={() => changeVisitStatus(row.id, '완료')} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">완료</button>
                          )}
                          {row.result !== '입주확정' && row.status === '완료' && (
                            <button onClick={() => changeVisitResult(row.id, '입주확정')} className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600">확정</button>
                          )}
                          <button onClick={() => deleteVisit(row.id)} className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* visit/tour - 시설견학 관리 */}
      {/* ================================================================= */}
      {segment === 'visit/tour' && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <select value={tourTypeFilter} onChange={e => setTourTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F0835A]">
              <option value="전체">전체 유형</option>
              <option value="시설견학">시설견학</option>
              <option value="상담방문">상담방문</option>
              <option value="체험입주">체험입주</option>
            </select>
            <span className="text-sm text-gray-500">{filteredTour.length}건</span>
          </div>

          {/* Area stats */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">견학 영역별 방문 빈도</h2>
            <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
              {allAreas.map(area => {
                const count = visitData.filter(v => v.areas.includes(area)).length;
                return (
                  <div key={area} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-500 mt-1">{area}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">방문일</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">방문자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">대상자</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">유형</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">견학 영역</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">결과</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">후속일정</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTour.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.visitDate}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{row.visitorName}</td>
                      <td className="px-4 py-3 text-gray-700">{row.residentName}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${tourTypeColor[row.tourType]}`}>{row.tourType}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {row.areas.map(a => (
                            <span key={a} className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{a}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${visitResultColor[row.result]}`}>{row.result}</span></td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{row.followUpDate || '-'}</td>
                      <td className="px-4 py-3"><span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${visitStatusColor[row.status]}`}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* status/pipeline - 입주 파이프라인 */}
      {/* ================================================================= */}
      {segment === 'status/pipeline' && (
        <div className="space-y-6">
          {/* Pipeline stages */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { stage: '전화상담', count: pipelineStats.phoneTotal, icon: '📞', color: 'border-blue-400 bg-blue-50', textColor: 'text-blue-700' },
              { stage: '방문상담', count: pipelineStats.visitTotal, icon: '🏠', color: 'border-green-400 bg-green-50', textColor: 'text-green-700' },
              { stage: '체험입주', count: pipelineStats.trialTotal, icon: '🏡', color: 'border-orange-400 bg-orange-50', textColor: 'text-orange-700' },
              { stage: '입주확정', count: pipelineStats.confirmed, icon: '✅', color: 'border-purple-400 bg-purple-50', textColor: 'text-purple-700' },
            ].map((s, i) => (
              <React.Fragment key={s.stage}>
                <div className={`rounded-lg border-2 ${s.color} p-5 text-center`}>
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className={`text-3xl font-bold ${s.textColor}`}>{s.count}</div>
                  <div className="text-sm text-gray-600 mt-1 font-medium">{s.stage}</div>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Arrow flow */}
          <div className="flex items-center justify-center gap-2 text-gray-400 text-2xl">
            <span>전화상담</span> <span>→</span> <span>방문상담</span> <span>→</span> <span>체험입주</span> <span>→</span> <span className="text-purple-600 font-bold">입주확정</span>
          </div>

          {/* Recent confirmed */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">입주확정 대상자</h2>
            <div className="space-y-3">
              {phoneData.filter(p => p.status === '입주확정').map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-4">
                    <span className="text-purple-600 font-bold">{p.residentName}</span>
                    <span className="text-sm text-gray-600">{p.residentAge}세 / {p.residentGender}</span>
                    <span className="text-sm text-gray-600">{p.careGrade}</span>
                    <span className="text-xs text-gray-500">{p.currentCondition}</span>
                  </div>
                  <div className="text-sm text-gray-500">문의자: {p.callerName} ({p.relationship})</div>
                </div>
              ))}
              {visitData.filter(v => v.result === '입주확정').map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-4">
                    <span className="text-purple-600 font-bold">{v.residentName}</span>
                    <span className="text-sm text-gray-600">{v.residentAge}세</span>
                    <span className="text-sm text-gray-600">{v.careGrade}</span>
                    <span className="text-xs text-gray-500">{v.tourType}을 통한 확정</span>
                  </div>
                  <div className="text-sm text-gray-500">방문자: {v.visitorName} ({v.relationship})</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending follow-ups */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">후속 조치 필요</h2>
            <div className="space-y-2">
              {phoneData.filter(p => p.status === '콜백예정').map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-800 font-medium">콜백</span>
                    <span className="font-medium text-gray-900">{p.residentName}</span>
                    <span className="text-sm text-gray-600">({p.callerName})</span>
                  </div>
                  <span className="text-sm text-orange-600 font-medium">{p.callbackDate}</span>
                </div>
              ))}
              {visitData.filter(v => v.result === '재방문예정' && v.followUpDate).map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-200 text-blue-800 font-medium">재방문</span>
                    <span className="font-medium text-gray-900">{v.residentName}</span>
                    <span className="text-sm text-gray-600">({v.visitorName})</span>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">{v.followUpDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* status/stats - 상담 통계 */}
      {/* ================================================================= */}
      {segment === 'status/stats' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '총 상담건수', value: statsData.totalConsult, color: 'text-gray-900' },
              { label: '전화상담', value: phoneData.length, color: 'text-blue-600' },
              { label: '방문상담', value: visitData.length, color: 'text-green-600' },
              { label: '전환율', value: `${statsData.conversionRate}%`, color: 'text-[#F0835A]' },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-lg shadow border border-gray-200 p-4 text-center">
                <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                <div className="text-sm text-gray-500 mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Inquiry type breakdown */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">문의유형별 건수</h2>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(statsData.byInquiry).map(([type, count]) => (
                <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900">{count}</div>
                  <div className="mt-2 text-sm text-gray-500">{type}</div>
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div className="bg-[#F0835A] h-2 rounded-full" style={{ width: `${Math.round((count / phoneData.length) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Care grade distribution */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">장기요양등급별 문의 분포</h2>
            <div className="grid grid-cols-6 gap-3">
              {Object.entries(statsData.byCareGrade).map(([grade, count]) => (
                <div key={grade} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-xs text-gray-500 mt-1">{grade}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly trend */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">월별 상담 추이</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">월</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">총 상담</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">입주확정</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">전환율</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(statsData.byMonth).sort(([a], [b]) => a.localeCompare(b)).map(([month, data]) => {
                    const rate = data.total > 0 ? Math.round((data.confirmed / data.total) * 100) : 0;
                    return (
                      <tr key={month} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">{month}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{data.total}건</td>
                        <td className="px-4 py-3 text-right text-purple-600 font-medium">{data.confirmed}건</td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">{rate}%</td>
                        <td className="px-4 py-3">
                          <div className="bg-gray-200 rounded-full h-2 w-32">
                            <div className="bg-[#F0835A] h-2 rounded-full" style={{ width: `${rate}%` }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conversion funnel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">전환 퍼널</h2>
            <div className="space-y-3">
              {[
                { label: '전화상담', count: phoneData.length, pct: 100 },
                { label: '방문상담 전환', count: phoneData.filter(p => p.status === '방문예약').length + visitData.length, pct: Math.round(((phoneData.filter(p => p.status === '방문예약').length + visitData.length) / Math.max(phoneData.length, 1)) * 100) },
                { label: '체험입주', count: visitData.filter(v => v.tourType === '체험입주').length, pct: Math.round((visitData.filter(v => v.tourType === '체험입주').length / Math.max(phoneData.length, 1)) * 100) },
                { label: '입주확정', count: statsData.totalConfirmed, pct: statsData.conversionRate },
              ].map(step => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-gray-700">{step.label}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div className="bg-[#F0835A] h-6 rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max(step.pct, 5)}%` }}>
                      <span className="text-xs text-white font-medium">{step.count}건</span>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-bold text-gray-900">{step.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* Phone consultation modal */}
      {/* ================================================================= */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900">전화상담 접수</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>상담일자</label>
                <input type="date" value={phoneForm.date} onChange={e => setPhoneForm({ ...phoneForm, date: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>상담시간</label>
                <input type="time" value={phoneForm.time} onChange={e => setPhoneForm({ ...phoneForm, time: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>문의자명</label>
                <input type="text" value={phoneForm.callerName} onChange={e => setPhoneForm({ ...phoneForm, callerName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>연락처</label>
                <input type="text" value={phoneForm.callerPhone} onChange={e => setPhoneForm({ ...phoneForm, callerPhone: e.target.value })} placeholder="010-0000-0000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>관계</label>
                <select value={phoneForm.relationship} onChange={e => setPhoneForm({ ...phoneForm, relationship: e.target.value })} className={inputClass}>
                  <option value="본인">본인</option>
                  <option value="자녀">자녀</option>
                  <option value="배우자">배우자</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>입주 대상자</label>
                <input type="text" value={phoneForm.residentName} onChange={e => setPhoneForm({ ...phoneForm, residentName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>대상자 나이</label>
                <input type="number" value={phoneForm.residentAge} onChange={e => setPhoneForm({ ...phoneForm, residentAge: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>성별</label>
                <select value={phoneForm.residentGender} onChange={e => setPhoneForm({ ...phoneForm, residentGender: e.target.value as '남' | '여' })} className={inputClass}>
                  <option value="여">여</option>
                  <option value="남">남</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>장기요양등급</label>
                <select value={phoneForm.careGrade} onChange={e => setPhoneForm({ ...phoneForm, careGrade: e.target.value })} className={inputClass}>
                  <option value="등급외">등급외</option>
                  <option value="1등급">1등급</option>
                  <option value="2등급">2등급</option>
                  <option value="3등급">3등급</option>
                  <option value="4등급">4등급</option>
                  <option value="5등급">5등급</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>문의유형</label>
                <select value={phoneForm.inquiryType} onChange={e => setPhoneForm({ ...phoneForm, inquiryType: e.target.value })} className={inputClass}>
                  <option value="비용문의">비용문의</option>
                  <option value="시설문의">시설문의</option>
                  <option value="프로그램문의">프로그램문의</option>
                  <option value="입소절차">입소절차</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>주요 질환/상태</label>
              <input type="text" value={phoneForm.currentCondition} onChange={e => setPhoneForm({ ...phoneForm, currentCondition: e.target.value })} placeholder="예: 치매, 고혈압, 관절염" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>상담내용</label>
              <textarea value={phoneForm.summary} onChange={e => setPhoneForm({ ...phoneForm, summary: e.target.value })} rows={3} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>결과</label>
              <input type="text" value={phoneForm.result} onChange={e => setPhoneForm({ ...phoneForm, result: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>상담원</label>
              <select value={phoneForm.counselor} onChange={e => setPhoneForm({ ...phoneForm, counselor: e.target.value })} className={inputClass}>
                <option value="">선택</option>
                {counselors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setShowPhoneModal(false); setPhoneForm(emptyPhoneForm); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handlePhoneSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* Visit consultation modal */}
      {/* ================================================================= */}
      {showVisitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900">방문상담 예약</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>방문일자</label>
                <input type="date" value={visitForm.visitDate} onChange={e => setVisitForm({ ...visitForm, visitDate: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>방문시간</label>
                <input type="time" value={visitForm.visitTime} onChange={e => setVisitForm({ ...visitForm, visitTime: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>방문자명</label>
                <input type="text" value={visitForm.visitorName} onChange={e => setVisitForm({ ...visitForm, visitorName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>연락처</label>
                <input type="text" value={visitForm.visitorPhone} onChange={e => setVisitForm({ ...visitForm, visitorPhone: e.target.value })} placeholder="010-0000-0000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>관계</label>
                <select value={visitForm.relationship} onChange={e => setVisitForm({ ...visitForm, relationship: e.target.value })} className={inputClass}>
                  <option value="본인">본인</option>
                  <option value="자녀">자녀</option>
                  <option value="배우자">배우자</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>입주 대상자</label>
                <input type="text" value={visitForm.residentName} onChange={e => setVisitForm({ ...visitForm, residentName: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>대상자 나이</label>
                <input type="number" value={visitForm.residentAge} onChange={e => setVisitForm({ ...visitForm, residentAge: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>장기요양등급</label>
                <select value={visitForm.careGrade} onChange={e => setVisitForm({ ...visitForm, careGrade: e.target.value })} className={inputClass}>
                  <option value="등급외">등급외</option>
                  <option value="1등급">1등급</option>
                  <option value="2등급">2등급</option>
                  <option value="3등급">3등급</option>
                  <option value="4등급">4등급</option>
                  <option value="5등급">5등급</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>방문유형</label>
                <select value={visitForm.tourType} onChange={e => setVisitForm({ ...visitForm, tourType: e.target.value as any })} className={inputClass}>
                  <option value="시설견학">시설견학</option>
                  <option value="상담방문">상담방문</option>
                  <option value="체험입주">체험입주</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>상담원</label>
                <select value={visitForm.counselor} onChange={e => setVisitForm({ ...visitForm, counselor: e.target.value })} className={inputClass}>
                  <option value="">선택</option>
                  {counselors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>견학 영역 (복수 선택)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {allAreas.map(area => (
                  <label key={area} className="flex items-center gap-1.5 text-sm">
                    <input type="checkbox" checked={visitForm.areas.includes(area)}
                      onChange={e => {
                        if (e.target.checked) setVisitForm({ ...visitForm, areas: [...visitForm.areas, area] });
                        else setVisitForm({ ...visitForm, areas: visitForm.areas.filter(a => a !== area) });
                      }}
                      className="rounded border-gray-300 text-[#F0835A] focus:ring-[#F0835A]" />
                    {area}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>상담내용</label>
              <textarea value={visitForm.summary} onChange={e => setVisitForm({ ...visitForm, summary: e.target.value })} rows={3} className={inputClass} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => { setShowVisitModal(false); setVisitForm(emptyVisitForm); }} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">취소</button>
              <button onClick={handleVisitSave} className="px-4 py-2 text-sm text-white bg-[#F0835A] rounded-lg hover:bg-[#d9714d]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
