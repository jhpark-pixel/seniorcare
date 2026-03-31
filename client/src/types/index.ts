export interface Admin {
  id: string;
  username: string;
  name: string;
  role: 'DIRECTOR' | 'NURSE' | 'SOCIAL_WORKER';
  email?: string;
  phone?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface Disease {
  id: string;
  name: string;
  code?: string;
}

export interface ResidentDisease {
  id: string;
  diseaseId: string;
  disease: Disease;
  diagnosedAt?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  prescribedBy?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Allergy {
  id: string;
  type: 'FOOD' | 'DRUG' | 'OTHER';
  name: string;
  severity?: string;
}

export interface DietaryRestriction {
  id: string;
  type: string;
  notes?: string;
}

export interface Resident {
  id: string;
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  roomNumber: string;
  admissionDate: string;
  status: 'ACTIVE' | 'OUT' | 'HOSPITALIZED' | 'DISCHARGED';
  height?: number;
  weight?: number;
  mobilityLevel: number;
  cognitiveLevel: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE';
  monthlyFee?: number;
  deposit?: number;
  depositPaid?: boolean;
  profileImage?: string;
  createdAt: string;
  emergencyContacts?: EmergencyContact[];
  diseases?: ResidentDisease[];
  medications?: Medication[];
  allergies?: Allergy[];
  dietaryRestrictions?: DietaryRestriction[];
  healthRecords?: HealthRecord[];
  fallEvents?: FallEvent[];
  iotDevices?: IotDevice[];
  programEnrollments?: ProgramEnrollment[];
  healthGuides?: HealthGuide[];
  healthScore?: number;
  healthStatus?: { label: string; color: string };
  unhandledFallCount?: number;
}

export interface HealthRecord {
  id: string;
  residentId: string;
  recordedAt: string;
  recordedBy?: string;
  systolicBP?: number;
  diastolicBP?: number;
  bloodSugarFasting?: number;
  bloodSugarPostMeal?: number;
  cholesterolTotal?: number;
  cholesterolHDL?: number;
  cholesterolLDL?: number;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  sleepHours?: number;
  waterIntake?: number;
  mealAmount?: 'HIGH' | 'MEDIUM' | 'LOW';
  bowelMovement?: boolean;
  moodScore?: number;
  notes?: string;
}

export interface FallEvent {
  id: string;
  residentId: string;
  deviceId?: string;
  occurredAt: string;
  location?: string;
  severity: 'WARNING' | 'CRITICAL';
  sensorData?: string;
  status: 'UNHANDLED' | 'HANDLING' | 'RESOLVED';
  isRead: boolean;
  resident?: { id: string; name: string; roomNumber: string };
  device?: IotDevice;
  responses?: FallResponse[];
}

export interface FallResponse {
  id: string;
  fallEventId: string;
  respondedBy: string;
  respondedAt: string;
  content: string;
  outcome: 'NO_INJURY' | 'MINOR_INJURY' | 'HOSPITAL_TRANSFER';
}

export interface IotDevice {
  id: string;
  deviceCode: string;
  residentId?: string;
  location: string;
  batteryLevel?: number;
  lastCommunicated?: string;
  status: 'NORMAL' | 'LOW_BATTERY' | 'DISCONNECTED';
  installedAt: string;
  resident?: { id: string; name: string; roomNumber: string };
}

export interface Program {
  id: string;
  name: string;
  category: 'HEALTH_REHAB' | 'EXERCISE' | 'COGNITIVE' | 'CULTURE' | 'SOCIAL' | 'EXTERNAL';
  description?: string;
  instructor?: string;
  schedule: string;
  location?: string;
  capacity?: number;
  enrolledCount: number;
  status: 'RECRUITING' | 'ONGOING' | 'ENDED' | 'SUSPENDED';
  minMobilityLevel: number;
  minCognitiveLevel: string;
  createdAt: string;
  enrollments?: ProgramEnrollment[];
}

export interface ProgramEnrollment {
  id: string;
  residentId: string;
  programId: string;
  enrolledAt: string;
  status: 'ACTIVE' | 'WITHDRAWN' | 'COMPLETED';
  resident?: { id: string; name: string; roomNumber?: string };
  program?: Program;
}

export interface HealthGuide {
  id: string;
  residentId: string;
  type: 'DIET' | 'EXERCISE' | 'LIFESTYLE';
  content: string;
  generatedAt: string;
  parsedContent?: any;
}

export interface DashboardStats {
  residents: { total: number; active: number; hospitalized: number };
  falls: { unhandled: number; unread: number };
  devices: { lowBattery: number };
  programs: { total: number; active: number };
}

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  assignedTo?: string;
  status: 'PENDING' | 'COMPLETED';
  dueDate: string;
  completedAt?: string;
  completedBy?: string;
  createdBy: string;
  createdAt: string;
}

export interface ManagementStats {
  kpi: {
    totalResidents: number;
    activeResidents: number;
    averageHealthScore: number;
    fallEventsThisMonth: number;
    programParticipationRate: number;
    occupancyRate: number;
    averageAge: number;
  };
  monthlyTrends: {
    month: string;
    residents: number;
    falls: number;
    admissions: number;
  }[];
  residentBreakdown: {
    byStatus: Record<string, number>;
    byMobility: Record<string, number>;
    byCognitive: Record<string, number>;
    byGender: Record<string, number>;
  };
  financial: {
    monthlyRevenue: number;
    operatingCosts: number;
    staffCosts: number;
    profitMargin: number;
    monthlyData: { month: string; revenue: number; costs: number; profit: number }[];
  };
}
