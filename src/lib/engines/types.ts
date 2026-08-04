// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — Learning Engine Types
// All shared TypeScript interfaces and enums for the learning platform.
// These types mirror Prisma schema shapes but are plain interfaces (no DB dependency).
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

// ─── Enums ─────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Exam type variants */
export enum ExamType {
  Practice = 'practice',
  MockExam = 'mock_exam',
  Official = 'official',
  Adaptive = 'adaptive',
}

/** Question difficulty level */
export enum DifficultyLevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

/** Course category */
export enum CourseCategory {
  Theory = 'theory',
  Practice = 'practice',
  Safety = 'safety',
  Regulations = 'regulations',
  EcoDriving = 'eco-driving',
  Highway = 'highway',
  Night = 'night',
  Weather = 'weather',
  FirstAid = 'first_aid',
}

/** License category type */
export enum LicenseCategoryType {
  Motorcycle = 'motorcycle',
  Automobile = 'automobile',
  Heavy = 'heavy',
  Special = 'special',
}

/** Road sign category */
export enum SignCategory {
  Danger = 'danger',
  Prohibition = 'prohibition',
  Obligation = 'obligation',
  Priority = 'priority',
  Direction = 'direction',
  Information = 'information',
  Service = 'service',
  Temporary = 'temporary',
  Marking = 'marking',
  TrafficLight = 'traffic_light',
  AgentGesture = 'agent_gesture',
}

/** Question category */
export enum QuestionCategory {
  Regulation = 'regulation',
  Safety = 'safety',
  Sign = 'sign',
  Priority = 'priority',
  Highway = 'highway',
  Intersection = 'intersection',
  Parking = 'parking',
  FirstAid = 'first_aid',
  EcoDriving = 'eco_driving',
  Weather = 'weather',
  Vehicle = 'vehicle',
}

/** Practical exercise category */
export enum ExerciseCategory {
  City = 'city',
  Highway = 'highway',
  Rural = 'rural',
  Mountain = 'mountain',
  Night = 'night',
  Rain = 'rain',
  Fog = 'fog',
  Snow = 'snow',
  Parking = 'parking',
  Maneuver = 'maneuver',
  Intersection = 'intersection',
  Priority = 'priority',
  Roundabout = 'roundabout',
  Overtaking = 'overtaking',
  EmergencyBraking = 'emergency_braking',
  EcoDriving = 'eco_driving',
}

// ─── Data Interfaces ─────────────────────────────────────────────────────────────────────────────────────────────────────

/** Country with driving regulations. Mirrors Prisma Country model. */
export interface CountryData {
  id: string;
  code: string;
  name: string;
  flag: string;
  continent: string;
  capital: string;
  languages: string;
  currency: string;
  drivingSide: string;
  authority: string;
  emergencyPhone: string;
  minAge: number;
  speedUrban: number;
  speedRural: number;
  speedHighway: number;
  bloodAlcohol: number;
  requiredDocuments: string;
  requiredEquipment: string;
  specialFeatures: string;
  licenseCategories: string;
  commonInfractions: string;
  sanctions: string;
}

/** License category (AM, A1, B, C, etc.). Mirrors Prisma LicenseCategory model. */
export interface LicenseCategoryData {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  minAge: number;
  minAgeHeld: number | null;
  vehicles: string;
  prerequisites: string;
  duration: number;
  theoryExam: boolean;
  practicalExam: boolean;
  evaluationCriteria: string;
  icon: string;
}

/** Road sign data. Mirrors Prisma RoadSign model. */
export interface RoadSignData {
  id: string;
  countryCode: string;
  category: string;
  subcategory: string | null;
  name: string;
  description: string;
  meaning: string;
  useCase: string | null;
  shape: string;
  colors: string;
}

/** Question bank item. Mirrors Prisma Question model. */
export interface QuestionData {
  id: string;
  countryCode: string;
  licenseCode: string | null;
  question: string;
  options: string;
  correctIndex: number;
  explanation: string;
  difficulty: string;
  category: string;
  theme: string | null;
  tags: string | null;
  reference: string | null;
  hasImage: boolean;
}

/** Course data. Mirrors Prisma Course model. */
export interface CourseData {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  order: number;
  icon: string | null;
  isPremium: boolean;
  countryCode: string;
  licenseCode: string | null;
}

