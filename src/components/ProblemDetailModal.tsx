import React, { useState } from 'react';
import {
  X,
  Zap,
  Copy,
  Check,
  Code2,
  Clock,
  HardDrive,
  Lightbulb,
  ListOrdered,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Sparkles,
  Play,
  Share2,
  FileCode,
  BookOpen,
} from 'lucide-react';
import { ProblemExplanation, ProblemItem } from '../types/index';

interface ProblemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: ProblemItem | null;
  explanation: ProblemExplanation | null;
  isLoading: boolean;
  onLaunchAnimator: (explanation: ProblemExplanation) => void;
  onSelectSimilarProblem?: (title: string, topic?: string) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  isOpen,
  onClose,
  problem,
  explanation,
  isLoading,
  onLaunchAnimator,
  onSelectSimilarProblem,
}) => {
  // Default to Java as mandated in requirements!
  const [activeLang, setActiveLang] = useState<'java' | 'cpp' | 'python' | 'typescript'>('java');
  const [copied, setCopied] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showLineByLine, setShowLineByLine] = useState(false);
  const [approachTab, setApproachTab] = useState<'optimized' | 'bruteforce'>('optimized');

  if (!isOpen || (!problem && !explanation)) return null;

  const title = explanation?.title || problem?.title || 'Problem Deep Dive';
  const difficulty = explanation?.difficulty || problem?.difficulty || 'Medium';
  const topic = explanation?.topic || problem?.topic || 'Algorithms';

  const handleCopy = () => {
    if (!explanation?.solutions) return;
    const code = explanation.solutions[activeLang];
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter(i => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const revealAllHints = () => {
    setRevealedHints([0, 1, 2]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/10 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-white sticky top-0 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                difficulty === 'Easy'
                  ? 'bg-emerald-100 text-emerald-800'
                  : difficulty === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {difficulty}
            </span>
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-600">
              {topic}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {explanation?.animationFrames && explanation.animationFrames.length > 0 && (
              <button
                onClick={() => onLaunchAnimator(explanation)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Launch Interactive Animation</span>
              </button>
            )}

            <button
              onClick={onClose}
              id="btn-close-problem-modal"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600 mb-3" />
              <h3 className="text-sm font-bold text-zinc-900">Synthesizing Pedagogical Breakdown</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                Generating progressive hints, brute force vs. optimized trade-offs, Java solutions, and step-by-step animation frames.
              </p>
            </div>
          ) : explanation ? (
            <>
              {/* Problem Statement Card */}
              {explanation.statement && (
                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-4">
                  <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Problem Statement
                  </h4>
                  <p className="text-xs text-zinc-700 leading-relaxed font-normal">
                    {explanation.statement}
                  </p>
                </div>
              )}

              {/* SECTION 1: THINK FIRST (Progressive Hints - Requirement 9) */}
              <div className="rounded-2xl border border-amber-200/90 bg-amber-50/40 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-zinc-900">Think First: Progressive Hints</h3>
                  </div>
                  <button
                    onClick={revealAllHints}
                    className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline"
                  >
                    Reveal All
                  </button>
                </div>
                <p className="text-xs text-zinc-600">
                  Try working through the problem mentally before checking the full solution. Progressive hints reveal insights without giving away the complete answer.
                </p>

                <div className="space-y-2 pt-1">
                  {(explanation.hints || [
                    'Hint 1: What is the brute force time complexity? What repeated operations can be avoided?',
                    'Hint 2: Can a secondary data structure (such as a HashMap, Stack, or Two Pointers) reduce the search bound?',
                    'Hint 3: Consider the sorted or contiguous invariant of the input structure.',
                  ]).map((hint, idx) => {
                    const isRevealed = revealedHints.includes(idx);
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-amber-200/70 bg-white p-3 text-xs space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900">Hint {idx + 1}</span>
                          <button
                            onClick={() => toggleHint(idx)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-600 hover:text-zinc-900"
                          >
                            {isRevealed ? (
                              <>
                                <EyeOff className="h-3.5 w-3.5" />
                                <span>Hide</span>
                              </>
                            ) : (
                              <>
                                <Eye className="h-3.5 w-3.5" />
                                <span>Reveal Hint</span>
                              </>
                            )}
                          </button>
                        </div>
                        {isRevealed ? (
                          <p className="text-xs text-zinc-700 leading-relaxed animate-in fade-in">
                            {hint}
                          </p>
                        ) : (
                          <div
                            onClick={() => toggleHint(idx)}
                            className="h-6 rounded bg-zinc-100 border border-dashed border-zinc-300 flex items-center justify-center text-[10px] text-zinc-400 cursor-pointer hover:bg-zinc-200/60"
                          >
                            Click to reveal Hint {idx + 1}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: APPROACH EXPLANATION (Brute Force vs Optimized - Requirement 10) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-zinc-900">Algorithmic Approaches</h3>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1">
                    <button
                      onClick={() => setApproachTab('optimized')}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                        approachTab === 'optimized'
                          ? 'bg-white text-emerald-800 shadow-2xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Optimized Approach
                    </button>
                    <button
                      onClick={() => setApproachTab('bruteforce')}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                        approachTab === 'bruteforce'
                          ? 'bg-white text-zinc-900 shadow-2xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      Brute Force
                    </button>
                  </div>
                </div>

                {approachTab === 'optimized' ? (
                  <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/20 p-5 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        Optimized Paradigm
                      </span>
                      <h4 className="text-base font-bold text-zinc-900">
                        {explanation.optimizedApproach?.algorithm || 'Optimal Linear Approach'}
                      </h4>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                        {explanation.optimizedApproach?.intuition}
                      </p>
                    </div>

                    {/* Step by Step */}
                    <div>
                      <p className="text-xs font-bold text-zinc-800 mb-2">Step-by-Step Algorithm:</p>
                      <ul className="space-y-1.5 text-xs text-zinc-700">
                        {(explanation.optimizedApproach?.steps || [
                          '1. Initialize state variables and lookup structures.',
                          '2. Single pass through the input array.',
                          '3. Update optimal solution dynamically.',
                        ]).map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Complexity with Why */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Time Complexity: {explanation.optimizedApproach?.timeComplexity || explanation.timeComplexity}</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                          {explanation.optimizedApproach?.complexityReason || explanation.timeComplexityWhy || 'Each element is visited a constant number of times.'}
                        </p>
                      </div>

                      <div className="rounded-xl border border-zinc-200 bg-white p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
                          <HardDrive className="h-3.5 w-3.5" />
                          <span>Space Complexity: {explanation.optimizedApproach?.spaceComplexity || explanation.spaceComplexity}</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed">
                          {explanation.spaceComplexityWhy || 'Auxiliary storage needed for hash table or memoization array.'}
                        </p>
                      </div>
                    </div>

                    {explanation.optimizedApproach?.whyOptimizationWorks && (
                      <div className="rounded-xl bg-white p-3 border border-emerald-200 text-xs text-emerald-950">
                        <span className="font-bold">Why this optimization works: </span>
                        {explanation.optimizedApproach.whyOptimizationWorks}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Baseline Comparison
                      </span>
                      <h4 className="text-base font-bold text-zinc-900">Naive / Brute Force Approach</h4>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                        {explanation.bruteForce?.idea || 'Exhaustively check all combinations to verify conditions.'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-zinc-800 mb-2">Execution Steps:</p>
                      <ul className="space-y-1 text-xs text-zinc-700">
                        {(explanation.bruteForce?.steps || [
                          'Loop through each element using nested iterations.',
                          'Check condition on each element pair.',
                        ]).map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-zinc-400 font-mono">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 space-y-1">
                        <span className="text-xs font-bold text-rose-700">
                          Time Complexity: {explanation.bruteForce?.timeComplexity || 'O(N^2)'}
                        </span>
                        <p className="text-[11px] text-zinc-500">
                          {explanation.bruteForce?.complexityReason || 'Nested loops checking all combinations.'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-zinc-200 bg-white p-3 space-y-1">
                        <span className="text-xs font-bold text-zinc-700">
                          Space Complexity: {explanation.bruteForce?.spaceComplexity || 'O(1)'}
                        </span>
                        <p className="text-[11px] text-zinc-500">No extra dynamic memory allocated.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: MULTI-LANGUAGE CODE (Default Java - Requirement 11) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-zinc-900">Production Code Solutions</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Language Tabs: Java First! */}
                    <div className="flex rounded-lg bg-zinc-100 p-1">
                      <button
                        onClick={() => setActiveLang('java')}
                        className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                          activeLang === 'java'
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        Java (Default)
                      </button>
                      <button
                        onClick={() => setActiveLang('cpp')}
                        className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                          activeLang === 'cpp'
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        C++
                      </button>
                      <button
                        onClick={() => setActiveLang('python')}
                        className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                          activeLang === 'python'
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        Python
                      </button>
                      <button
                        onClick={() => setActiveLang('typescript')}
                        className={`rounded px-2.5 py-1 text-xs font-bold transition-all ${
                          activeLang === 'typescript'
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        JavaScript
                      </button>
                    </div>

                    <button
                      onClick={() => setShowLineByLine(!showLineByLine)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors ${
                        showLineByLine
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {showLineByLine ? 'Hide Line Walkthrough' : 'Explain Line-by-Line'}
                    </button>

                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Block */}
                <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-100 overflow-x-auto shadow-inner">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[10px] text-zinc-400">
                    <span>Language: {activeLang.toUpperCase()}</span>
                    <span>Standard LeetCode / Competitive Format</span>
                  </div>
                  <pre className="leading-relaxed font-mono">
                    <code>{explanation.solutions?.[activeLang] || '// Solution loading...'}</code>
                  </pre>
                </div>

                {/* Line-by-Line Code Breakdown (Requirement 11) */}
                {showLineByLine && (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                      Line-by-Line Code Breakdown
                    </h4>
                    <div className="space-y-2">
                      {(explanation.lineByLineExplanation || [
                        { line: 3, code: 'Map<Integer, Integer> map = new HashMap<>();', explanation: 'Creates HashMap to remember previously inspected elements for O(1) lookup.' },
                        { line: 6, code: 'int complement = target - nums[i];', explanation: 'Calculates the exact complement value needed to reach the target sum.' },
                        { line: 8, code: 'if (map.containsKey(complement))', explanation: 'Instant verification whether the complement was already seen in an earlier index.' },
                      ]).map((item, idx) => (
                        <div key={idx} className="rounded-lg bg-white p-3 border border-zinc-200/80 text-xs space-y-1">
                          <div className="flex items-center gap-2 font-mono text-emerald-800">
                            <span className="font-bold text-zinc-400 text-[11px]">Line {item.line}:</span>
                            <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-900">{item.code}</code>
                          </div>
                          <p className="text-zinc-600 text-[11px] pl-2 border-l-2 border-emerald-400">
                            {item.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: SIMILAR PROBLEMS (Requirement 12) */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-zinc-900">
                      Learned {title}? Try These Next
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">
                  Reinforce the pattern immediately with problem difficulty variations:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {(explanation.similarProblems || [
                    {
                      relationship: 'Slightly Easier' as const,
                      title: 'Contains Duplicate',
                      difficulty: 'Easy' as const,
                      topic: 'Arrays & Hashing',
                      platform: 'LeetCode',
                      url: 'https://leetcode.com/problems/contains-duplicate/',
                    },
                    {
                      relationship: 'Same Pattern / Difficulty' as const,
                      title: 'Two Sum II - Input Array Is Sorted',
                      difficulty: 'Medium' as const,
                      topic: 'Two Pointers',
                      platform: 'LeetCode',
                      url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                    },
                    {
                      relationship: 'Slightly Harder' as const,
                      title: '3Sum',
                      difficulty: 'Medium' as const,
                      topic: 'Two Pointers',
                      platform: 'LeetCode',
                      url: 'https://leetcode.com/problems/3sum/',
                    },
                  ]).map((sim, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-200/90 bg-zinc-50/60 p-3 flex flex-col justify-between space-y-2 hover:bg-white hover:border-zinc-300 transition-colors"
                    >
                      <div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            sim.relationship.includes('Easier')
                              ? 'bg-blue-100 text-blue-800'
                              : sim.relationship.includes('Same')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {sim.relationship}
                        </span>
                        <h5 className="text-xs font-bold text-zinc-900 mt-2">{sim.title}</h5>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                          <span>{sim.difficulty}</span>
                          <span>•</span>
                          <span>{sim.topic}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between">
                        {onSelectSimilarProblem && (
                          <button
                            onClick={() => onSelectSimilarProblem(sim.title, sim.topic)}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900"
                          >
                            Analyze
                          </button>
                        )}
                        <a
                          href={sim.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800"
                        >
                          <span>Solve</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-3.5 bg-zinc-50">
          <span className="text-xs text-zinc-500 font-medium">
            AI pedagogical insights derived from profile analysis & algorithm patterns.
          </span>

          <div className="flex items-center gap-3">
            {explanation?.animationFrames && explanation.animationFrames.length > 0 && (
              <button
                onClick={() => onLaunchAnimator(explanation)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-500 transition-colors"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Interactive Algorithm Animation</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
