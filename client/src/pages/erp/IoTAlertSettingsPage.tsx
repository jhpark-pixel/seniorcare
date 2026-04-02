import React from 'react';
import { useCollection } from '../../context/AppStateContext';

interface IoTAlertSettings {
  id: string;
  fallSensitivity: number;
  targets: { nurse: boolean; director: boolean; guardian: boolean };
  batteryThreshold: number;
  commTimeout: number;
  fallAlert: boolean;
  batteryAlert: boolean;
  commAlert: boolean;
  nightAlert: boolean;
}

const initialSettings: IoTAlertSettings[] = [{
  id: 'default',
  fallSensitivity: 1,
  targets: { nurse: true, director: true, guardian: false },
  batteryThreshold: 20,
  commTimeout: 30,
  fallAlert: true,
  batteryAlert: true,
  commAlert: true,
  nightAlert: false,
}];

export default function IoTAlertSettingsPage() {
  const [settingsArr, setSettingsArr] = useCollection<IoTAlertSettings>('iotAlertSettings', initialSettings);
  const settings = settingsArr[0];

  const updateSetting = (key: string, value: any) => {
    setSettingsArr(prev => [{ ...prev[0], [key]: value }]);
  };

  const fallSensitivity = settings.fallSensitivity;
  const targets = settings.targets;
  const batteryThreshold = settings.batteryThreshold;
  const commTimeout = settings.commTimeout;
  const fallAlert = settings.fallAlert;
  const batteryAlert = settings.batteryAlert;
  const commAlert = settings.commAlert;
  const nightAlert = settings.nightAlert;

  const sensitivityLabels = ['낮음', '보통', '높음'];

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </label>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">장치알림 설정</h1>
        <p className="mt-1 text-sm text-gray-500">IoT 장치의 알림 조건 및 대상을 설정합니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 알림 활성화 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">알림 활성화</h2>
          <div className="space-y-4">
            <Toggle checked={fallAlert} onChange={v => updateSetting('fallAlert', v)} label="낙상 감지 알림" />
            <Toggle checked={batteryAlert} onChange={v => updateSetting('batteryAlert', v)} label="배터리 부족 알림" />
            <Toggle checked={commAlert} onChange={v => updateSetting('commAlert', v)} label="통신 끊김 알림" />
            <Toggle checked={nightAlert} onChange={v => updateSetting('nightAlert', v)} label="야간 활동 감지 알림" />
          </div>
        </div>

        {/* 낙상감지 민감도 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">낙상감지 민감도</h2>
          <div className="space-y-4">
            <input
              type="range"
              min={0}
              max={2}
              value={fallSensitivity}
              onChange={(e) => updateSetting('fallSensitivity', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-sm">
              {sensitivityLabels.map((l, i) => (
                <span key={l} className={`${fallSensitivity === i ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>{l}</span>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {fallSensitivity === 0 && '확실한 낙상만 감지합니다. 오탐율이 낮으나 감지율도 낮습니다.'}
              {fallSensitivity === 1 && '일반적인 낙상을 감지합니다. 균형 잡힌 설정입니다.'}
              {fallSensitivity === 2 && '미세한 움직임 변화도 감지합니다. 감지율이 높으나 오탐 가능성이 있습니다.'}
            </p>
          </div>
        </div>

        {/* 알림 대상자 설정 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">알림 대상자 설정</h2>
          <div className="space-y-3">
            {[
              { key: 'nurse' as const, label: '간호사' },
              { key: 'director' as const, label: '시설장' },
              { key: 'guardian' as const, label: '보호자' },
            ].map((t) => (
              <label key={t.key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={targets[t.key]}
                  onChange={(e) => updateSetting('targets', { ...targets, [t.key]: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 임계값 설정 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">임계값 설정</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배터리 경고 임계값 (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={batteryThreshold}
                  onChange={(e) => updateSetting('batteryThreshold', Number(e.target.value))}
                  min={5}
                  max={50}
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">배터리가 {batteryThreshold}% 이하일 때 알림</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">통신 끊김 경고 시간 (분)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={commTimeout}
                  onChange={(e) => updateSetting('commTimeout', Number(e.target.value))}
                  min={1}
                  max={120}
                  className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-sm text-gray-500">{commTimeout}분 이상 통신 없을 때 알림</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {/* settings auto-persisted to central store */}}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          설정 저장
        </button>
      </div>
    </div>
  );
}
