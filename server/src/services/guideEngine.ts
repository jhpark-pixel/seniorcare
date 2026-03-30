interface ResidentData {
  id: string;
  name: string;
  diseases: { disease: { name: string } }[];
  medications: { name: string; dosage: string; schedule: string }[];
  allergies: { type: string; name: string; severity?: string | null }[];
  dietaryRestrictions: { type: string; notes?: string | null }[];
  healthRecords: {
    systolicBP?: number | null;
    diastolicBP?: number | null;
    bloodSugarFasting?: number | null;
    cholesterolTotal?: number | null;
    heartRate?: number | null;
    weight?: number | null;
    sleepHours?: number | null;
    waterIntake?: number | null;
    mealAmount?: string | null;
    moodScore?: number | null;
  }[];
  mobilityLevel: number;
  cognitiveLevel: string;
  weight?: number | null;
  height?: number | null;
}

interface GuideRecommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  detail: string;
}

interface DietGuide {
  title: string;
  summary: string;
  recommendations: GuideRecommendation[];
  avoidFoods: string[];
  recommendFoods: string[];
  dailyCalories?: string;
}

interface ExerciseGuide {
  title: string;
  summary: string;
  recommendations: GuideRecommendation[];
  avoidExercises: string[];
  recommendExercises: string[];
  schedule: string;
}

interface LifestyleGuide {
  title: string;
  summary: string;
  recommendations: GuideRecommendation[];
  dailyRoutine: string[];
}

