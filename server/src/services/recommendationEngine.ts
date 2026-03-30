interface ResidentForRecommendation {
  id: string;
  mobilityLevel: number;
  cognitiveLevel: string;
  diseases: { disease: { name: string } }[];
  programEnrollments: { programId: string; status: string }[];
}

interface ProgramForRecommendation {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  minMobilityLevel: number;
  minCognitiveLevel: string;
  excludedDiseases?: string | null;
  status: string;
  capacity?: number | null;
  enrolledCount: number;
}

export interface Recommendation {
  programId: string;
  programName: string;
  score: number;
  reason: string;
}

const COGNITIVE_LEVELS = ['NORMAL', 'MILD', 'MODERATE', 'SEVERE'];

function cognitiveToIndex(level: string): number {
  return COGNITIVE_LEVELS.indexOf(level);
}

export function generateRecommendations(
  resident: ResidentForRecommendation,
  programs: ProgramForRecommendation[]
): Recommendation[] {
  const enrolledProgramIds = new Set(
    resident.programEnrollments
      .filter(e => e.status === 'ACTIVE')
      .map(e => e.programId)
  );

  const recommendations: Recommendation[] = [];

  for (const program of programs) {
    if (enrolledProgramIds.has(program.id)) continue;
    if (program.status === 'ENDED' || program.status === 'SUSPENDED') continue;
    if (program.capacity && program.enrolledCount >= program.capacity) continue;

    // 이동성 확인
    if (resident.mobilityLevel < program.minMobilityLevel) continue;

    // 인지 수준 확인 (resident 레벨이 최소 요구 레벨보다 낮으면 제외)
    const residentCogIdx = cognitiveToIndex(resident.cognitiveLevel);
    const minCogIdx = cognitiveToIndex(program.minCognitiveLevel);
    if (residentCogIdx > minCogIdx) continue;

    // 제외 질병 확인
    if (program.excludedDiseases) {
      const excluded = JSON.parse(program.excludedDiseases) as string[];
      const residentDiseases = resident.diseases.map(d => d.disease.name);
      const hasExcluded = excluded.some(d => residentDiseases.includes(d));
      if (hasExcluded) continue;
    }

    // 점수 계산
    let score = 50;
    const reasons: string[] = [];
    const diseases = resident.diseases.map(d => d.disease.name);

    // 카테고리별 점수
    if (program.category === 'HEALTH_REHAB') {
      score += 20;
      reasons.push('재활 건강 프로그램');
      if (diseases.includes('뇌졸중') || diseases.includes('골다공증') || diseases.includes('관절염')) {
        score += 15;
        reasons.push('관련 질환 맞춤 프로그램');
      }
    }

    if (program.category === 'COGNITIVE') {
      if (resident.cognitiveLevel !== 'NORMAL') {
        score += 25;
        reasons.push('인지 기능 강화 필요');
      } else {
        score += 10;
        reasons.push('인지 기능 유지');
      }
      if (diseases.includes('치매') || diseases.includes('파킨슨병')) {
        score += 15;
        reasons.push('인지 재활 권장');
      }
    }

    if (program.category === 'EXERCISE') {
      score += 15;
      reasons.push('신체 활동 권장');
      if (resident.mobilityLevel <= 2) {
        score += 10;
        reasons.push('이동 능력 향상 도움');
      }
    }

    if (program.category === 'SOCIAL') {
      score += 10;
      reasons.push('사회적 참여 권장');
      if (diseases.includes('우울증')) {
        score += 20;
        reasons.push('우울증 완화에 도움');
      }
    }

    if (program.category === 'CULTURE') {
      score += 10;
      reasons.push('여가 활동');
    }

    // 정원 여유에 따른 점수
    if (program.capacity) {
      const availableRatio = (program.capacity - program.enrolledCount) / program.capacity;
      if (availableRatio > 0.5) score += 5;
    }

    // 최대 100점
    score = Math.min(100, score);

    recommendations.push({
      programId: program.id,
      programName: program.name,
      score,
      reason: reasons.join(', '),
    });
  }

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);
}
