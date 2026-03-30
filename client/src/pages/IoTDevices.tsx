import React, { useEffect, useState } from 'react';
import { iotDevicesApi, residentsApi } from '../services/api';
import { IotDevice, Resident } from '../types';

export default function IoTDevices() {
  const [devices, setDevices] = useState<IotDevice[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ deviceCode: '', residentId: '', location: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDevices();
    loadResidents();
    const interval = setInterval(loadDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDevices = async () => {
    try {
      const res = await iotDevicesApi.list();
      setDevices(res.data);
    } catch {}
    setLoading(false);
  };

  const loadResidents = async () => {
    try {
      const res = await residentsApi.list({ status: 'ACTIVE', limit: 100 });
      setResidents(res.data.data);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await iotDevicesApi.create(form);
      setShowForm(false);
      setForm({ deviceCode: '', residentId: '', location: '' });
      loadDevices();
    } catch (err: any) {
      alert(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('기기를 삭제하시겠습니까?')) return;
    try {
      await iotDevicesApi.delete(id);
      loadDevices();
    } catch {}
  };

  const statusInfo: Record<string, { label: string; color: string; icon: string }> = {
    NORMAL: { label: '정상', color: 'text-green-600 bg-green-50 border-green-200', icon: '✅' },
    LOW_BATTERY: { label: '배터리 부족', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: '🔋' },
    DISCONNECTED: { label: '연결 끊김', color: 'text-red-600 bg-red-50 border-red-200', icon: '❌' },
  };

  const summary = {
    normal: devices.filter(d => d.status === 'NORMAL').length,
    lowBattery: devices.filter(d => d.status === 'LOW_BATTERY').length,
    disconnected: devices.filter(d => d.status === 'DISCONNECTED').length,
  };

  return (
    <div className="space-y-5">
      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card bg-green-50 border border-green-100 text-center">
          <p className="text-3xl mb-1">✅</p>
          <p className="text-2xl font-bold text-green-600">{summary.normal}</p>
          <p className="text-sm text-green-700">정상 기기</p>
        </div>
        <div className="card bg-yellow-50 border border-yellow-100 text-center">
          <p className="text-3xl mb-1">🔋</p>
          <p className="text-2xl font-bold text-yellow-600">{summary.lowBattery}</p>
          <p className="text-sm text-yellow-700">배터리 부족</p>
        </div>
        <div className="card bg-red-50 border border-red-100 text-center">
          <p className="text-3xl mb-1">❌</p>
          <p className="text-2xl font-bold text-red-600">{summary.disconnected}</p>
          <p className="text-sm text-red-700">연결 끊김</p>
        </div>
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">IoT 기기 현황 ({devices.length}대)</h3>
        <div className="flex gap-2">
          <button onClick={loadDevices} className="btn-secondary text-sm">🔄 새로고침</button>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm">+ 기기 등록</button>
        </div>
      </div>

      {/* 기기 그리드 */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">불러오는 중...</div>
      ) : devices.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📡</p>
          <p>등록된 기기가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {devices.map(device => {
            const status = statusInfo[device.status];
            const batteryPercent = device.batteryLevel || 0;

            return (
              <div key={device.id} className={`card border ${status.color.includes('bg-') ? '' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📡</span>
                    <div>
                      <p className="font-semibold text-gray-900">{device.deviceCode}</p>
                      <p className="text-xs text-gray-500">{device.location}</p>
                    </div>
                  </div>
                  <div className={`badge ${
                    device.status === 'NORMAL' ? 'badge-green' :
                    device.status === 'LOW_BATTERY' ? 'badge-yellow' : 'badge-red'
                  }`}>
                    {status.icon} {status.label}
                  </div>
                </div>

                {/* 배터리 */}
                {device.batteryLevel !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>배터리</span>
                      <span className={batteryPercent <= 20 ? 'text-red-600 font-medium' : ''}>{batteryPercent}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          batteryPercent > 50 ? 'bg-green-500' :
                          batteryPercent > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${batteryPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 연결 입주자 */}
                <div className="text-sm mb-3">
                  {device.resident ? (
                    <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                      <span>👤</span>
                      <div>
                        <p className="font-medium text-blue-800">{device.resident.name}</p>
                        <p className="text-xs text-blue-600">{device.resident.roomNumber}호</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs">입주자 미연결</p>
                  )}
                </div>

                {/* 마지막 통신 */}
                {device.lastCommunicated && (
                  <p className="text-xs text-gray-400 mb-3">
                    마지막 통신: {new Date(device.lastCommunicated).toLocaleString('ko-KR')}
                  </p>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(device.id)}
                    className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 기기 등록 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-96 fade-in">
            <h3 className="font-bold text-lg mb-4">IoT 기기 등록</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">기기 코드 *</label>
                <input
                  type="text" required
                  value={form.deviceCode}
                  onChange={e => setForm(f => ({ ...f, deviceCode: e.target.value }))}
                  className="input-field" placeholder="DEV-006"
                />
              </div>
              <div>
                <label className="label">설치 위치 *</label>
                <input
                  type="text" required
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="input-field" placeholder="301호 침실"
                />
              </div>
              <div>
                <label className="label">연결 입주자</label>
                <select
                  value={form.residentId}
                  onChange={e => setForm(f => ({ ...f, residentId: e.target.value }))}
                  className="input-field"
                >
                  <option value="">선택 안 함</option>
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.roomNumber}호)</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">취소</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
