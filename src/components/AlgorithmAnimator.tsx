import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Zap,
  Sparkles,
  Sliders,
  CheckCircle2,
  Code2,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProblemExplanation, AlgorithmFrame } from '../types/index';

interface AlgorithmAnimatorProps {
  currentExplanation: ProblemExplanation | null;
  onSelectPreset: (algorithmKey: string) => void;
}

const PRESET_ALGORITHMS: { id: string; title: string; topic: string }[] = [
  { id: 'two-sum', title: 'Two Sum (Hash Map)', topic: 'Arrays & Hashing' },
  { id: 'binary-search', title: 'Binary Search (Two Pointers)', topic: 'Binary Search' },
  { id: 'sliding-window', title: 'Sliding Window (Max Sum Subarray)', topic: 'Sliding Window' },
  { id: 'coin-change', title: 'Coin Change (Bottom-Up 1D DP)', topic: 'Dynamic Programming' },
  { id: 'invert-tree', title: 'Invert Binary Tree (DFS)', topic: 'Trees & DFS' },
];

export const AlgorithmAnimator: React.FC<AlgorithmAnimatorProps> = ({
  currentExplanation,
  onSelectPreset,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const timerRef = useRef<any>(null);

  // Frames from explanation or fallback default
  const frames: AlgorithmFrame[] = currentExplanation?.animationFrames || [
    {
      step: 1,
      title: 'Initialize Array & Pointers',
      description: 'Starting with sorted array [-1, 0, 3, 5, 9, 12] and target = 9.',
      codeLine: 1,
      arrayState: [-1, 0, 3, 5, 9, 12],
      activeIndices: [0, 5],
      pointers: { 'left': 0, 'right': 5 },
      variables: { 'left': 0, 'right': 5, 'target': 9 },
      status: 'normal',
    },
    {
      step: 2,
      title: 'Evaluate Midpoint Index 2',
      description: 'Midpoint calculated: mid = 2 (value = 3). Compare 3 with target 9.',
      codeLine: 4,
      arrayState: [-1, 0, 3, 5, 9, 12],
      activeIndices: [2],
      pointers: { 'left': 0, 'mid': 2, 'right': 5 },
      variables: { 'nums[mid]': 3, 'target': 9, 'condition': '3 < 9' },
      status: 'normal',
    },
    {
      step: 3,
      title: 'Halve Left Search Space',
      description: 'Since 3 < 9, target must lie in the right half. Shift left = mid + 1 (3).',
      codeLine: 7,
      arrayState: [-1, 0, 3, 5, 9, 12],
      activeIndices: [3, 4, 5],
      pointers: { 'left': 3, 'right': 5 },
      variables: { 'left': 3, 'right': 5 },
      status: 'normal',
    },
    {
      step: 4,
      title: 'Inspect Next Midpoint Index 4',
      description: 'Midpoint calculated: mid = 4 (value = 9). Compare 9 with target 9.',
      codeLine: 4,
      arrayState: [-1, 0, 3, 5, 9, 12],
      activeIndices: [4],
      pointers: { 'left': 3, 'mid': 4, 'right': 5 },
      variables: { 'nums[mid]': 9, 'target': 9, 'condition': '9 == 9' },
      status: 'found',
    },
    {
      step: 5,
      title: 'Target Located at Index 4!',
      description: 'Target 9 confirmed at index 4 in O(log N) iterations.',
      codeLine: 5,
      arrayState: [-1, 0, 3, 5, 9, 12],
      activeIndices: [4],
      pointers: { 'result': 4 },
      variables: { 'returnIndex': 4 },
      status: 'completed',
    },
  ];

  // Reset to first frame if explanation changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [currentExplanation?.problemId]);

  // Animation playback loop
  useEffect(() => {
    if (isPlaying) {
      const delay = 1800 / speedMultiplier;
      timerRef.current = setTimeout(() => {
        if (currentStepIndex < frames.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentStepIndex, speedMultiplier, frames.length]);

  const currentFrame = frames[currentStepIndex] || frames[0];
  const arrayState = currentFrame.arrayState || [2, 7, 11, 15];

  const handleNext = () => {
    if (currentStepIndex < frames.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Algorithm Preset Picker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Zap className="h-4 w-4" />
            <span>Step-by-Step Algorithm Animation Mode</span>
          </div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
            {currentExplanation?.title || 'Binary Search in Sorted Array'}
          </h2>
          <p className="text-xs text-zinc-500">
            Interactive visual execution displaying variable memory, pointers, and array mutations.
          </p>
        </div>

        {/* Algorithm Preset Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-zinc-400 shrink-0">Presets:</span>
          {PRESET_ALGORITHMS.map(p => (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p.id)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs hover:bg-zinc-50 hover:border-zinc-300 transition-colors whitespace-nowrap"
            >
              {p.title.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm space-y-6">
        {/* Step Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white font-mono text-xs font-bold">
              {currentStepIndex + 1}
            </span>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">{currentFrame.title}</h3>
              <p className="text-xs text-zinc-600">{currentFrame.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                currentFrame.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentFrame.status === 'found'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              {currentFrame.status === 'completed'
                ? 'Terminated (Success)'
                : currentFrame.status === 'found'
                ? 'Target Found'
                : 'Evaluating'}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Step {currentStepIndex + 1} of {frames.length}
            </span>
          </div>
        </div>

        {/* Visual Array / Pointers Stage */}
        <div className="relative rounded-2xl bg-zinc-50 border border-zinc-200/80 p-8 flex flex-col items-center justify-center min-h-[220px]">
          {/* Array Elements */}
          <div className="flex items-center gap-3 flex-wrap justify-center py-6">
            {arrayState.map((val, idx) => {
              const isActive = currentFrame.activeIndices?.includes(idx);
              const isFound = currentFrame.status === 'found' && isActive;
              const isComparing = currentFrame.comparingIndices?.includes(idx);

              // Find any pointers pointing to this index
              const matchingPointers = Object.entries(currentFrame.pointers || {})
                .filter(([_, ptrIdx]) => ptrIdx === idx)
                .map(([name]) => name);

              return (
                <div key={idx} className="flex flex-col items-center">
                  {/* Top Pointer Indicator if any */}
                  <div className="h-6 flex items-center justify-center mb-1">
                    {matchingPointers.length > 0 && (
                      <span className="rounded bg-zinc-900 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 shadow-xs animate-bounce">
                        {matchingPointers.join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Array Cell */}
                  <motion.div
                    layout
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 font-mono text-base sm:text-lg font-extrabold shadow-sm transition-all ${
                      isFound
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-300/60'
                        : isActive
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-300/50'
                        : isComparing
                        ? 'border-blue-400 bg-blue-50 text-blue-900'
                        : 'border-zinc-200 bg-white text-zinc-800'
                    }`}
                  >
                    {val}
                  </motion.div>

                  {/* Index Label */}
                  <span className="mt-2 font-mono text-[11px] font-semibold text-zinc-400">
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pointer Description Legend */}
          {currentFrame.pointers && Object.keys(currentFrame.pointers).length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-zinc-400 font-semibold">Active Pointers:</span>
              {Object.entries(currentFrame.pointers).map(([name, idx]) => (
                <span
                  key={name}
                  className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-xs text-zinc-800 shadow-2xs"
                >
                  <span className="font-bold text-emerald-700">{name}</span> = index {idx}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Variables & Memory Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Variables Table */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-zinc-500" />
              <span>Variable Watch Window</span>
            </h4>
            {currentFrame.variables && Object.keys(currentFrame.variables).length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(currentFrame.variables).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-zinc-50 px-2.5 py-1.5 border border-zinc-100">
                    <span className="text-zinc-500 font-semibold">{key}</span>
                    <span className="font-extrabold text-zinc-900">{String(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">No active registers tracked in this step.</p>
            )}
          </div>

          {/* Auxiliary Data Structures: HashMap / Stack / DP Table */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-zinc-500" />
              <span>Auxiliary Data Structure</span>
            </h4>
            {currentFrame.hashMap && Object.keys(currentFrame.hashMap).length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Hash Map (Key → Index)
                </span>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                  {Object.entries(currentFrame.hashMap).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 px-2 py-1 text-emerald-950 font-bold"
                    >
                      <span>{k}</span>
                      <ArrowRight className="h-3 w-3 text-emerald-600" />
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : currentFrame.stack && currentFrame.stack.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                  Active Stack (LIFO)
                </span>
                <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                  {currentFrame.stack.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-blue-950 font-bold"
                    >
                      {String(item)}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-zinc-50 p-2.5 border border-zinc-100 text-xs text-zinc-500">
                <span>O(1) auxiliary space at this execution step. State stored in pointer registers.</span>
              </div>
            )}
          </div>
        </div>

        {/* Playback Controls & Timeline Slider */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Step Scrub Bar */}
          <div className="w-full sm:w-1/3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={frames.length - 1}
              value={currentStepIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStepIndex(parseInt(e.target.value));
              }}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
            <span className="font-mono text-xs font-bold text-zinc-700 whitespace-nowrap">
              {currentStepIndex + 1}/{frames.length}
            </span>
          </div>

          {/* Primary Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              id="btn-anim-reset"
              className="rounded-lg p-2 text-zinc-600 hover:bg-white hover:shadow-2xs transition-all"
              title="Reset to beginning"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              id="btn-anim-prev"
              className="rounded-lg p-2 text-zinc-600 hover:bg-white hover:shadow-2xs disabled:opacity-30 transition-all"
              title="Previous Step"
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              id="btn-anim-play-pause"
              className="flex items-center justify-center rounded-xl bg-zinc-900 text-white h-9 w-12 hover:bg-zinc-800 transition-all shadow-xs"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === frames.length - 1}
              id="btn-anim-next"
              className="rounded-lg p-2 text-zinc-600 hover:bg-white hover:shadow-2xs disabled:opacity-30 transition-all"
              title="Next Step"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Speed Multiplier */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span>Speed:</span>
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`rounded px-2 py-0.5 font-mono text-[11px] font-semibold transition-colors ${
                  speedMultiplier === s
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
