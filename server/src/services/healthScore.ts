interface HealthRecord {
  systolicBP?: number | null;
  diastolicBP?: number | null;
  bloodSugarFasting?: number | null;
  heartRate?: number | null;
  temperature?: number | null;
  weight?: number | null;
  sleepHours?: number | null;
  waterIntake?: number | null;
  mealAmount?: string | null;
  moodScore?: number | null;
}

export function calculateHealthScore(records: HealthRecord[]): number {
  if (!records || records.length === 0) return 0;

  const latest = records[0];
  let score = 100;
  let deductions = 0;

  // 혈압 평가
  if (latest.systolicBP && latest.diastolicBP) {
    if (latest.systolicBP > 160 || latest.diastolicBP > 100) {
      deductions += 25;
    } else if (latest.systolicBP > 140 || latest.diastolicBP > 90) {
      deductions += 15;
    } else if (latest.systolicBP < 90 || latest.diastolicBP < 60) {
      deductions += 20;
    }
  }

  // 혈당 평가
  if (latest.bloodSugarFasting) {
    if (latest.bloodSugarFasting > 200) {
      deductions += 20;
    } else if (latest.bloodSugarFasting > 130) {
      deductions += 10;
    } else if (latest.bloodSugarFasting < 70) {
      deductions += 25;
    }
  }

  // 심박수 평가
  if (latest.heartRate) {
    if (latest.heartRate > 100 || latest.heartRate < 50) {
      deductions += 10;
    }
  }

  // 체온 평가
  if (latest.temperature) {
    if (latest.temperature > 37.5) {
      deductions += 15;
    } else if (latest.temperature < 36.0) {
      deductions += 10;
    }
  }

  // 수면 평가
  if (latest.sleepHours) {
    if (latest.sleepHours < 4 || latest.sleepHours > 10) {
      deductions += 10;
    } else if (latest.sleepHours < 6) {
      deductions += 5;
    }
  }

  // 수분 평가
  if (latest.waterIntake) {
    if (latest.waterIntake < 800) {
      deductions += 10;
    } else if (latest.waterIntake < 1000) {
      deductions += 5;
    }
  }

  // 식사량 평가
  if (latest.mealAmount === 'LOW') {
    deductions += 10;
  }

  // 기분 점수 평가
  if (latest.moodScore) {
    if (latest.moodScore <= 2) {
      deductions += 10;
    }
  }

  score = Math.max(0, score - deductions);
  return score;
}

export function getHealthStatus(score: number): { label: string; color: string } {
  if (score >= 80) return { label: '양호', color: 'green' };
  if (score >= 60) return { label: '주의', color: 'yellow' };
  if (score >= 40) return { label: '경고', color: 'orange' };
  return { label: '위험', color: 'red' };
}

export function analyzeHealthTrend(records: HealthRecord[]): {
  bpTrend: string;
  sugarTrend: string;
  weightTrend: string;
} {
  if (records.length < 7) {
    return { bpTrend: 'STABLE', sugarTrend: 'STABLE', weightTrend: 'STABLE' };
  }

  const recent = records.slice(0, 7);
  const older = records.slice(7, 14);

  const avgBP = (recs: HealthRecord[]) => {
    const valid = recs.filter(r => r.systolicBP);
    return valid.length > 0 ? valid.reduce((sum, r) => sum + (r.systolicBP || 0), 0) / valid.length : 0;
  };

  const avgSugar = (recs: HealthRecord[]) => {
    const valid = recs.filter(r => r.bloodSugarFasting);
    return valid.length > 0 ? valid.reduce((sum, r) => sum + (r.bloodSugarFasting || 0), 0) / valid.length : 0;
  };

  const avgWeight = (recs: HealthRecord[]) => {
    const valid = recs.filter(r => r.weight);
    return valid.length > 0 ? valid.reduce((sum, r) => sum + (r.weight || 0), 0) / valid.length : 0;
  };

  const bpRecent = avgBP(recent);
  const bpOlder = avgBP(older);
  const sugarRecent = avgSugar(recent);
  const sugarOlder = avgSugar(older);
  const weightRecent = avgWeight(recent);
  const weightOlder = avgWeight(older);

  const getTrend = (recent: number, older: number, threshold: number) => {
    if (older === 0) return 'STABLE';
    const diff = recent - older;
    if (diff > threshold) return 'INCREASING';
    if (diff < -threshold) return 'DECREASING';
    return 'STABLE';
  };

  return {
    bpTrend: getTrend(bpRecent, bpOlder, 5),
    sugarTrend: getTrend(sugarRecent, sugarOlder, 10),
    weightTrend: getTrend(weightRecent, weightOlder, 1),
  };
}
