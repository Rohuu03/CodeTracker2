import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  TrendingUp,
  Award,
  ExternalLink,
  Flame,
  Sparkles,
  Zap,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Plus,
  AlertCircle,
  Search,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { CodingProfile, AIAnalysisResult } from '../types/index';

interface DashboardOverviewProps {
  profiles: CodingProfile[];
  aiAnalysis: AIAnalysisResult | null;
  onNavigateToCoach: () => void;
  onNavigateToProblems: () => void;
  onNavigateToAnimator: () => void;
  onOpenConnect: () => void;
  onQuickConnectUrl: (urlOrHandle: string, platform?: string) => Promise<void>;
  isAnalyzing: boolean;
  onStartProblem?: (title: string, topic?: string) => void;
  onAnimateProblem?: (title: string, topic?: string) => void;
}

const DIFFICULTY_COLORS = {
  Easy: '#10B981', // emerald-500
  Medium: '#F59E0B', // amber-500
  Hard: '#EF4444', // rose-500
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  profiles,
  aiAnalysis,
  onNavigateToCoach,
  onNavigateToProblems,
  onNavigateToAnimator,
  onOpenConnect,
  onQuickConnectUrl,
  isAnalyzing,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('auto');
  const [quickError, setQuickError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If no profiles connected yet, render the First Login / Real Profile Connect View
  if (profiles.length === 0) {
    const handleConnectSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!quickInput.trim()) {
        setQuickError('Please enter your coding profile URL or username.');
        return;
      }
      setQuickError(null);
      setIsSubmitting(true);
      try {
        await onQuickConnectUrl(quickInput.trim(), selectedPlatform === 'auto' ? undefined : selectedPlatform);
      } catch (err: any) {
        setQuickError(err.message || 'Failed to fetch coding profile. Please check the URL.');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="py-8 space-y-8 max-w-4xl mx-auto">
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50 mb-6">
            <Sparkles className="h-8 w-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Real Profile Synchronizer
          </span>

          <h1 className="mt-4 text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Connect your coding profile to view live data
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Enter your public profile URL from <span className="font-semibold text-zinc-800">LeetCode</span>,{' '}
            <span className="font-semibold text-zinc-800">Codeforces</span>,{' '}
            <span className="font-semibold text-zinc-800">CodeChef</span>,{' '}
            <span className="font-semibold text-zinc-800">HackerRank</span>, or{' '}
            <span className="font-semibold text-zinc-800">GitHub</span>. CodeTrack AI reads your actual solved problems,
            contest rating history, and topic coverage with zero simulated data.
          </p>

          {/* Quick Connect Form */}
          <form onSubmit={handleConnectSubmit} className="mt-8 max-w-2xl mx-auto text-left">
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
              {[
                { id: 'auto', label: 'Auto Detect' },
                { id: 'leetcode', label: 'LeetCode' },
                { id: 'codeforces', label: 'Codeforces' },
                { id: 'codechef', label: 'CodeChef' },
                { id: 'hackerrank', label: 'HackerRank' },
                { id: 'github', label: 'GitHub' },
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPlatform === p.id
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="relative flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={quickInput}
                  onChange={e => {
                    setQuickInput(e.target.value);
                    if (quickError) setQuickError(null);
                  }}
                  placeholder="e.g. https://leetcode.com/u/neal_wu/ or codeforces.com/profile/tourist"
                  disabled={isSubmitting || isAnalyzing}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || isAnalyzing}
                id="btn-quick-connect-submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting || isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching Live Data...</span>
                  </>
                ) : (
                  <>
                    <span>Fetch & Analyze</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {quickError && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{quickError}</span>
              </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
              <span>Supports full profile URLs or direct handles.</span>
              <button
                type="button"
                onClick={onOpenConnect}
                className="text-emerald-700 font-semibold hover:underline"
              >
                + Configure multiple platforms at once
              </button>
            </div>
          </form>
        </div>

        {/* Feature Highlights - Functional Guidance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 mb-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Direct Official APIs</h3>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              We query official LeetCode GraphQL and Codeforces REST APIs directly to retrieve exact counts and contest histories.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 mb-3">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Personalized AI Diagnosis</h3>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              Gemini evaluates your verified strengths, bottlenecks, and calculates your rating ceiling based on your real performance.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 mb-3">
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">Interactive Visual Solutions</h3>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              Every solved or recommended algorithm includes step-by-step animated execution with state and pointer trackers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active User Profile Data Computation
  const successfulProfiles = profiles.filter(p => p.fetchStatus !== 'error');
  const errorProfiles = profiles.filter(p => p.fetchStatus === 'error');

  const totalSolved = successfulProfiles.reduce((acc, p) => acc + (p.problemsSolved || 0), 0);
  const easySolved = successfulProfiles.reduce((acc, p) => acc + (p.easySolved || 0), 0);
  const mediumSolved = successfulProfiles.reduce((acc, p) => acc + (p.mediumSolved || 0), 0);
  const hardSolved = successfulProfiles.reduce((acc, p) => acc + (p.hardSolved || 0), 0);
  const totalContests = successfulProfiles.reduce((acc, p) => acc + (p.contestsParticipated || 0), 0);

  const ratings = successfulProfiles.map(p => p.rating || 0).filter(r => r > 0);
  const peakRating = ratings.length > 0 ? Math.max(...ratings) : 0;
  const bestProfile = successfulProfiles.find(p => p.rating === peakRating) || successfulProfiles[0];

  const avgAcceptance = Math.round(
    successfulProfiles.reduce((acc, p) => acc + (p.acceptanceRate || 0), 0) / Math.max(1, successfulProfiles.length)
  );

  // Difficulty data for Pie chart - NO FAKE FALLBACKS
  const difficultyData = [
    { name: 'Easy', value: easySolved, color: DIFFICULTY_COLORS.Easy },
    { name: 'Medium', value: mediumSolved, color: DIFFICULTY_COLORS.Medium },
    { name: 'Hard', value: hardSolved, color: DIFFICULTY_COLORS.Hard },
  ].filter(d => d.value > 0);

  // Aggregated Topics from real profile data
  const topicMap = new Map<string, number>();
  successfulProfiles.forEach(p => {
    p.topics?.forEach(t => {
      topicMap.set(t.topic, (topicMap.get(t.topic) || 0) + t.solved);
    });
  });

  const topicChartData = Array.from(topicMap.entries())
    .map(([topic, solved]) => ({
      topic: topic.length > 14 ? topic.slice(0, 13) + '…' : topic,
      fullTopic: topic,
      solved,
    }))
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 6);

  // Contest Rating History timeline from real profiles
  const contestPoints: { name: string; rating: number; platform: string; date: string }[] = [];
  successfulProfiles.forEach(p => {
    if (p.contestHistory && p.contestHistory.length > 0) {
      p.contestHistory.forEach(ch => {
        contestPoints.push({
          name: ch.contestName.length > 16 ? ch.contestName.slice(0, 15) + '…' : ch.contestName,
          rating: ch.rating,
          platform: p.platform,
          date: ch.date,
        });
      });
    }
  });

  contestPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const displayTimeline = contestPoints.slice(-10);

  return (
    <div className="space-y-8 pb-12">
      {/* Error Notices for Any Failed Profiles */}
      {errorProfiles.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-rose-900">Some profile URLs could not be fetched</h4>
              <ul className="mt-1 list-disc list-inside text-rose-800 space-y-1">
                {errorProfiles.map((p, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{p.platform}: </span>
                    <span>{p.errorMessage || `Could not find profile for ${p.username}`}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onOpenConnect}
                className="mt-2 text-rose-900 font-bold underline hover:text-rose-950"
              >
                Update Profile URLs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Diagnostic Summary Banner */}
      {aiAnalysis && (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    AI Diagnostic Summary
                  </span>
                  <span className="rounded-full bg-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                    Live Verified
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-zinc-800 leading-relaxed max-w-3xl">
                  {aiAnalysis.executiveSummary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onNavigateToCoach}
                id="btn-hero-view-plan"
                className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
              >
                <span>What Should I Solve Now?</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Solved */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Solved</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">{totalSolved}</span>
            <span className="text-xs text-zinc-400">across {successfulProfiles.length} platforms</span>
          </div>
          {/* Mini Difficulty Progress Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100 flex">
            <div
              style={{ width: `${(easySolved / Math.max(1, totalSolved)) * 100}%` }}
              className="bg-emerald-500 h-full"
              title={`Easy: ${easySolved}`}
            />
            <div
              style={{ width: `${(mediumSolved / Math.max(1, totalSolved)) * 100}%` }}
              className="bg-amber-500 h-full"
              title={`Medium: ${mediumSolved}`}
            />
            <div
              style={{ width: `${(hardSolved / Math.max(1, totalSolved)) * 100}%` }}
              className="bg-rose-500 h-full"
              title={`Hard: ${hardSolved}`}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="text-emerald-700 font-medium">E: {easySolved}</span>
            <span className="text-amber-700 font-medium">M: {mediumSolved}</span>
            <span className="text-rose-700 font-medium">H: {hardSolved}</span>
          </div>
        </div>

        {/* Highest Contest Rating */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Peak Contest Rating</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {peakRating > 0 ? peakRating : 'Unrated'}
            </span>
            {bestProfile?.rankTitle && (
              <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-900">
                {bestProfile.rankTitle}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500">
            <Award className="h-3.5 w-3.5 text-zinc-400" />
            <span>{bestProfile ? `Highest on ${bestProfile.platform}` : 'No rated contests yet'}</span>
          </div>
        </div>

        {/* Acceptance Rate */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Avg. Acceptance Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {avgAcceptance > 0 ? `${avgAcceptance}%` : 'N/A'}
            </span>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Computed from verified AC submissions vs total attempts.
          </p>
        </div>

        {/* Contests & Consistency */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Contest Rounds</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-zinc-900">{totalContests}</span>
            <span className="text-xs text-zinc-400">rated contests</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
            <span>Consistency Index:</span>
            <span className="font-bold text-emerald-700">
              {aiAnalysis?.problemSolvingPatterns?.consistencyScore
                ? `${aiAnalysis.problemSolvingPatterns.consistencyScore}/100`
                : 'Evaluating'}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Difficulty Breakdown */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Difficulty Distribution</h3>
              <p className="text-xs text-zinc-500">Real proportion of solved problems by difficulty tier</p>
            </div>
            <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
              {totalSolved} Total Solved
            </span>
          </div>

          {totalSolved > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="font-medium text-zinc-700">Easy</span>
                  </div>
                  <div className="font-mono font-bold text-zinc-900">
                    {easySolved} <span className="text-zinc-400 font-normal">({Math.round((easySolved / Math.max(1, totalSolved)) * 100)}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <span className="font-medium text-zinc-700">Medium</span>
                  </div>
                  <div className="font-mono font-bold text-zinc-900">
                    {mediumSolved} <span className="text-zinc-400 font-normal">({Math.round((mediumSolved / Math.max(1, totalSolved)) * 100)}%)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="font-medium text-zinc-700">Hard</span>
                  </div>
                  <div className="font-mono font-bold text-zinc-900">
                    {hardSolved} <span className="text-zinc-400 font-normal">({Math.round((hardSolved / Math.max(1, totalSolved)) * 100)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-400 text-xs">
              No solved problem records detected yet on connected accounts.
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Ready to train higher difficulty levels?</span>
            <button
              onClick={onNavigateToProblems}
              id="btn-explore-problems-dash"
              className="text-xs font-bold text-zinc-900 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Explore Problem Set</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Contest Rating Progression Chart */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Contest Rating Progression</h3>
              <p className="text-xs text-zinc-500">Live timeline from verified contest rounds</p>
            </div>
            {displayTimeline.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <TrendingUp className="h-4 w-4" />
                <span>{displayTimeline.length} Recorded Rounds</span>
              </div>
            )}
          </div>

          {displayTimeline.length > 0 ? (
            <div className="h-52 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={displayTimeline} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={['dataMin - 60', 'dataMax + 60']}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}
                    formatter={(value: any) => [`${value} pts`, 'Rating']}
                    labelFormatter={label => `Contest: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex flex-col items-center justify-center text-center p-4 text-zinc-400 text-xs">
              <Trophy className="h-8 w-8 text-zinc-300 mb-2" />
              <p className="font-semibold text-zinc-600">No rated contest records found yet</p>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-xs">
                Participate in rated rounds on LeetCode (Weekly/Biweekly) or Codeforces to render your live rating graph.
              </p>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span>Peak: {peakRating > 0 ? `${peakRating} pts` : 'Unrated'}</span>
            <span>
              {displayTimeline.length > 0
                ? `Latest: ${displayTimeline[displayTimeline.length - 1].rating} pts`
                : 'Participate in a rated contest to begin tracking'}
            </span>
          </div>
        </div>
      </div>

      {/* Topics Proficiency Breakdown */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Topic Coverage & Problem Counts</h3>
            <p className="text-xs text-zinc-500">Real solved volume across algorithmic topics</p>
          </div>
          <button
            onClick={onNavigateToCoach}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>View Weak Area Insights</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {topicChartData.length > 0 ? (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="topic" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                  formatter={(value: any) => [`${value} problems`, 'Solved']}
                />
                <Bar dataKey="solved" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400 text-xs">
            Topic breakdown will display as problems are solved across your connected accounts.
          </div>
        )}
      </div>

      {/* Connected Platforms Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Connected Platform Profiles</h3>
            <p className="text-xs text-zinc-500">Live synchronized profiles</p>
          </div>
          <button
            onClick={onOpenConnect}
            id="btn-dash-connect-more"
            className="text-xs font-bold text-zinc-900 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>+ Connect More Platforms</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map(p => (
            <div
              key={p.platform + p.username}
              className={`rounded-2xl border p-5 shadow-xs transition-all ${
                p.fetchStatus === 'error' ? 'border-rose-200 bg-rose-50/40' : 'border-zinc-200/80 bg-white hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white">
                  {p.platform.slice(0, 2).toUpperCase()}
                </span>
                {p.fetchStatus === 'error' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-800">
                    Failed to Sync
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live Verified
                  </span>
                )}
              </div>

              <div className="mb-3">
                <h4 className="text-sm font-bold text-zinc-900">{p.platform}</h4>
                <a
                  href={p.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-zinc-500 hover:text-emerald-600 transition-colors"
                >
                  <span>@{p.username}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {p.fetchStatus === 'error' ? (
                <div className="border-t border-rose-100 pt-3 text-xs text-rose-700">
                  <p className="line-clamp-2">{p.errorMessage || 'Unable to fetch user profile data'}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 pt-3 text-xs">
                    <div>
                      <span className="text-[11px] text-zinc-400">Rating</span>
                      <p className="font-extrabold text-zinc-900">{p.rating ? p.rating : 'Unrated'}</p>
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-400">Solved</span>
                      <p className="font-extrabold text-zinc-900">{p.problemsSolved}</p>
                    </div>
                  </div>

                  {p.rankTitle && (
                    <div className="mt-3 rounded-lg bg-zinc-50 px-2.5 py-1 text-center text-[11px] font-medium text-zinc-700 truncate">
                      {p.rankTitle}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Launch Algorithm Animation Lab Banner */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-900 p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5 text-emerald-400 animate-pulse" />
            <h3 className="text-base font-bold">Interactive Algorithm Animation Mode</h3>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Watch any competitive programming problem execute step-by-step with real-time pointer tracking and state inspectors.
          </p>
        </div>
        <button
          onClick={onNavigateToAnimator}
          id="btn-launch-animator-dash"
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-emerald-400 transition-colors shrink-0"
        >
          <span>Launch Algorithm Animator</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