export function generateDietGuide(resident: ResidentData): DietGuide {
  const diseases = resident.diseases.map(d => d.disease.name);
  const latestRecord = resident.healthRecords[0];
  const recommendations: GuideRecommendation[] = [];
  const avoidFoods: string[] = [];
  const recommendFoods: string[] = [];
  let summary = '';

  // 기본 권장사항
  recommendations.push({
    priority: 'MEDIUM',
    category: '규칙적인 식사',
    detail: '하루 세 끼 규칙적인 시간에 소량씩 나누어 드세요. 식사 시간은 최소 20분 이상으로 천천히 드세요.',
  });

  // 고혈압
  if (diseases.includes('고혈압')) {
    recommendations.push(
      {
        priority: 'HIGH',
        category: '나트륨 제한',
        detail: '하루 나트륨 섭취량을 2,000mg(소금 5g) 이하로 제한하세요. 국물은 건더기 위주로 드시고 국물은 남기세요.',
      },
      {
        priority: 'HIGH',
        category: '칼륨 섭취 증가',
        detail: '칼륨이 풍부한 바나나, 고구마, 시금치, 토마토 등을 규칙적으로 섭취하여 혈압 조절을 도우세요.',
      }
    );
    avoidFoods.push('소금에 절인 음식', '김치(과다 섭취)', '장아찌', '가공육(햄, 소시지)', '인스턴트 식품', '알코올');
    recommendFoods.push('바나나', '고구마', '시금치', '토마토', '두부', '생선', '현미밥');
    summary += '고혈압 관리를 위해 저염식이 중요합니다. ';
  }

  // 당뇨
  if (diseases.includes('당뇨병')) {
    recommendations.push(
      {
        priority: 'HIGH',
        category: '혈당 관리 식사',
        detail: '정제 탄수화물을 줄이고 식이섬유가 풍부한 잡곡밥, 채소를 충분히 드세요. 식후 혈당 급상승을 방지하기 위해 소량씩 자주 드세요.',
      },
      {
        priority: 'HIGH',
        category: '당 섭취 제한',
        detail: '단음료, 과자, 케이크, 과일주스 등 혈당을 급격히 올리는 음식을 피하세요.',
      }
    );
    if (latestRecord?.bloodSugarFasting && latestRecord.bloodSugarFasting > 130) {
      recommendations.push({
        priority: 'HIGH',
        category: '공복 혈당 관리',
        detail: `현재 공복 혈당이 ${latestRecord.bloodSugarFasting.toFixed(0)}mg/dL로 높습니다. 저녁 식사 후 가벼운 산책을 권장하며, 야식을 삼가세요.`,
      });
    }
    avoidFoods.push('흰밥(과다 섭취)', '흰빵', '과자', '사탕', '단음료', '과일주스', '알코올');
    if (!recommendFoods.includes('현미밥')) recommendFoods.push('현미밥');
    recommendFoods.push('잡곡밥', '채소류', '두부', '닭가슴살', '생선');
    summary += '당뇨 관리를 위해 저당식과 규칙적인 식사가 필요합니다. ';
  }

  // 심부전
  if (diseases.includes('심부전')) {
    recommendations.push({
      priority: 'HIGH',
      category: '수분 제한',
      detail: '하루 수분 섭취량을 의사 지시에 따라 제한하세요. 일반적으로 1,500ml 이하를 권장합니다.',
    });
    avoidFoods.push('국물 음식(과다 섭취)', '짠 음식', '알코올', '카페인');
    summary += '심부전 관리를 위해 수분과 나트륨 제한이 중요합니다. ';
  }

  // 골다공증
  if (diseases.includes('골다공증')) {
    recommendations.push({
      priority: 'HIGH',
      category: '칼슘 & 비타민D 섭취',
      detail: '저지방 우유, 요구르트, 치즈 등 유제품과 뼈째 먹는 생선(멸치, 연어)을 통해 칼슘을 충분히 섭취하세요.',
    });
    recommendFoods.push('저지방 우유', '요구르트', '멸치', '두부', '브로콜리');
    avoidFoods.push('알코올', '카페인(과다 섭취)', '탄산음료');
    summary += '골다공증 예방을 위해 칼슘과 비타민D 섭취가 중요합니다. ';
  }

  // 저작 곤란 식이
  const hasDysphagia = resident.dietaryRestrictions.some(d => d.type === 'DYSPHAGIA');
  if (hasDysphagia) {
    recommendations.push({
      priority: 'HIGH',
      category: '연하 곤란 식이',
      detail: '음식을 잘게 다지거나 갈아서 제공하세요. 수분이 많은 음식은 걸쭉한 농도로 조절하고, 식사 중 충분한 시간을 드리세요.',
    });
  }

  // 알레르기 관련
  if (resident.allergies.length > 0) {
    const foodAllergies = resident.allergies.filter(a => a.type === 'FOOD');
    if (foodAllergies.length > 0) {
      foodAllergies.forEach(a => {
        avoidFoods.push(`${a.name} (알레르기: ${a.severity || '주의 필요'})`);
      });
      recommendations.push({
        priority: 'HIGH',
        category: '식품 알레르기 주의',
        detail: `${foodAllergies.map(a => a.name).join(', ')} 알레르기가 있으므로 해당 식품과 관련 음식을 반드시 피하세요.`,
      });
    }
  }

  if (!summary) {
    summary = '균형 잡힌 영양 섭취와 규칙적인 식사 습관을 유지하세요.';
  }

  return {
    title: `${resident.name}님 맞춤 식이 가이드`,
    summary: summary.trim(),
    recommendations,
    avoidFoods: [...new Set(avoidFoods)],
    recommendFoods: [...new Set(recommendFoods)],
  };
}

