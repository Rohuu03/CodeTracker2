import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Target,
  ArrowRight,
  Code2,
  Zap,
  Clock,
  HelpCircle,
  BarChart3,
  Layers,
  ChevronRight,
  Flame,
  Activity,
  Trophy,
  ShieldCheck,
  BrainCircuit,
  Info,
} from 'lucide-react';
import {
  AIAnalysisResult,
  CodingProfile,
  TopicMastery,
  WeakArea,
  DailyPracticeRecommendation,
  DynamicRoadmapStep,
} from '../types/index';
import { PersonalizedRecommendationsSection } from './PersonalizedRecommendationsSection';

interface AIRecommendationsProps {
  analysis: AIAnalysisResult | null;
  profiles?: CodingProfile[];
  onOpenProblem: (title: string, topic?: string) => void;
  onAnimateProblem: (title: string, topic?: string) => void;
  onOpenConnect?: () => void;
  onSyncAndReanalyze?: () => void;
  isAnalyzing?: boolean;
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  analysis,
  profiles = [],
  onOpenProblem,
  onAnimateProblem,
  onOpenConnect,
  onSyncAndReanalyze,
  isAnalyzing,
}) => {
  const [selectedWhyItem, setSelectedWhyItem] = useState<{
    title: string;
    evidence: string;
    confidence?: string;
    rawData?: any;
    explanation?: string;
  } | null>(null);

  const [showMasteryCalculationModal, setShowMasteryCalculationModal] = useState(false);

  if (!analysis) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 mb-4">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900">No Profile Analysis Available Yet</h3>
        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
          Connect your coding profiles (LeetCode or Codeforces) to generate your data-backed AI coaching dossier, topic mastery scores, and personalized practice roadmap.
        </p>
        {onOpenConnect && (
          <button
            onClick={onOpenConnect}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-colors"
          >
            <span>Connect Coding Profile</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  const {
    topicMasteryList = [],
    weakAreas = [],
    difficultyProgression,
    contestAnalytics,
    solvingPatterns,
    dynamicRoadmap = [],
    dailyPractice = [],
    executiveSummary,
    overallRatingEstimate,
  } = analysis;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner & Sync Action */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <BrainCircuit className="h-4 w-4" />
              <span>Personal AI Coding Coach</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
              Real Profile Algorithmic Assessment
            </h2>
          </div>

          {onSyncAndReanalyze && (
            <button
              onClick={onSyncAndReanalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 disabled:opacity-50 transition-colors self-start sm:self-auto"
            >
              <Activity className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Reanalyzing...' : 'Sync & Reanalyze'}</span>
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-zinc-600 leading-relaxed max-w-4xl border-l-2 border-emerald-500 pl-3">
          {executiveSummary}
        </p>

        {/* Quick Highlights Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Estimated Calibrated Rating:</span>
            <span className="font-extrabold text-zinc-900 text-sm">{overallRatingEstimate} pts</span>
          </div>
          <div className="h-3 w-px bg-zinc-200 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Total Solved Analyzed:</span>
            <span className="font-bold text-zinc-900">{difficultyProgression?.totalSolved || 0}</span>
          </div>
          <div className="h-3 w-px bg-zinc-200 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400 font-medium">Contest Participation:</span>
            <span className="font-bold text-emerald-700">{contestAnalytics?.totalContests || 0} rounds</span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S PRACTICE (Requirement 8) */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Target className="h-4 w-4" />
              <span>Today's Practice Plan</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900">Recommended Next Problems</h3>
            <p className="text-xs text-zinc-500">
              Calibrated strictly to your identified weak topics and current progression level. Solved problems are filtered out.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {dailyPractice.length > 0 ? (
            dailyPractice.map((prob, idx) => (
              <div
                key={prob.id || idx}
                className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-4 hover:border-zinc-300 hover:bg-white transition-all shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prob.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prob.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500">{prob.topic}</span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                    {prob.title}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{prob.why.reason}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/70 flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      setSelectedWhyItem({
                        title: prob.title,
                        evidence: prob.why.dataEvidence,
                        confidence: prob.why.confidence,
                        explanation: prob.why.reason,
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
                  >
                    <Info className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Why?</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onAnimateProblem(prob.title, prob.topic)}
                      className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
                    >
                      Animate
                    </button>
                    <button
                      onClick={() => onOpenProblem(prob.title, prob.topic)}
                      className="rounded-lg bg-zinc-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-zinc-800 transition-colors"
                    >
                      Solve
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400 col-span-3">Connect a profile to generate your daily plan.</p>
          )}
        </div>
      </div>

      {/* 3. TOPIC MASTERY & WEAK AREAS (Requirements 1, 2, 3, 17, 18) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: CodeTrack AI Estimated Mastery */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                <BarChart3 className="h-4 w-4" />
                <span>CodeTrack AI Estimated Mastery</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900">Topic Proficiency Breakdown</h3>
            </div>
            <button
              onClick={() => setShowMasteryCalculationModal(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-lg px-2.5 py-1 hover:bg-zinc-50 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
              <span>How is this calculated?</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {topicMasteryList.map(item => (
              <div key={item.topic} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-800">{item.topic}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Strong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Developing'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'Limited practice'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 font-mono text-[11px]">{item.solvedCount} solved</span>
                    <span className="font-mono font-bold text-zinc-900 w-9 text-right">{item.score}%</span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.score >= 75
                        ? 'bg-emerald-500'
                        : item.score >= 50
                        ? 'bg-blue-500'
                        : item.score >= 25
                        ? 'bg-amber-500'
                        : 'bg-zinc-400'
                    }`}
                    style={{ width: `${Math.max(4, item.score)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Actual Weakness Areas (Requirement 3) */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Pattern-Based Weakness Detection</span>
            </div>
            <h3 className="text-base font-bold text-zinc-900">Identified Algorithmic Gaps</h3>
            <p className="text-xs text-zinc-500">
              Only highlighted when supported by verified profile data.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {weakAreas.length > 0 ? (
              weakAreas.map((weak, idx) => (
                <div
                  key={weak.topic || idx}
                  className="rounded-xl border border-rose-100 bg-rose-50/30 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-zinc-900">{weak.topic}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        weak.confidence === 'High'
                          ? 'bg-emerald-100 text-emerald-800'
                          : weak.confidence === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      Confidence: {weak.confidence}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-600 font-mono">
                    <span>Attempted: {weak.problemsAttempted}</span>
                    <span>Solved: {weak.problemsSolved}</span>
                    <span>Success: {weak.successRate}%</span>
                  </div>

                  <div className="pt-1">
                    <p className="text-[11px] font-semibold text-zinc-500 mb-1">
                      Limited exposure subtopics:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {weak.limitedExposureSubtopics.map(st => (
                        <span
                          key={st}
                          className="rounded-md bg-white border border-rose-200/80 px-2 py-0.5 text-[10px] font-medium text-zinc-700"
                        >
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() =>
                        setSelectedWhyItem({
                          title: weak.topic,
                          evidence: weak.evidence,
                          confidence: weak.confidence,
                          rawData: weak.rawEvidenceData,
                          explanation: `Derived from ${weak.problemsAttempted} attempts with ${weak.problemsSolved} solved (${weak.successRate}%).`,
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900"
                    >
                      <Info className="h-3.5 w-3.5" />
                      <span>Why this was flagged?</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400">No major weakness patterns detected yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* 4. DIFFICULTY ANALYSIS & PROGRESSION (Requirement 4) */}
      {difficultyProgression && (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <TrendingUp className="h-4 w-4" />
            <span>Difficulty Analysis & Progression</span>
          </div>
          <h3 className="text-base font-bold text-zinc-900">Difficulty Distribution</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Easy */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-800">Easy</span>
                <span className="font-mono text-zinc-900">{difficultyProgression.easyPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-emerald-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${difficultyProgression.easyPercent}%` }}
                />
              </div>
              <p className="text-xs text-zinc-600 font-mono">{difficultyProgression.easyCount} solved</p>
            </div>

            {/* Medium */}
            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-800">Medium</span>
                <span className="font-mono text-zinc-900">{difficultyProgression.mediumPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-amber-200 overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full"
                  style={{ width: `${difficultyProgression.mediumPercent}%` }}
                />
              </div>
              <p className="text-xs text-zinc-600 font-mono">{difficultyProgression.mediumCount} solved</p>
            </div>

            {/* Hard */}
            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-800">Hard</span>
                <span className="font-mono text-zinc-900">{difficultyProgression.hardPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-rose-200 overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full"
                  style={{ width: `${difficultyProgression.hardPercent}%` }}
                />
              </div>
              <p className="text-xs text-zinc-600 font-mono">{difficultyProgression.hardCount} solved</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-zinc-50 p-4 border border-zinc-200/70 text-xs leading-relaxed text-zinc-700 space-y-1.5">
            <p className="font-semibold text-zinc-900">{difficultyProgression.progressionAnalysis}</p>
            <p className="text-zinc-600">{difficultyProgression.recommendedNextStep}</p>
          </div>
        </div>
      )}

      {/* 5. CONTEST PERFORMANCE & RATING PROGRESSION (Requirement 5) */}
      {contestAnalytics && (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                <Trophy className="h-4 w-4" />
                <span>Contest Performance & Rating Progression</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900">
                Competitive Track Record ({contestAnalytics.totalContests} Contests)
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-zinc-400">Peak Rating: </span>
                <span className="font-bold text-zinc-900">{contestAnalytics.peakRating}</span>
              </div>
              <div>
                <span className="text-zinc-400">Current Rating: </span>
                <span className="font-bold text-emerald-700">{contestAnalytics.currentRating}</span>
              </div>
            </div>
          </div>

          {/* Rating progression curve */}
          {contestAnalytics.ratingHistory.length > 1 && (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <p className="text-xs font-bold text-zinc-700 mb-2">Rating Progression History</p>
              <div className="h-32 flex items-end gap-2 pt-4">
                {contestAnalytics.ratingHistory.map((item, idx) => {
                  const minR = Math.min(...contestAnalytics.ratingHistory.map(h => h.rating)) * 0.9;
                  const maxR = Math.max(...contestAnalytics.ratingHistory.map(h => h.rating)) * 1.05;
                  const heightPercent = Math.max(15, Math.min(100, Math.round(((item.rating - minR) / (maxR - minR || 1)) * 100)));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 hidden group-hover:flex flex-col items-center bg-zinc-900 text-white text-[10px] rounded px-2 py-1 shadow-md z-10 whitespace-nowrap">
                        <span>{item.contestName}</span>
                        <span className="font-bold">{item.rating} pts {item.delta ? `(${item.delta > 0 ? `+${item.delta}` : item.delta})` : ''}</span>
                      </div>

                      <div
                        className={`w-full rounded-t transition-all ${
                          item.delta && item.delta >= 0 ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[9px] font-mono text-zinc-400 truncate w-full text-center">
                        {item.date?.split('-')[1] || ''}/{item.date?.split('-')[2] || ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contest Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {contestAnalytics.ratingHistory.slice(-4).map((c, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3 text-xs space-y-1">
                <p className="font-bold text-zinc-900 truncate" title={c.contestName}>
                  {c.contestName}
                </p>
                <div className="flex items-center justify-between font-mono text-zinc-600">
                  <span>Rating: {c.rating}</span>
                  {c.delta !== undefined && (
                    <span className={c.delta >= 0 ? 'text-emerald-700 font-bold' : 'text-rose-700'}>
                      {c.delta >= 0 ? `+${c.delta}` : c.delta}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Rank: {c.rank ? `#${c.rank}` : 'Recorded'}</span>
                  <span>Solved: ~{c.problemsSolved || 2}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-zinc-50 p-3.5 border border-zinc-200/70 text-xs text-zinc-600">
            <span className="font-bold text-zinc-900">Coach Insight: </span>
            {contestAnalytics.aiExplanation}
          </div>
        </div>
      )}

      {/* 6. SOLVING PATTERN ANALYSIS (Requirement 6) */}
      {solvingPatterns && (
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Zap className="h-4 w-4" />
            <span>Submission & Solving Pattern Analysis</span>
          </div>
          <h3 className="text-base font-bold text-zinc-900">Behavioral Problem-Solving Patterns</h3>

          {solvingPatterns.hasEnoughData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 space-y-2">
                <p className="text-xs font-bold text-emerald-900">You tend to solve problems faster when:</p>
                <ul className="space-y-1 text-xs text-zinc-700">
                  {solvingPatterns.fastestTopics.map(t => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 space-y-2">
                <p className="text-xs font-bold text-rose-900">Your failed submissions are frequently associated with:</p>
                <ul className="space-y-1 text-xs text-zinc-700">
                  {solvingPatterns.failureTendencies.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-500 font-medium">
              {solvingPatterns.insightNote}
            </div>
          )}
        </div>
      )}

      {/* 6. PERSONALIZED PROBLEM RECOMMENDATION ENGINE (What Should I Solve Now? + Today's Problems) */}
      <PersonalizedRecommendationsSection
        profiles={profiles}
        aiAnalysis={analysis}
        onStartProblem={onOpenProblem}
        onAnimateProblem={onAnimateProblem}
        onOpenConnect={onOpenConnect}
      />

      {/* 7. DYNAMIC ROADMAP (Requirement 7) */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Calendar className="h-4 w-4" />
            <span>Dynamic Algorithmic Roadmap</span>
          </div>
          <h3 className="text-base font-bold text-zinc-900">Your Current Progressive Curriculum</h3>
          <p className="text-xs text-zinc-500">
            Automatically adapts as you solve more problems in each respective domain.
          </p>
        </div>

        <div className="space-y-4">
          {dynamicRoadmap.map(step => (
            <div
              key={step.step}
              className="rounded-xl border border-zinc-200/90 bg-zinc-50/40 p-4 space-y-2 hover:bg-white hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-900 text-white font-mono font-bold text-[10px]">
                    {step.step}
                  </span>
                  <span className="font-bold text-zinc-900">{step.topic}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-mono text-[11px]">
                    {step.currentSolved} / {step.targetCount} problems
                  </span>
                  <span className="font-mono font-bold text-zinc-900 w-9 text-right">
                    {step.progressPercent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    step.progressPercent >= 100
                      ? 'bg-emerald-500'
                      : step.progressPercent > 30
                      ? 'bg-blue-500'
                      : 'bg-zinc-400'
                  }`}
                  style={{ width: `${Math.max(2, step.progressPercent)}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className="text-xs text-zinc-500">{step.goalDescription}</p>
                <div className="flex flex-wrap gap-1">
                  {step.keyConcepts.map(c => (
                    <span
                      key={c}
                      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Why?" Data Evidence Modal (Requirement 17 & 18) */}
      {selectedWhyItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-zinc-900">Why was this recommended?</h4>
              </div>
              <button
                onClick={() => setSelectedWhyItem(null)}
                className="text-zinc-400 hover:text-zinc-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-700">
              <div>
                <span className="font-semibold text-zinc-500">Target: </span>
                <span className="font-bold text-zinc-900">{selectedWhyItem.title}</span>
              </div>

              {selectedWhyItem.confidence && (
                <div>
                  <span className="font-semibold text-zinc-500">Confidence Rating: </span>
                  <span className="font-bold text-emerald-700">{selectedWhyItem.confidence}</span>
                </div>
              )}

              <div className="rounded-xl bg-zinc-50 p-3 border border-zinc-200 font-mono text-[11px] leading-relaxed text-zinc-800">
                <p className="font-bold mb-1 text-zinc-900">Real Profile Evidence:</p>
                <p>{selectedWhyItem.evidence}</p>
                {selectedWhyItem.explanation && (
                  <p className="mt-2 text-zinc-500 italic">{selectedWhyItem.explanation}</p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWhyItem(null)}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "How is this calculated?" Mastery Modal (Requirement 2) */}
      {showMasteryCalculationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-bold text-zinc-900">CodeTrack AI Estimated Mastery</h4>
              </div>
              <button
                onClick={() => setShowMasteryCalculationModal(false)}
                className="text-zinc-400 hover:text-zinc-700 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
              <p>
                Topic mastery is an <strong>estimated diagnostic score</strong> (0 to 100%) calculated directly from your real platform metrics across 5 deterministic dimensions:
              </p>

              <div className="space-y-2 pl-2 font-mono text-[11px]">
                <div className="rounded-lg bg-zinc-50 p-2 border border-zinc-200">
                  <strong className="text-zinc-900">1. Problem Volume (0-40 pts):</strong> Total verified problems solved in that tag.
                </div>
                <div className="rounded-lg bg-zinc-50 p-2 border border-zinc-200">
                  <strong className="text-zinc-900">2. Difficulty Weighting (0-25 pts):</strong> Multiplier reward for solving Medium (1.5x) and Hard (3.0x) problems over Easy.
                </div>
                <div className="rounded-lg bg-zinc-50 p-2 border border-zinc-200">
                  <strong className="text-zinc-900">3. Recency & Retention (0-15 pts):</strong> Activity logged within the last 60 days.
                </div>
                <div className="rounded-lg bg-zinc-50 p-2 border border-zinc-200">
                  <strong className="text-zinc-900">4. Success / Acceptance Rate (0-10 pts):</strong> Ratio of accepted submissions to failed submissions.
                </div>
                <div className="rounded-lg bg-zinc-50 p-2 border border-zinc-200">
                  <strong className="text-zinc-900">5. Subtopic Variety (0-10 pts):</strong> Breadth of diverse algorithm patterns solved within that category.
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 italic">
                Note: This is an internal AI coach diagnostic metric and is not an official platform rating.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMasteryCalculationModal(false)}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
