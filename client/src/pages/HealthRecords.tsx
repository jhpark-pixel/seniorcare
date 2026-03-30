import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { residentsApi, healthRecordsApi } from '../services/api';
import { Resident, HealthRecord } from '../types';

export default function HealthRecords() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResident, setSelectedResident] = useState<string>('');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [trend, setTrend] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [days, setDays] = useState(30);

  const [form, setForm] = useState({
    systolicBP: '', diastolicBP: '', heartRate: '', temperature: '',
    bloodSugarFasting: '', bloodSugarPostMeal: '',
    weight: '', sleepHours: '', waterIntake: '',
    mealAmount: 'MEDIUM', moodScore: 3, bowelMovement: false, notes: '',
    recordedAt: new Date().toISOString().slice(0, 16),
  });
  const [saving, setSaving] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadResidents();
  }, []);

  useEffect(() => {
    if (selectedResident) loadRecords();
  }, [selectedResident, days]);

  const loadResidents = async () => {
    try {
      const res = await residentsApi.list({ status: 'ACTIVE', limit: 100 });
      setResidents(res.data.data);
      if (res.data.data.length > 0) setSelectedResident(res.data.data[0].id);
    } catch {}
  };

  const loadRecords = async () => {
    setLoading(true);
    try {
      const res = await healthRecordsApi.list(selectedResident, days);
      setRecords(res.data.records);
      setTrend(res.data.trend);
      setHealthScore(res.data.healthScore);
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAlerts([]);
    try {
      const data: any = { residentId: selectedResident };
      if (form.systolicBP) data.systolicBP = parseInt(form.systolicBP);
      if (form.diastolicBP) data.diastolicBP = parseInt(form.diastolicBP);
      if (form.heartRate) data.heartRate = parseInt(form.heartRate);
      if (form.temperature) data.temperature = parseFloat(form.temperature);
      if (form.bloodSugarFasting) data.bloodSugarFasting = parseFloat(form.bloodSugarFasting);
      if (form.bloodSugarPostMeal) data.bloodSugarPostMeal = parseFloat(form.bloodSugarPostMeal);
      if (form.weight) data.weight = parseFloat(form.weight);
      if (form.sleepHours) data.sleepHours = parseFloat(form.sleepHours);
      if (form.waterIntake) data.waterIntake = parseFloat(form.waterIntake);
      data.mealAmount = form.mealAmount;
      data.moodScore = form.moodScore;
      data.bowelMovement = form.bowelMovement;
      data.notes = form.notes;
      data.recordedAt = form.recordedAt;

      const res = await healthRecordsApi.create(data);
      if (res.data.alerts?.length > 0) setAlerts(res.data.alerts);
      setShowForm(false);
      loadRecords();
    } catch (err: any) {
      alert(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const chartData = records.slice(0, 14).reverse().map(r => ({
    date: new Date(r.recordedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    수축기: r.systolicBP,
    이완기: r.diastolicBP,
    혈당: r.bloodSugarFasting,
    체중: r.weight,
  }));

  const trendIcon = (t: string) => t === 'INCREASING' ? '↑' : t === 'DECREASING' ? '↓' : '→';
  const trendColor = (t: string, type: 'bp' | 'sugar' | 'weight') => {
    if (type === 'bp' || type === 'sugar') {
      return t === 'INCREASING' ? 'text-red-600' : t === 'DECREASING' ? 'text-green-600' : 'text-gray-600';
    }
    return t === 'INCREASING' ? 'text-orange-600' : t === 'DECREASING' ? 'text-blue-600' : 'text-gray-600';
  };

  const selectedResidentData = residents.find(r => r.id === selectedResident);

  return (
    <div className="space-y-5">
      {/* 입주자 선택 */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="label">입주자 선택</label>
            <select
              value={selectedResident}
              onChange={e => setSelectedResident(e.target.value)}
              className="input-field max-w-xs"
            >
              {residents.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.roomNumber}호)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">조회 기간</label>
            <select value={days} onChange={e => setDays(parseInt(e.target.value))} className="input-field w-24">
              <option value={7}>7일</option>
              <option value={14}>14일</option>
              <option value={30}>30일</option>
              <option value={90}>90일</option>
            </select>
          </div>
          <div className="pt-5">
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              + 건강 기록 입력
            </button>
          </div>
        </div>
      </div>

      {/* 이상 수치 알림 */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="font-semibold text-red-800 mb-2">⚠️ 이상 수치 감지</p>
          <ul className="space-y-1">
            {alerts.map((a, i) => <li key={i} className="text-sm text-red-700">• {a}</li>)}
          </ul>
        </div>
      )}

      {/* 건강 기록 입력 폼 */}
      {showForm && (
        <div className="card">
          <h3 className="font-semibold mb-4">건강 기록 입력 - {selectedResidentData?.name}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">측정 일시</label>
              <input
                type="datetime-local"
                value={form.recordedAt}
                onChange={e => setForm(f => ({ ...f, recordedAt: e.target.value }))}
                className="input-field max-w-xs"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">활력 징후</p>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="label text-xs">수축기 혈압</label>
                  <input type="number" placeholder="mmHg" value={form.systolicBP}
                    onChange={e => setForm(f => ({ ...f, systolicBP: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label text-xs">이완기 혈압</label>
                  <input type="number" placeholder="mmHg" value={form.diastolicBP}
                    onChange={e => setForm(f => ({ ...f, diastolicBP: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label text-xs">심박수</label>
                  <input type="number" placeholder="bpm" value={form.heartRate}
                    onChange={e => setForm(f => ({ ...f, heartRate: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label text-xs">체온 (°C)</label>
                  <input type="number" step="0.1" placeholder="36.5" value={form.temperature}
                    onChange={e => setForm(f => ({ ...f, temperature: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label text-xs">공복 혈당</label>
                  <input type="number" placeholder="mg/dL" value={form.bloodSugarFasting}
                    onChange={e => setForm(f => ({ ...f, bloodSugarFasting: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label text-xs">식후 혈당</label>
                  <input type="number" placeholder="mg/dL" value={form.bloodSugarPostMeal}
                    onChange={e => setForm(f => ({ ...f, bloodSugarPostMeal: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label text-xs">체중 (kg)</label>
                  <input type="number" step="0.1" placeholder="kg" value={form.weight}
                    onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                    className="input-field" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">일상 기록</p>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="label text-xs">수면 시간 (h)</label>
                  <input type="number" step="0.5" placeholder="7" value={form.sleepHours}
                    onChange={e => setForm(f => ({ ...f, sleepHours: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label text-xs">수분 섭취 (ml)</label>
                  <input type="number" placeholder="1500" value={form.waterIntake}
                    onChange={e => setForm(f => ({ ...f, waterIntake: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="label text-xs">식사량</label>
                  <select value={form.mealAmount} onChange={e => setForm(f => ({ ...f, mealAmount: e.target.value }))} className="input-field">
                    <option value="HIGH">많음</option>
                    <option value="MEDIUM">보통</option>
                    <option value="LOW">적음</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">기분 (1-5)</label>
                  <select value={form.moodScore} onChange={e => setForm(f => ({ ...f, moodScore: parseInt(e.target.value) }))} className="input-field">
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}점</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.bowelMovement}
                    onChange={e => setForm(f => ({ ...f, bowelMovement: e.target.checked }))}
                    className="rounded" />
                  <span className="text-sm text-gray-700">배변 여부</span>
                </label>
              </div>
            </div>

            <div>
              <label className="label">특이사항</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="input-field h-20 resize-none"
                placeholder="특이사항을 입력하세요..."
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">취소</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 건강 요약 */}
      {trend && (
        <div className="grid grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-sm text-gray-500 mb-1">건강 점수</p>
            <p className={`text-3xl font-bold ${healthScore >= 80 ? 'text-green-600' : healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {healthScore}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-500 mb-1">혈압 추세</p>
            <p className={`text-2xl font-bold ${trendColor(trend.bpTrend, 'bp')}`}>
              {trendIcon(trend.bpTrend)}
            </p>
            <p className="text-xs text-gray-400">{trend.bpTrend === 'INCREASING' ? '상승' : trend.bpTrend === 'DECREASING' ? '하강' : '안정'}</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-500 mb-1">혈당 추세</p>
            <p className={`text-2xl font-bold ${trendColor(trend.sugarTrend, 'sugar')}`}>
              {trendIcon(trend.sugarTrend)}
            </p>
            <p className="text-xs text-gray-400">{trend.sugarTrend === 'INCREASING' ? '상승' : trend.sugarTrend === 'DECREASING' ? '하강' : '안정'}</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-500 mb-1">체중 추세</p>
            <p className={`text-2xl font-bold ${trendColor(trend.weightTrend, 'weight')}`}>
              {trendIcon(trend.weightTrend)}
            </p>
            <p className="text-xs text-gray-400">{trend.weightTrend === 'INCREASING' ? '증가' : trend.weightTrend === 'DECREASING' ? '감소' : '유지'}</p>
          </div>
        </div>
      )}

      {/* 차트 */}
      {chartData.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-4">혈압 및 혈당 추이</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="수축기" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="이완기" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="혈당" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 기록 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold">건강 기록 ({records.length}건)</h3>
        </div>
        {loading ? (
          <div className="py-8 text-center text-gray-400">불러오는 중...</div>
        ) : records.length === 0 ? (
          <div className="py-8 text-center text-gray-400">기록이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="table-header">날짜</th>
                  <th className="table-header">혈압</th>
                  <th className="table-header">심박수</th>
                  <th className="table-header">체온</th>
                  <th className="table-header">공복혈당</th>
                  <th className="table-header">체중</th>
                  <th className="table-header">수면</th>
                  <th className="table-header">식사</th>
                  <th className="table-header">기분</th>
                  <th className="table-header">메모</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="table-cell text-xs">{new Date(r.recordedAt).toLocaleDateString('ko-KR')}</td>
                    <td className="table-cell">
                      {r.systolicBP ? (
                        <span className={r.systolicBP > 140 ? 'text-red-600 font-medium' : ''}>
                          {r.systolicBP}/{r.diastolicBP}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="table-cell">{r.heartRate || '-'}</td>
                    <td className="table-cell">
                      {r.temperature ? (
                        <span className={r.temperature > 37.5 ? 'text-red-600 font-medium' : ''}>
                          {r.temperature}°C
                        </span>
                      ) : '-'}
                    </td>
                    <td className="table-cell">
                      {r.bloodSugarFasting ? (
                        <span className={r.bloodSugarFasting > 130 ? 'text-orange-600 font-medium' : ''}>
                          {r.bloodSugarFasting.toFixed(0)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="table-cell">{r.weight ? `${r.weight.toFixed(1)}kg` : '-'}</td>
                    <td className="table-cell">{r.sleepHours ? `${r.sleepHours.toFixed(1)}h` : '-'}</td>
                    <td className="table-cell">
                      {r.mealAmount ? (
                        <span className={`badge ${r.mealAmount === 'LOW' ? 'badge-red' : r.mealAmount === 'MEDIUM' ? 'badge-yellow' : 'badge-green'}`}>
                          {r.mealAmount === 'HIGH' ? '많음' : r.mealAmount === 'MEDIUM' ? '보통' : '적음'}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="table-cell text-sm">{r.moodScore ? `${r.moodScore}점` : '-'}</td>
                    <td className="table-cell text-xs text-gray-500 max-w-xs truncate">{r.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