/** Course module (lesson). Mirrors Prisma Module model. */
export interface CourseModuleData {
  id: string;
  courseId: string;
  title: string;
  content: string;
  type: string;
  order: number;
  duration: number;
  objectives: string | null;
  tips: string | null;
  commonMistakes: string | null;
}

/** Active exam session with timer state. */
export interface ExamSession {
  id: string;
  type: ExamType;
  country: string;
  licenseCode: string;
  questions: QuestionData[];
  answers: (number | null)[];
  score: number | null;
  passed: boolean | null;
  duration: number;
  startedAt: Date;
  completedAt: Date | null;
}

/** Result of a submitted exam. */
export interface ExamResult {
  examId: string;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  duration: number;
  wrongAnswers: string[];
  wrongCategories: string[];
}

/** Aggregated user progress data. */
export interface ProgressData {
  userId: string;
  coursesStarted: number;
  coursesCompleted: number;
  totalQuizAttempts: number;
  avgScore: number;
  bestScore: number;
  passRate: number;
  categoryBreakdown: CategoryBreakdownItem[];
  weakAreas: string[];
}

/** Per-category progress item. */
export interface CategoryBreakdownItem {
  category: string;
  total: number;
  correct: number;
  percentage: number;
}

/** Individual skill record. */
export interface SkillRecordData {
  skill: string;
  category: string;
  level: number;
  attempts: number;
  strengths: string[];
  weaknesses: string[];
}

/** Certificate data for display/verification. */
export interface CertificateData {
  id: string;
  type: string;
  title: string;
  description: string;
  countryCode: string;
  licenseCode: string | null;
  score: number | null;
  certificateId: string;
  issuedAt: Date;
  expiresAt: Date | null;
  qrData: string;
  verificationHash: string;
}

/** Practical exercise item. Mirrors Prisma PracticalExercise model. */
export interface PracticalExerciseData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  objectives: string;
  steps: string;
  criteria: string;
  tips: string | null;
  scoring: string | null;
  countryCode: string;
  licenseCode: string | null;
}

// ─── Helper / Utility Types ───────────────────────────────────────────────────────────────────────────────────────────────

/** Speed limits for a country. */
export interface SpeedLimits {
  urban: number;
  rural: number;
  highway: number;
}

/** Country comparison result. */
export interface CountryComparison {
  field: string;
  countryA: string | number;
  countryB: string | number;
}

/** Continent with country count. */
export interface ContinentInfo {
  name: string;
  count: number;
}

/** Exam configuration. */
export interface ExamConfig {
  type: ExamType;
  questionCount: number;
  timeLimit: number;
  passThreshold: number;
  allowReview: boolean;
  shuffleOptions: boolean;
  adaptiveDifficulty: boolean;
}

/** Timer controller returned by startTimer. */
export interface TimerController {
  elapsed: number;
  remaining: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  onTick: (callback: (elapsed: number, remaining: number) => void) => void;
  onComplete: (callback: () => void) => void;
}

/** Error analysis item. */
export interface ErrorAnalysisItem {
  category: string;
  count: number;
  percentage: number;
  questionIds: string[];
}

/** Exam history summary. */
export interface ExamHistorySummary {
  totalAttempts: number;
  passedCount: number;
  failedCount: number;
  passRate: number;
  avgScore: number;
  bestScore: number;
  avgDuration: number;
  lastAttemptDate: Date | null;
  improvement: number;
}

/** Weekly report summary. */
export interface WeeklyReport {
  totalStudyTime: number;
  quizzesTaken: number;
  avgScore: number;
  coursesProgress: number;
  strongAreas: string[];
  weakAreas: string[];
  recommendation: string;
}

/** Milestone definition. */
export interface Milestone {
  name: string;
  target: number;
  current: number;
  progress: number;
  achieved: boolean;
}

/** Shuffled question with remapped correct index. */
export interface ShuffledQuestion {
  question: QuestionData;
  options: string[];
  correctIndex: number;
}

/** Study streak result. */
export interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: Date | null;
}

/** Sort direction for lists. */
export type SortDirection = 'asc' | 'desc';

/** JSON-safe parsed value (string, number, boolean, array, object, null). */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
