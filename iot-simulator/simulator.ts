import axios from 'axios';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000';
const SIMULATION_INTERVAL = 30000; // 30초마다 센서 데이터 전송
const FALL_PROBABILITY = 0.05; // 5% 확률로 낙상 감지

interface SimulatedDevice {
  id: string;
  deviceCode: string;
  residentId: string;
  location: string;
  batteryLevel: number;
}

interface SensorData {
  acceleration: number;
  angle: number;
  impact: string;
  heartRate?: number;
  temperature?: number;
}

// 시뮬레이션 상태
const devices: SimulatedDevice[] = [];
let simulationRunning = true;

async function loadDevices(): Promise<void> {
  try {
    const res = await axios.get(`${SERVER_URL}/api/iot-devices`);
    const serverDevices = res.data;
    devices.length = 0;
    for (const d of serverDevices) {
      if (d.residentId) {
        devices.push({
          id: d.id,
          deviceCode: d.deviceCode,
          residentId: d.residentId,
          location: d.location,
          batteryLevel: d.batteryLevel || 80,
        });
      }
    }
    console.log(`[시뮬레이터] ${devices.length}개 기기 로드됨`);
  } catch (err) {
    console.error('[시뮬레이터] 기기 로드 실패:', err instanceof Error ? err.message : err);
  }
}

function generateSensorData(isFall: boolean): SensorData {
  if (isFall) {
    const severity = Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'light';
    return {
      acceleration: severity === 'high' ? 3.5 + Math.random() * 2 : severity === 'medium' ? 2 + Math.random() * 1.5 : 1.5 + Math.random(),
      angle: severity === 'high' ? 60 + Math.random() * 30 : severity === 'medium' ? 35 + Math.random() * 25 : 20 + Math.random() * 15,
      impact: severity,
      heartRate: 90 + Math.floor(Math.random() * 40),
      temperature: 36.5 + (Math.random() - 0.3) * 1.5,
    };
  }
  return {
    acceleration: 0.1 + Math.random() * 0.5,
    angle: Math.random() * 10,
    impact: 'none',
    heartRate: 65 + Math.floor(Math.random() * 20),
    temperature: 36.3 + Math.random() * 0.6,
  };
}

async function sendHeartbeat(device: SimulatedDevice): Promise<void> {
  // 배터리 소모 시뮬레이션
  device.batteryLevel = Math.max(0, device.batteryLevel - (Math.random() * 0.2));

  try {
    await axios.put(`${SERVER_URL}/api/iot-devices/${device.id}/heartbeat`, {
      batteryLevel: Math.round(device.batteryLevel),
    });
  } catch {}
}

async function detectFall(device: SimulatedDevice): Promise<void> {
  const isFall = Math.random() < FALL_PROBABILITY;
  if (!isFall) return;

  const sensorData = generateSensorData(true);
  const severity = sensorData.acceleration > 3.5 ? 'CRITICAL' : 'WARNING';

  const locations = [
    `${device.location.replace('침실', '')}화장실`,
    device.location,
    `${device.location.replace('호 침실', '')}호 복도`,
    `${device.location.replace('침실', '')}거실`,
  ];
  const location = locations[Math.floor(Math.random() * locations.length)];

  try {
    await axios.post(`${SERVER_URL}/api/fall-events`, {
      residentId: device.residentId,
      deviceId: device.id,
      location,
      severity,
      sensorData,
    });

    console.log(`[시뮬레이터] 낙상 감지! 기기: ${device.deviceCode}, 위치: ${location}, 심각도: ${severity}`);
    console.log(`  센서 데이터: 가속도=${sensorData.acceleration.toFixed(2)}, 각도=${sensorData.angle.toFixed(1)}°, 충격=${sensorData.impact}`);
  } catch (err) {
    console.error('[시뮬레이터] 낙상 이벤트 전송 실패:', err instanceof Error ? err.message : err);
  }
}

async function runSimulation(): Promise<void> {
  console.log('==========================================');
  console.log('  시니어 케어 IoT 시뮬레이터 시작');
  console.log('==========================================');
  console.log(`서버 주소: ${SERVER_URL}`);
  console.log(`시뮬레이션 주기: ${SIMULATION_INTERVAL / 1000}초`);
  console.log(`낙상 감지 확률: ${FALL_PROBABILITY * 100}%`);
  console.log('');

  // 초기 기기 로드
  await loadDevices();

  // 주기적 기기 재로드 (5분마다)
  setInterval(loadDevices, 5 * 60 * 1000);

  let cycle = 0;
  while (simulationRunning) {
    cycle++;
    console.log(`\n[시뮬레이터] 사이클 ${cycle} 시작 (${new Date().toLocaleTimeString('ko-KR')})`);

    if (devices.length === 0) {
      console.log('[시뮬레이터] 활성 기기 없음. 기기 로드 재시도...');
      await loadDevices();
    }

    for (const device of devices) {
      await sendHeartbeat(device);
      await detectFall(device);
    }

    console.log(`[시뮬레이터] ${devices.length}개 기기 처리 완료 (배터리 평균: ${
      devices.length > 0
        ? Math.round(devices.reduce((s, d) => s + d.batteryLevel, 0) / devices.length)
        : 0
    }%)`);

    await new Promise(resolve => setTimeout(resolve, SIMULATION_INTERVAL));
  }
}

// 종료 처리
process.on('SIGINT', () => {
  console.log('\n[시뮬레이터] 종료 중...');
  simulationRunning = false;
  process.exit(0);
});

process.on('SIGTERM', () => {
  simulationRunning = false;
  process.exit(0);
});

// 즉시 낙상 테스트 (환경변수로 제어)
if (process.env.TEST_FALL === 'true') {
  console.log('[시뮬레이터] 즉시 낙상 테스트 모드');
  loadDevices().then(async () => {
    if (devices.length > 0) {
      const device = devices[0];
      const sensorData = generateSensorData(true);
      console.log(`테스트 낙상 발생: ${device.deviceCode}`);
      await axios.post(`${SERVER_URL}/api/fall-events`, {
        residentId: device.residentId,
        deviceId: device.id,
        location: `${device.location}`,
        severity: 'CRITICAL',
        sensorData,
      });
      console.log('테스트 낙상 이벤트 전송 완료');
    }
  });
} else {
  runSimulation().catch(console.error);
}
