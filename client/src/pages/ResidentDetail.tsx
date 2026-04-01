import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { residentsApi, reportsApi } from '../services/api';
import { Resident } from '../types';
import { useAppState } from '../context/AppStateContext';

const statusLabel: Record<string, string> = { ACTIVE: '재실', OUT: '외출', HOSPITALIZED: '입원', DISCHARGED: '퇴소' };
const genderLabel: Record<string, string> = { MALE: '남', FEMALE: '여' };
const cognitiveLabel: Record<string, string> = { NORMAL: '정상', MILD: '경증', MODERATE: '중등도', SEVERE: '중증' };

export default function ResidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { store } = useAppState();

  useEffect(() => {
    if (id) loadResident();
  }, [id]);

  const loadResident = async () => {
    try {
      const res = await residentsApi.get(id!);
      setResident(res.data);
    } catch {}
    setLoading(false);
  };

  const handleDownloadReport = async () => {
    try {
      const res = await reportsApi.healthReport(id!);
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `health-report-${resident?.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  if (loading) return <div className="flex justify-center py-16 text-gray-400">불러오는 중...</div>;
  if (!resident) return <div className="text-center py-16 text-gray-400">입주자를 찾을 수 없습니다.</div>;

  const bpData = resident.healthRecords?.slice(0, 14).reverse().map(r => ({
    date: new Date(r.recordedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    수축기: r.systolicBP,
    이완기: r.diastolicBP,
    혈당: r.bloodSugarFasting,
  })) || [];

  // 공유 AppState에서 재정 데이터 조회 (이름으로 매칭)
  const residentName = resident.name;
  const contract = useMemo(() => {
    const list = (store.contracts ?? []) as { id: string; contractNo: string; name: string; room: string; type: string; startDate: string; endDate: string; monthly: number; deposit: number; depositStatus: string; status: string }[];
    return list.find(c => c.name === residentName) ?? null;
  }, [store.contracts, residentName]);

  const billings = useMemo(() => {
    const list = (store.billings ?? []) as { id: string; month: string; name: string; room: string; admin: number; meal: number; utility: number; service: number; paid: number; status: string }[];
    return list.filter(b => b.name === residentName);
  }, [store.billings, residentName]);

  const settlement = useMemo(() => {
    const list = (store.settlements ?? []) as { id: string; name: string; room: string; totalDeposit: number; paid: number; balance: number; method: string; lastPaidDate: string; status: string }[];
    return list.find(s => s.name === residentName) ?? null;
  }, [store.settlements, residentName]);

  const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

  const tabs = [
    { id: 'overview', label: '기본 정보' },
    { id: 'finance', label: '재정 현황' },
    { id: 'health', label: '건강 기록' },
    { id: 'medications', label: '약물 관리' },
    { id: 'programs', label: '프로그램' },
    { id: 'falls', label: '낙상 이력' },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {resident.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{resident.name}</h1>
                <span className={`badge ${
                  resident.status === 'ACTIVE' ? 'badge-green' :
                  resident.status === 'HOSPITALIZED' ? 'badge-red' : 'badge-gray'
                }`}>{statusLabel[resident.status]}</span>
                {(resident.healthScore || 0) < 70 && (
                  <span className="badge badge-yellow">⚠️ 건강 주의</span>
                )}
              </div>
              <p className="text-gray-500 mt-1">
                {resident.roomNumber}호 · {new Date().getFullYear() - new Date(resident.birthDate).getFullYear()}세 · {genderLabel[resident.gender]} ·
                입소일: {new Date(resident.moveInDate).toLocaleDateString('ko-KR')}
              </p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>이동 능력: <strong className="text-gray-800">Lv.{resident.mobilityLevel}</strong></span>
                <span>인지 수준: <strong className="text-gray-800">{cognitiveLabel[resident.cognitiveLevel]}</strong></span>
                {resident.height && <span>키: <strong className="text-gray-800">{resident.height}cm</strong></span>}
                {resident.weight && <span>체중: <strong className="text-gray-800">{resident.weight}kg</strong></span>}
              </div>
              {(contract || settlement || resident.monthlyFee) && (
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>월 생활비: <strong className="text-gray-800">{fmt(contract?.monthly ?? resident.monthlyFee ?? 0)}</strong></span>
                  <span>보증금: <strong className="text-gray-800">{fmt(settlement?.totalDeposit ?? contract?.deposit ?? resident.deposit ?? 0)}</strong></span>
                  <span>보증금 납부: <strong className={
                    (settlement?.status === '완납' || contract?.depositStatus === '완납' || resident.depositPaid) ? 'text-green-600' : 'text-red-500'
                  }>{settlement?.status ?? contract?.depositStatus ?? (resident.depositPaid ? '완납' : '미납')}</strong></span>
                  {billings.length > 0 && (() => {
                    const latest = billings[0];
                    return (
                      <span>최근 청구({latest.month}): <strong className={
                        latest.status === '완납' ? 'text-green-600' :
                        latest.status === '미납' ? 'text-red-500' : 'text-orange-500'
                      }>{latest.status}</strong></span>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownloadReport} className="btn-secondary text-sm flex items-center gap-1">
              📄 건강 리포트
            </button>
            <button onClick={() => navigate(`/resident/admission/${id}/edit`)} className="btn-primary text-sm">
              ✏️ 정보 수정
            </button>
          </div>
        </div>

        {/* 건강 점수 */}
        {resident.healthScore !== undefined && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">건강 점수</span>
                <div className={`text-2xl font-bold ${
                  resident.healthScore >= 80 ? 'text-green-600' :
                  resident.healthScore >= 60 ? 'text-yellow-600' :
                  resident.healthScore >= 40 ? 'text-orange-600' : 'text-red-600'
                }`}>{resident.healthScore}</div>
                <span className={`badge ${
                  resident.healthStatus?.color === 'green' ? 'badge-green' :
                  resident.healthStatus?.color === 'yellow' ? 'badge-yellow' :
                  resident.healthStatus?.color === 'orange' ? 'bg-orange-100 text-orange-800' : 'badge-red'
                }`}>{resident.healthStatus?.label}</span>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    resident.healthScore >= 80 ? 'bg-green-500' :
                    resident.healthScore >= 60 ? 'bg-yellow-500' :
                    resident.healthScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${resident.healthScore}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* 질환 목록 */}
          <div className="card">
            <h3 className="font-semibold mb-4">보유 질환</h3>
            {resident.diseases?.length === 0 ? (
              <p className="text-gray-400 text-sm">등록된 질환이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {resident.diseases?.map(d => (
                  <div key={d.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-500">🏥</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{d.disease.name}</p>
                      {d.diagnosedAt && (
                        <p className="text-xs text-gray-500">진단일: {new Date(d.diagnosedAt).toLocaleDateString('ko-KR')}</p>
                      )}
                      {d.notes && <p className="text-xs text-gray-600 mt-0.5">{d.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 알레르기 및 식이 제한 */}
          <div className="card">
            <h3 className="font-semibold mb-4">알레르기 및 식이 제한</h3>
            {(resident.allergies?.length || 0) + (resident.dietaryRestrictions?.length || 0) === 0 ? (
              <p className="text-gray-400 text-sm">등록된 항목이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {resident.allergies?.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-red-500">⚠️</span>
                    <div>
                      <p className="text-sm font-medium">{a.name} 알레르기</p>
                      <p className="text-xs text-gray-500">{a.type === 'FOOD' ? '식품' : a.type === 'DRUG' ? '약물' : '기타'} · {a.severity || '주의 필요'}</p>
                    </div>
                  </div>
                ))}
                {resident.dietaryRestrictions?.map(d => (
                  <div key={d.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <span className="text-orange-500">🍽️</span>
                    <div>
                      <p className="text-sm font-medium">{d.type}</p>
                      {d.notes && <p className="text-xs text-gray-500">{d.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 비상 연락처 */}
          <div className="card">
            <h3 className="font-semibold mb-4">비상 연락처</h3>
            <div className="space-y-2">
              {resident.emergencyContacts?.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-500">👤</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{c.name}</p>
                      {c.isPrimary && <span className="badge badge-blue">주보호자</span>}
                    </div>
                    <p className="text-xs text-gray-500">{c.relationship} · {c.phone}</p>
                  </div>
                  <a href={`tel:${c.phone}`} className="text-blue-600 text-xs hover:underline">전화</a>
                </div>
              ))}
            </div>
          </div>

          {/* IoT 기기 */}
          <div className="card">
            <h3 className="font-semibold mb-4">IoT 기기</h3>
            {resident.iotDevices?.length === 0 ? (
              <p className="text-gray-400 text-sm">연결된 기기가 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {resident.iotDevices?.map(d => (
                  <div key={d.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                    d.status === 'NORMAL' ? 'bg-green-50' :
                    d.status === 'LOW_BATTERY' ? 'bg-yellow-50' : 'bg-red-50'
                  }`}>
                    <span className="text-xl">📡</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.deviceCode}</p>
                      <p className="text-xs text-gray-500">{d.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{d.batteryLevel}%</p>
                      <span className={`badge ${
                        d.status === 'NORMAL' ? 'badge-green' :
                        d.status === 'LOW_BATTERY' ? 'badge-yellow' : 'badge-red'
                      }`}>
                        {d.status === 'NORMAL' ? '정상' : d.status === 'LOW_BATTERY' ? '배터리부족' : '연결끊김'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-sm text-gray-500">월 생활비</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contract ? fmt(contract.monthly) : resident.monthlyFee ? fmt(resident.monthlyFee) : '-'}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-500">보증금</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {settlement ? fmt(settlement.totalDeposit) : contract ? fmt(contract.deposit) : resident.deposit ? fmt(resident.deposit) : '-'}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-gray-500">보증금 납부 상태</p>
              <p className={`text-2xl font-bold mt-1 ${
                (settlement?.status === '완납' || contract?.depositStatus === '완납') ? 'text-green-600' :
                (settlement?.status === '분할납부중' || contract?.depositStatus === '분할납부중') ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {settlement?.status ?? contract?.depositStatus ?? (resident.depositPaid ? '완납' : '미납')}
              </p>
            </div>
          </div>

          {/* 계약 정보 */}
          <div className="card">
            <h3 className="font-semibold mb-4">계약 정보</h3>
            {contract ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">계약번호</p>
                    <p className="text-sm font-medium text-blue-600 font-mono">{contract.contractNo}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">계약상태</p>
                    <p className="text-sm font-medium">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        contract.status === '계약중' ? 'bg-green-100 text-green-800' :
                        contract.status === '만료예정' || contract.status === '갱신대기' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{contract.status}</span>
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">계약 시작일</p>
                    <p className="text-sm font-medium text-gray-900">{contract.startDate}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">계약 종료일</p>
                    <p className="text-sm font-medium text-gray-900">{contract.endDate}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">호실 유형</p>
                    <p className="text-sm font-medium text-gray-900">{contract.room} ({contract.type})</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">기준 생활비 (월)</p>
                    <p className="text-sm font-bold text-gray-900">{fmt(contract.monthly)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">등록된 계약 정보가 없습니다.</p>
            )}
          </div>

          {/* 보증금 정산 */}
          <div className="card">
            <h3 className="font-semibold mb-4">보증금 정산 현황</h3>
            {settlement ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">보증금 총액</p>
                    <p className="text-sm font-bold text-gray-900">{fmt(settlement.totalDeposit)}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-xs text-green-600">납부 완료</p>
                    <p className="text-sm font-bold text-green-700">{fmt(settlement.paid)}</p>
                  </div>
                  <div className="p-3 rounded-lg text-center" style={{ backgroundColor: settlement.balance > 0 ? '#FEF2F2' : '#F0FDF4' }}>
                    <p className="text-xs" style={{ color: settlement.balance > 0 ? '#DC2626' : '#16A34A' }}>미납 잔액</p>
                    <p className="text-sm font-bold" style={{ color: settlement.balance > 0 ? '#DC2626' : '#16A34A' }}>{fmt(settlement.balance)}</p>
                  </div>
                </div>
                {/* 납부율 바 */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>납부 진행률</span>
                    <span>{settlement.totalDeposit > 0 ? Math.round(settlement.paid / settlement.totalDeposit * 100) : 0}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${settlement.paid >= settlement.totalDeposit ? 'bg-green-500' : settlement.paid > 0 ? 'bg-yellow-500' : 'bg-red-400'}`}
                      style={{ width: `${settlement.totalDeposit > 0 ? Math.min(100, Math.round(settlement.paid / settlement.totalDeposit * 100)) : 0}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>납부방법: <strong className="text-gray-700">{settlement.method}</strong></span>
                  <span>최종납부일: <strong className="text-gray-700">{settlement.lastPaidDate}</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">등록된 보증금 정산 정보가 없습니다.</p>
            )}
          </div>

          {/* 월 청구 현황 */}
          <div className="card">
            <h3 className="font-semibold mb-4">월 청구 내역</h3>
            {billings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">청구월</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-600">관리비</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-600">식사비</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-600">수도광열비</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-600">서비스비</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-600">합계</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-600">납부액</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billings.map(b => {
                      const total = b.admin + b.meal + b.utility + b.service;
                      return (
                        <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700 font-medium">{b.month}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{fmt(b.admin)}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{fmt(b.meal)}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{fmt(b.utility)}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{fmt(b.service)}</td>
                          <td className="px-3 py-2 text-right font-semibold text-gray-900">{fmt(total)}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{fmt(b.paid)}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              b.status === '완납' ? 'bg-green-100 text-green-800' :
                              b.status === '미납' ? 'bg-red-100 text-red-800' :
                              b.status === '일부납' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>{b.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">등록된 청구 내역이 없습니다.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* 최근 활력징후 차트 */}
          {bpData.length > 0 && (
            <div className="card">
              <h3 className="font-semibold mb-4">혈압 추이 (최근 2주)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={bpData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="수축기" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="이완기" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 건강 기록 테이블 */}
          <div className="card overflow-hidden p-0">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="font-semibold">건강 기록 이력</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="table-header">날짜</th>
                    <th className="table-header">혈압</th>
                    <th className="table-header">심박수</th>
                    <th className="table-header">체온</th>
                    <th className="table-header">혈당</th>
                    <th className="table-header">수면</th>
                    <th className="table-header">기분</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resident.healthRecords?.slice(0, 10).map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="table-cell text-xs">{new Date(r.recordedAt).toLocaleDateString('ko-KR')}</td>
                      <td className="table-cell">
                        {r.systolicBP ? (
                          <span className={`font-medium ${r.systolicBP > 140 ? 'text-red-600' : 'text-gray-900'}`}>
                            {r.systolicBP}/{r.diastolicBP}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="table-cell">{r.heartRate || '-'}</td>
                      <td className="table-cell">
                        {r.temperature ? (
                          <span className={r.temperature > 37.5 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                            {r.temperature}°C
                          </span>
                        ) : '-'}
                      </td>
                      <td className="table-cell">
                        {r.bloodSugarFasting ? (
                          <span className={r.bloodSugarFasting > 130 ? 'text-orange-600 font-medium' : 'text-gray-900'}>
                            {r.bloodSugarFasting.toFixed(0)}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="table-cell">{r.sleepHours ? `${r.sleepHours.toFixed(1)}h` : '-'}</td>
                      <td className="table-cell">
                        {r.moodScore ? '😊😊😊😊😊'.slice(0, r.moodScore * 2) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'medications' && (
        <div className="card">
          <h3 className="font-semibold mb-4">복용 약물</h3>
          {resident.medications?.length === 0 ? (
            <p className="text-gray-400">등록된 약물이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {resident.medications?.map(m => (
                <div key={m.id} className={`p-4 rounded-lg border ${m.isActive ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{m.name}</p>
                      <p className="text-sm text-gray-600">{m.dosage}</p>
                      <p className="text-xs text-gray-500 mt-1">복용: {m.schedule}</p>
                      {m.prescribedBy && <p className="text-xs text-gray-500">처방: {m.prescribedBy}</p>}
                    </div>
                    <span className={`badge ${m.isActive ? 'badge-green' : 'badge-gray'}`}>
                      {m.isActive ? '복용중' : '중단'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'programs' && (
        <div className="card">
          <h3 className="font-semibold mb-4">참여 프로그램</h3>
          {resident.programEnrollments?.length === 0 ? (
            <p className="text-gray-400">참여 중인 프로그램이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {resident.programEnrollments?.map(e => (
                <div key={e.id} className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <p className="font-medium text-gray-900">{e.program?.name}</p>
                  <p className="text-sm text-gray-500">{e.program?.category}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    등록일: {new Date(e.enrolledAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'falls' && (
        <div className="card">
          <h3 className="font-semibold mb-4">낙상 이력</h3>
          {resident.fallEvents?.length === 0 ? (
            <p className="text-gray-400">낙상 이력이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {resident.fallEvents?.map(f => (
                <div key={f.id} className={`p-4 rounded-lg border ${
                  f.severity === 'CRITICAL' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{f.severity === 'CRITICAL' ? '🚨' : '⚠️'}</span>
                      <div>
                        <p className="font-medium">{new Date(f.occurredAt).toLocaleString('ko-KR')}</p>
                        <p className="text-sm text-gray-600">{f.location || '위치 미상'}</p>
                      </div>
                    </div>
                    <span className={`badge ${
                      f.status === 'UNHANDLED' ? 'badge-red' :
                      f.status === 'HANDLING' ? 'badge-yellow' : 'badge-green'
                    }`}>
                      {f.status === 'UNHANDLED' ? '미처리' : f.status === 'HANDLING' ? '처리중' : '완료'}
                    </span>
                  </div>
                  {f.responses?.map(r => (
                    <div key={r.id} className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700">{r.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        처리: {r.respondedBy} · {r.outcome === 'NO_INJURY' ? '외상 없음' : r.outcome === 'MINOR_INJURY' ? '경미한 부상' : '병원 이송'}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