export function generateExerciseGuide(resident: ResidentData): ExerciseGuide {
  const diseases = resident.diseases.map(d => d.disease.name);
  const recommendations: GuideRecommendation[] = [];
  const avoidExercises: string[] = [];
  const recommendExercises: string[] = [];
  let schedule = '주 3-5회, 하루 20-30분 목표';
  let summary = '';

  // 이동성 레벨에 따른 기본 운동
  if (resident.mobilityLevel === 1) {
    recommendations.push({
      priority: 'HIGH',
      category: '자립 보행 유지',
      detail: '걷기 운동을 매일 20-30분씩 실시하세요. 처음에는 10분부터 시작하여 점차 늘려가세요.',
    });
    recommendExercises.push('걷기', '계단 오르기(천천히)', '태극권', '요가');
    schedule = '주 5회, 하루 30분 목표';
  } else if (resident.mobilityLevel === 2) {
    recommendations.push({
      priority: 'HIGH',
      category: '보조기 활용 운동',
      detail: '보행기나 지팡이를 이용한 보조 보행을 매일 10-20분 실시하고, 앉아서 할 수 있는 운동을 병행하세요.',
    });
    recommendExercises.push('보조 보행', '의자 체조', '물리치료 운동', '수중 운동');
    schedule = '주 4회, 하루 20-30분 목표';
  } else if (resident.mobilityLevel === 3) {
    recommendations.push({
      priority: 'HIGH',
      category: '침상 운동',
      detail: '침대나 의자에서 할 수 있는 관절 가동 운동과 근력 유지 운동을 매일 실시하세요.',
    });
    recommendExercises.push('침상 관절 운동', '탄성 밴드 운동', '호흡 운동');
    schedule = '주 5회, 하루 15-20분 목표';
  } else {
    recommendations.push({
      priority: 'HIGH',
      category: '수동 관절 운동',
      detail: '간호사나 치료사의 도움으로 수동 관절 가동 운동을 매일 실시하여 관절 굳음을 예방하세요.',
    });
    recommendExercises.push('수동 관절 운동', '마사지', '체위 변경');
    schedule = '매일 2-3회 수동 운동';
  }

  // 특정 질병별 운동 주의사항
  if (diseases.includes('뇌졸중')) {
    recommendations.push({
      priority: 'HIGH',
      category: '편마비 재활 운동',
      detail: '마비측 사지의 기능 회복을 위해 물리치료사 지도 하에 재활 운동을 꾸준히 받으세요.',
    });
    avoidExercises.push('고강도 유산소 운동', '과도한 근력 운동');
  }

  if (diseases.includes('골다공증')) {
    recommendations.push(
      {
        priority: 'HIGH',
        category: '낙상 예방',
        detail: '골다공증으로 인해 낙상 시 골절 위험이 높습니다. 항상 지지대를 이용하고 미끄러운 장소를 조심하세요.',
      },
      {
        priority: 'MEDIUM',
        category: '체중 부하 운동',
        detail: '걷기, 댄스 등 뼈에 적절한 부하를 주는 운동이 골밀도 유지에 도움이 됩니다.',
      }
    );
    avoidExercises.push('점프 운동', '충격이 강한 운동', '빠른 방향 전환');
  }

  if (diseases.includes('관절염')) {
    recommendations.push({
      priority: 'HIGH',
      category: '관절 보호 운동',
      detail: '관절에 무리가 가지 않는 수중 운동이나 자전거 타기를 권장합니다. 통증이 심할 때는 휴식을 취하세요.',
    });
    avoidExercises.push('달리기', '계단 운동', '무릎 굽혀 앉기');
    recommendExercises.push('수중 운동', '고정 자전거');
  }

  if (diseases.includes('심부전') || diseases.includes('고혈압')) {
    recommendations.push({
      priority: 'HIGH',
      category: '심혈관 안전 운동',
      detail: '운동 전 준비 운동을 충분히 하고, 운동 중 호흡 곤란, 흉통, 어지러움이 있으면 즉시 중단하세요.',
    });
    avoidExercises.push('고강도 운동', '숨을 멈추는 운동', '갑작스러운 무거운 물건 들기');
  }

  if (diseases.includes('파킨슨병')) {
    recommendations.push(
      {
        priority: 'HIGH',
        category: '파킨슨 특화 운동',
        detail: '태극권, 리듬 운동, 보행 훈련이 파킨슨 증상 완화에 효과적입니다. 균형 능력 향상에 집중하세요.',
      },
      {
        priority: 'HIGH',
        category: '낙상 예방',
        detail: '보행 시 보폭을 크게, 발을 충분히 들어 올려 걷는 연습을 하세요. 이중 과제(걸으면서 말하기 등)는 피하세요.',
      }
    );
  }

  if (!summary) {
    summary = '개인 건강 상태에 맞는 규칙적인 운동으로 신체 기능을 유지하세요.';
  }

  return {
    title: `${resident.name}님 맞춤 운동 가이드`,
    summary,
    recommendations,
    avoidExercises: [...new Set(avoidExercises)],
    recommendExercises: [...new Set(recommendExercises)],
    schedule,
  };
}

