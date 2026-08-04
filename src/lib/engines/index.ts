// ═════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — Learning Engines
// Barrel file that re-exports all engine modules and shared types.
// ═════════════════════════════════════════════════════════════════════════════════════════════

// ─── Types ────────────────────────────────────────────────────────────────────────────────────────────────
export * from './types';

// ─── Country Engine ────────────────────────────────────────────────────────────────────────────────────────
export {
  getCountriesByContinent,
  searchCountries,
  compareCountries,
  getSpeedLimits,
  getRequiredDocuments,
  getRequiredEquipment,
  getSanctions,
  getCommonInfractions,
  formatBloodAlcohol,
  getContinentList,
  sortByField,
} from './country-engine';

// ─── License Engine ────────────────────────────────────────────────────────────────────────────────────────
export {
  getLicensesByCategory,
  getLicenseByCode,
  checkEligibility,
  getProgressionPath,
  getPrerequisites,
  getVehicles,
  getEvaluationCriteria,
  getAgeRequired,
  getAllCategories,
} from './license-engine';

// ─── Course Engine ────────────────────────────────────────────────────────────────────────────────────────
export {
  getCoursesByCategory,
  getCoursesByLevel,
  getCoursesByLicense,
  calculateProgress,
  getNextModule,
  isCourseComplete,
  getEstimatedTime,
  sortModulesByOrder,
  getModuleObjectives,
  getModuleTips,
  getModuleMistakes,
} from './course-engine';

// ─── Quiz Engine ───────────────────────────────────────────────────────────────────────────────────────────
export {
  selectRandomQuestions,
  selectByDifficulty,
  selectByCategory,
  selectAdaptive,
  calculateScore,
  getWrongCategories,
  generateExplanation,
  shuffleOptions,
  filterByTags,
} from './quiz-engine';

// ─── Exam Engine ───────────────────────────────────────────────────────────────────────────────────────────
export {
  createExamSession,
  startTimer,
  submitExam,
  getExamConfig,
  calculatePassScore,
  formatDuration,
  calculateAverageTime,
  getErrorAnalysis,
  getExamHistory,
} from './exam-engine';

// ─── Progress Engine ───────────────────────────────────────────────────────────────────────────────────────
export {
  calculateOverallProgress,
  analyzeStrengths,
  analyzeWeaknesses,
  generateRecommendations,
  calculateStudyStreak,
  getNextMilestone,
  getProgressByCategory,
  generateWeeklyReport,
  estimateTimeToCompletion,
  getSkillLevel,
} from './progress-engine';

// ─── Certification Engine ───────────────────────────────────────────────────────────────────────────────────
export {
  generateCertificateId,
  generateVerificationHash,
  generateQRData,
  formatCertificate,
  isValidCertificate,
  getCertificateTypeLabel,
  calculateExpiryDate,
  formatDate,
} from './certification-engine';
