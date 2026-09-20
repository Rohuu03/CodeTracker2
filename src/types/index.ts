export interface Activity {
  date: string;
  count: number;
  platform?: string;
  problemTitle?: string;
}

export interface TopicStats {
  topic: string;
  solved: number;
  total?: number;
  percentage?: number;
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master' | string;
}

export interface ContestRatingPoint {
  contestName: string;
  rating: number;
  rank?: number;
  date: string;
}

export interface UserProblemHistory {
  platform: string;
  problemId: string;
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
  solvedAt?: string;
}

export interface CodingProfile {
  platform: 'LeetCode' | 'Codeforces' | 'CodeChef' | 'HackerRank' | string;
  username: string;
  profileUrl: string;
  rating?: number;
  maxRating?: number;
  rankTitle?: string;
  problemsSolved: number;
  easySolved?: number;
  mediumSolved?: number;
  hardSolved?: number;
  contestsParticipated?: number;
  acceptanceRate?: number;
  globalRank?: number | string;
  submissions?: number;
  recentActivity?: Activity[];
  recentSubmissions?: {
    title: string;
    status?: string;
    timestamp?: number;
    difficulty?: string;
    language?: string;
    runtime?: string;
  }[];
  solvedProblems?: UserProblemHistory[];
  topics?: TopicStats[];
  contestHistory?: ContestRatingPoint[];
  avatarUrl?: string;
  fetchStatus?: 'success' | 'partial' | 'error';
  errorMessage?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  avatar: string;
  profiles: CodingProfile[];
  createdAt: string;
}