export function generateLifestyleGuide(resident: ResidentData): LifestyleGuide {
  const diseases = resident.diseases.map(d => d.disease.name);
  const latestRecord = resident.healthRecords[0];
  const recommendations: GuideRecommendation[] = [];
  const dailyRoutine: string[] = [
    '07:00 기상 및 세면',
    '07:30 아침 식사 및 약 복용',
    '09:00 오전 활동(운동/프로그램 참여)',
    '11:00 자유 시간',
    '12:00 점심 식사 및 약 복용',
    '13:00-14:00 낮잠(30-60분)',
    '14:00 오후 활동(취미/사회 활동)',
    '17:00 저녁 식사 및 약 복용',
    '19:00 여가 활동(TV, 독서)',
    '21:00 취침 준비 및 약 복용',
    '22:00 취침',
  ];

  // 기본 생활 습관 권고사항
  recommendations.push(
    {
      priority: 'HIGH',
      category: '규칙적인 생활 리듬',
      detail: '매일 같은 시간에 기상하고 취침하여 생체 리듬을 유지하세요. 일정한 생활 패턴이 전반적인 건강 유지에 도움이 됩니다.',
    },
    {
      priority: 'HIGH',
      category: '약물 복용 준수',
      detail: `현재 ${resident.medications.length}가지 약을 복용 중입니다. 처방된 시간에 규칙적으로 복용하고, 임의로 중단하지 마세요.`,
    }
  );

  // 수면
  if (latestRecord?.sleepHours && latestRecord.sleepHours < 6) {
    recommendations.push({
      priority: 'HIGH',
      category: '수면 질 개선',
      detail: '수면 시간이 부족합니다. 취침 전 따뜻한 물로 샤워하거나 족욕을 하면 수면에 도움이 됩니다. 낮잠은 1시간 이내로 제한하세요.',
    });
  }

  // 인지 기능
  if (diseases.includes('치매') || resident.cognitiveLevel === 'MILD' || resident.cognitiveLevel === 'MODERATE') {
    recommendations.push(
      {
        priority: 'HIGH',
        category: '인지 기능 자극',
        detail: '독서, 퍼즐, 바둑, 화투 등 두뇌를 사용하는 활동을 매일 30분 이상 실시하세요. 새로운 것을 배우는 경험이 인지 기능 유지에 도움이 됩니다.',
      },
      {
        priority: 'HIGH',
        category: '사회적 활동',
        detail: '다른 어르신들과의 교류와 프로그램 참여가 인지 기능 유지에 크게 도움이 됩니다. 고립되지 않도록 적극적으로 사회 활동에 참여하세요.',
      }
    );
  }

  // 우울증
  if (diseases.includes('우울증') || (latestRecord?.moodScore && latestRecord.moodScore <= 2)) {
    recommendations.push(
      {
        priority: 'HIGH',
        category: '정서적 지지',
        detail: '가족 및 지인과의 정기적인 연락과 만남이 중요합니다. 우울감이 지속될 경우 즉시 의료진에게 알려주세요.',
      },
      {
        priority: 'MEDIUM',
        category: '취미 활동',
        detail: '좋아하는 취미 활동을 찾아 꾸준히 즐기세요. 원예, 그림 그리기, 음악 감상 등이 기분 개선에 도움이 됩니다.',
      }
    );
  }

  // 낙상 예방
  if (resident.mobilityLevel >= 2 || diseases.includes('골다공증') || diseases.includes('파킨슨병')) {
    recommendations.push({
      priority: 'HIGH',
      category: '낙상 예방',
      detail: '화장실 이용 시 반드시 손잡이를 잡고, 미끄럼 방지 슬리퍼를 착용하세요. 어두운 곳에서의 이동 시 조명을 먼저 켜세요. 급하게 일어나지 말고 천천히 자세를 바꾸세요.',
    });
  }

  // 피부 관리
  recommendations.push({
    priority: 'MEDIUM',
    category: '피부 관리',
    detail: '매일 피부 상태를 확인하고 욕창 예방을 위해 체위 변경을 규칙적으로 실시하세요. 보습제를 사용하여 건조함을 예방하세요.',
  });

  // 구강 위생
  recommendations.push({
    priority: 'MEDIUM',
    category: '구강 위생',
    detail: '식사 후 반드시 양치질을 하고, 틀니는 매일 세척하세요. 구강 위생이 전신 건강과 직결됩니다.',
  });

  return {
    title: `${resident.name}님 맞춤 생활 가이드`,
    summary: '건강한 일상 생활 습관 유지를 위한 개인화된 생활 지침입니다.',
    recommendations,
    dailyRoutine,
  };
}
