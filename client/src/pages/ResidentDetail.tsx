import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { residentsApi, reportsApi } from '../services/api';
import { Resident } from '../types';

const statusLabel: Record<string, string> = { ACTIVE: '재실', OUT: '외출', HOSPITALIZED: '입원', DISCHARGED: '퇴소' };
const genderLabel: Record<string, string> = { MALE: '남', FEMALE: '여' };
const cognitiveLabel: Record<string, string> = { NORMAL: '정상', MILD: '경증', MODERATE: '중등도', SEVERE: '중증' };

export default function ResidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  const tabs = [
    { id: 'overview', label: '기본 정보' },
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
              {resident.monthlyFee && (
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>월 생활비: <strong className="text-gray-800">{resident.monthlyFee?.toLocaleString('ko-KR')}원</strong></span>
                  <span>보증금: <strong className="text-gray-800">{resident.deposit?.toLocaleString('ko-KR')}원</strong></span>
                  <span>보증금 납부: <strong className={resident.depositPaid ? 'text-green-600' : 'text-red-500'}>{resident.depositPaid ? '완료' : '미납'}</strong></span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownloadReport} className="btn-secondary text-sm flex items-center gap-1">
              📄 건강 리포트
            </button>
            <button onClick={() => navigate(`/residents/${id}/edit`)} className="btn-primary text-sm">
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
