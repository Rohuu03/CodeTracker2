import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  ExternalLink,
  Code2,
  Zap,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ProblemItem } from '../types/index';

interface ProblemsExplorerProps {
  problems: ProblemItem[];
  onOpenProblem: (problem: ProblemItem | string, topic?: string) => void;
  onAnimateProblem: (problem: ProblemItem | string, topic?: string) => void;
  onOpenConnect?: () => void;
}

export const ProblemsExplorer: React.FC<ProblemsExplorerProps> = ({
  problems,
  onOpenProblem,
  onAnimateProblem,
  onOpenConnect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  // Extract distinct platforms and topics
  const platforms = useMemo(() => {
    const set = new Set(problems.map(p => p.platform));
    return ['All', ...Array.from(set)];
  }, [problems]);

  const topics = useMemo(() => {
    const set = new Set(problems.map(p => p.topic));
    return ['All', ...Array.from(set)];
  }, [problems]);

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlatform = selectedPlatform === 'All' || p.platform === selectedPlatform;
      const matchDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
      const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;
      return matchSearch && matchPlatform && matchDifficulty && matchTopic;
    });
  }, [problems, searchQuery, selectedPlatform, selectedDifficulty, selectedTopic]);

  const handleCustomProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onOpenProblem(searchQuery.trim(), selectedTopic === 'All' ? 'Algorithms' : selectedTopic);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Solved & Recommended Problems</h2>
          <p className="text-xs text-zinc-500">
            Real problems solved across your connected accounts, or enter any problem to inspect solutions and visual execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">
            {filteredProblems.length} of {problems.length} Problems
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs space-y-3">
        <form onSubmit={handleCustomProblemSubmit} className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search problem or enter any algorithm (e.g. Two Sum, 3Sum, Course Schedule)..."
              className="w-full rounded-xl border border-zinc-200 pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          {searchQuery.trim().length > 0 && (
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 transition-colors shrink-0"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>AI Solve & Animate</span>
            </button>
          )}
        </form>

        {problems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100 text-xs">
            {/* Platform Filter */}
            {platforms.length > 2 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-zinc-500">Platform:</span>
                <div className="flex items-center gap-1">
                  {platforms.map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        selectedPlatform === p
                          ? 'bg-zinc-900 text-white font-semibold'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-500">Difficulty:</span>
              <div className="flex items-center gap-1">
                {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      selectedDifficulty === d
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Problems Table */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-xs">
        {filteredProblems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 bg-zinc-50/70 font-semibold text-zinc-500">
                <tr>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Topic Paradigm</th>
                  <th className="py-3 px-4">Submission Stats</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {filteredProblems.map(prob => (
                  <tr key={prob.id} className="hover:bg-zinc-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onOpenProblem(prob)}
                        className="text-left font-bold text-zinc-900 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                      >
                        <span>{prob.title}</span>
                        <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-emerald-600" />
                      </button>
                      {prob.solvedDate && (
                        <span className="text-[10px] text-zinc-400 font-normal">
                          Solved: {prob.solvedDate}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                        {prob.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-zinc-100/80 px-2 py-0.5 text-[11px] font-mono text-zinc-600">
                        {prob.topic}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">
                      {prob.submissionInfo ? (
                        <div className="text-[11px] font-mono">
                          <span className="text-emerald-700 font-bold">{prob.submissionInfo.status}</span>
                          {prob.submissionInfo.runtime && (
                            <span className="text-zinc-400"> • {prob.submissionInfo.runtime}</span>
                          )}
                          {prob.submissionInfo.language && (
                            <span className="text-zinc-500"> ({prob.submissionInfo.language})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400">Acc. {prob.acceptanceRate || '65%'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenProblem(prob)}
                          id={`btn-solution-${prob.id}`}
                          className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs"
                          title="View step-by-step breakdown & code"
                        >
                          <Code2 className="h-3 w-3 text-zinc-500" />
                          <span>Solution</span>
                        </button>
                        <button
                          onClick={() => onAnimateProblem(prob)}
                          id={`btn-animate-${prob.id}`}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 transition-colors shadow-2xs"
                          title="Interactive visual animation mode"
                        >
                          <Zap className="h-3 w-3" />
                          <span>Animate</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center max-w-md mx-auto p-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600 mb-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              {searchQuery ? `No matches for "${searchQuery}"` : 'No Problems In List Yet'}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              {searchQuery ? (
                <span>
                  Press <span className="font-semibold text-zinc-800">"AI Solve & Animate"</span> to generate an interactive solution and visualization for this problem.
                </span>
              ) : (
                <span>
                  Connect your LeetCode or Codeforces profile to populate your recent submissions, or enter any problem title in the search box above.
                </span>
              )}
            </p>
            {searchQuery && (
              <button
                onClick={() => onOpenProblem(searchQuery.trim(), 'Algorithms')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Explain & Animate "{searchQuery}"</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