export interface StrengthWeakness {
  type: 'strength' | 'weakness';
  topic: string;
  description: string;
  evidence: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface ImprovementMilestone {
  week: number;
  focusTopic: string;
  targetProblems: number;
  recommendedDifficulty: 'Easy' | 'Medium' | 'Hard';
  goalDescription: string;
  keyConcepts: string[];
}

export interface TopicMastery {
  topic: string;
  score: number; // 0 - 100
  status: 'Strong' | 'Developing' | 'Limited practice' | 'Very limited practice';
  solvedCount: number;
  totalSubmissions?: number;
  calculationBreakdown: {
    problemsFactor: number;
    difficultyFactor: number;
    recencyFactor: number;
    successRateFactor: number;
    varietyFactor: number;
    explanation: string;
  };
}

export interface WeakArea {
  topic: string;
  problemsAttempted: number;
  problemsSolved: number;
  successRate: number;
  limitedExposureSubtopics: string[];
  evidence: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Insufficient data';
  rawEvidenceData: {
    attempted: number;
    solved: number;
    failed: number;
    recentCount: number;
  };
}

export interface DifficultyProgression {
  easyCount: number;
  easyPercent: number;
  mediumCount: number;
  mediumPercent: number;
  hardCount: number;
  hardPercent: number;
  totalSolved: number;
  progressionAnalysis: string;
  recommendedNextStep: string;
}

export interface ContestAnalytics {
  totalContests: number;
  currentRating: number;
  peakRating: number;
  ratingHistory: {
    contestName: string;
    date: string;
    rating: number;
    rank?: number;
    delta?: number;
    problemsSolved?: number;
  }[];
  consistency: string;
  aiExplanation: string;
}

export interface SolvingPatterns {
  fastestTopics: string[];
  failureTendencies: string[];
  hasEnoughData: boolean;
  insightNote: string;
}

export interface DynamicRoadmapStep {
  step: number;
  topic: string;
  progressPercent: number;
  currentSolved: number;
  targetCount: number;
  recommendedDifficulty: 'Easy' | 'Medium' | 'Hard';
  goalDescription: string;
  keyConcepts: string[];
  status: 'in-progress' | 'mastered' | 'upcoming';
}

export interface DailyPracticeRecommendation {
  id: string;
  title: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  url: string;
  estimatedTimeMin: number;
  why: {
    reason: string;
    dataEvidence: string;
    confidence: 'High' | 'Medium' | 'Low';
  };
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  dataReferences?: { label: string; value: string }[];
}

export interface AIAnalysisResult {
  executiveSummary: string;
  overallRatingEstimate: number;
  topicMasteryList: TopicMastery[];
  weakAreas: WeakArea[];
  difficultyProgression: DifficultyProgression;
  contestAnalytics: ContestAnalytics;
  solvingPatterns: SolvingPatterns;
  dynamicRoadmap: DynamicRoadmapStep[];
  dailyPractice: DailyPracticeRecommendation[];
  strengths: StrengthWeakness[];
  weaknesses: StrengthWeakness[];
  problemSolvingPatterns: {
    speedVsAccuracy: string;
    consistencyScore: number; // 0 - 100
    contestVolatility: string;
    difficultyCeiling: string;
    recommendationSummary: string;
  };
  personalizedRoadmap: ImprovementMilestone[];
  topRecommendations: ProblemRecommendation[];
}

export interface ProblemRecommendation {
  id: string;
  title: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  url: string;
  reason: string;
  estimatedTimeMin: number;
}

export interface ProblemItem {
  id: string;
  title: string;
  platform: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  solvedDate?: string;
  url: string;
  acceptanceRate?: string;
  submissionInfo?: {
    status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded';
    runtime?: string;
    memory?: string;
    language?: string;
  };
}

export interface AlgorithmFrame {
  step: number;
  title: string;
  description: string;
  codeLine?: number;
  arrayState?: (number | string)[];
  activeIndices?: number[];
  comparingIndices?: number[];
  swappedIndices?: number[];
  pointers?: { [key: string]: number };
  variables?: { [name: string]: string | number | boolean };
  hashMap?: { [key: string]: any };
  stack?: (number | string)[];
  queue?: (number | string)[];
  auxiliaryStructure?: {
    type: 'hashmap' | 'stack' | 'queue' | 'dp-table' | 'set';
    data: Record<string, any>;
  };
  status: 'normal' | 'found' | 'backtrack' | 'completed';
}

export interface CodeExplanationLine {
  line: number;
  code: string;
  explanation: string;
}

export interface SimilarProblem {
  relationship: 'Slightly Easier' | 'Same Pattern / Difficulty' | 'Slightly Harder';
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  platform: string;
  url: string;
}

export interface ProblemExplanation {
  problemId: string;
  title: string;
  statement: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  hints: string[]; // Progressive Hints: Hint 1, Hint 2, Hint 3
  bruteForce: {
    idea: string;
    steps: string[];
    timeComplexity: string;
    spaceComplexity: string;
    complexityReason: string;
  };
  optimizedApproach: {
    intuition: string;
    algorithm: string;
    steps: string[];
    timeComplexity: string;
    spaceComplexity: string;
    complexityReason: string;
    whyOptimizationWorks: string;
  };
  timeComplexity: string;
  spaceComplexity: string;
  timeComplexityWhy: string;
  spaceComplexityWhy: string;
  solutions: {
    java: string; // Default Java solution
    cpp: string;
    python: string;
    typescript: string;
  };
  lineByLineExplanation?: CodeExplanationLine[];
  similarProblems: SimilarProblem[];
  animationFrames?: AlgorithmFrame[];
}

export interface LeetCodeProblemMetadata {
  problemId: string;
  frontendQuestionId: string;
  title: string;
  titleSlug: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicTags: string[];
  acceptanceRate: number;
  paidOnly: boolean;
  hasSolution: boolean;
  hasVideoSolution: boolean;
}

export interface RecommendedProblemItem {
  problemId: string;
  frontendQuestionId: string;
  title: string;
  slug: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  tags: string[];
  acceptanceRate: number;
  priority: 'High' | 'Medium' | 'Recommended';
  reason: string;
  progressionNote?: string;
  matchType: 'weak_topic' | 'difficulty_bridge' | 'topic_combination' | 'reinforcement';
  estimatedTimeMin: number;
}

export interface WhatShouldISolveNowItem {
  step: number;
  topic: string;
  difficulty: string;
  reason: string;
  problem: RecommendedProblemItem;
  badge?: string;
}

export interface ProblemDatabaseSyncStatus {
  lastSyncTime: string;
  totalIndexedProblems: number;
  isSyncing: boolean;
  statusMessage?: string;
  source: string;
}

export interface PersonalizedRecommendationResponse {
  lastProblemDatabaseSync: string;
  totalIndexedProblems: number;
  totalUserSolvedCount: number;
  unsolvedAvailableCount: number;
  userSolvedHistory: UserProblemHistory[];
  whatShouldISolveNow: WhatShouldISolveNowItem[];
  todaysPlan: RecommendedProblemItem[];
  topicRecommendations: {
    topic: string;
    masteryScore: number;
    recommendedDifficulty: string;
    reason: string;
    problems: RecommendedProblemItem[];
  }[];
}

