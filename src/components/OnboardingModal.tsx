import React, { useState } from 'react';
import { X, Plus, Trash2, ArrowRight, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { CodingProfile } from '../types/index';

interface ProfileInput {
  id: string;
  platform: string;
  url: string;
  placeholder: string;
  hint: string;
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (profiles: { platform: string; urlOrUsername: string }[]) => Promise<void>;
  isAnalyzing: boolean;
  currentProfiles: CodingProfile[];
}

const ANALYSIS_STEPS = [
  'Querying official platform APIs...',
  'Extracting verified solved counts...',
  'Parsing contest rating history & ranks...',
  'Classifying difficulty and algorithmic topics...',
  'Synthesizing AI coaching recommendations & roadmap...',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onAnalyze,
  isAnalyzing,
  currentProfiles,
}) => {
  const initialInputs: ProfileInput[] = [
    {
      id: 'leetcode',
      platform: 'LeetCode',
      url: currentProfiles.find(p => p.platform.toLowerCase() === 'leetcode')?.profileUrl || '',
      placeholder: 'https://leetcode.com/u/your_username/ or your_username',
      hint: 'e.g. https://leetcode.com/u/neal_wu/',
    },
    {
      id: 'codeforces',
      platform: 'Codeforces',
      url: currentProfiles.find(p => p.platform.toLowerCase() === 'codeforces')?.profileUrl || '',
      placeholder: 'https://codeforces.com/profile/your_handle or your_handle',
      hint: 'e.g. https://codeforces.com/profile/tourist',
    },
    {
      id: 'codechef',
      platform: 'CodeChef',
      url: currentProfiles.find(p => p.platform.toLowerCase() === 'codechef')?.profileUrl || '',
      placeholder: 'https://www.codechef.com/users/your_handle or your_handle',
      hint: 'e.g. https://www.codechef.com/users/gennady.korotkevich',
    },
    {
      id: 'hackerrank',
      platform: 'HackerRank',
      url: currentProfiles.find(p => p.platform.toLowerCase() === 'hackerrank')?.profileUrl || '',
      placeholder: 'https://www.hackerrank.com/profile/your_handle or your_handle',
      hint: 'e.g. https://www.hackerrank.com/profile/tourist',
    },
    {
      id: 'github',
      platform: 'GitHub',
      url: currentProfiles.find(p => p.platform.toLowerCase() === 'github')?.profileUrl || '',
      placeholder: 'https://github.com/your_username or your_username',
      hint: 'e.g. https://github.com/torvalds',
    },
  ];

  const [inputs, setInputs] = useState<ProfileInput[]>(initialInputs);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (id: string, value: string) => {
    setValidationError(null);
    setInputs(prev => prev.map(item => (item.id === id ? { ...item, url: value } : item)));
  };

  const handleAddPlatform = () => {
    const newId = `custom_${Date.now()}`;
    setInputs(prev => [
      ...prev,
      {
        id: newId,
        platform: 'Custom Platform',
        url: '',
        placeholder: 'https://atcoder.jp/users/username',
        hint: 'Enter any profile URL or handle',
      },
    ]);
  };

  const handleRemoveInput = (id: string) => {
    setInputs(prev => prev.filter(item => item.id !== id));
  };

  const handleStartAnalysis = async () => {
    const validItems = inputs
      .filter(item => item.url.trim().length > 0)
      .map(item => ({
        platform: item.platform,
        urlOrUsername: item.url.trim(),
      }));

    if (validItems.length === 0) {
      setValidationError('Please enter at least one coding profile URL or username.');
      return;
    }

    setValidationError(null);

    // Step cycle animation
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < ANALYSIS_STEPS.length) {
        setActiveStepIndex(step);
      } else {
        clearInterval(interval);
      }
    }, 900);

    try {
      await onAnalyze(validItems);
      clearInterval(interval);
      onClose();
    } catch (err: any) {
      clearInterval(interval);
      setValidationError(err.message || 'Failed to analyze profiles.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Connect your coding profiles</h2>
            <p className="text-xs text-zinc-500">
              Enter the URLs to your public coding profiles to pull your live, verified data.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isAnalyzing}
            id="btn-close-onboarding-modal"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors disabled:opacity-30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isAnalyzing ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin flex items-center justify-center"></div>
                <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
                  <Sparkles className="h-8 w-8 animate-pulse" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 mb-2">Reading Your Coding Profile Data</h3>
              <p className="text-xs text-zinc-500 max-w-sm mb-8">
                Fetching real solved problems, contest histories, and generating your AI coach dossier.
              </p>

              {/* Multi-step progress list */}
              <div className="w-full max-w-md space-y-2.5 text-left bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80">
                {ANALYSIS_STEPS.map((stepText, idx) => {
                  const isDone = idx < activeStepIndex;
                  const isCurrent = idx === activeStepIndex;
                  return (
                    <motion.div
                      key={stepText}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 text-xs font-medium py-1 px-2 rounded-lg transition-colors ${
                        isCurrent
                          ? 'bg-white text-emerald-900 font-semibold shadow-2xs border border-emerald-100'
                          : isDone
                          ? 'text-zinc-700'
                          : 'text-zinc-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="h-4 w-4 text-emerald-600 animate-spin shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-zinc-300 shrink-0" />
                      )}
                      <span>{stepText}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {validationError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Platform Cards */}
              <div className="space-y-3">
                {inputs.map(item => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs transition-all hover:border-zinc-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-[11px] font-bold text-zinc-800">
                          {item.platform.slice(0, 2).toUpperCase()}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-900">{item.platform}</h4>
                      </div>
                      {inputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInput(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 rounded transition-opacity"
                          title="Remove platform"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={item.url}
                        onChange={e => handleInputChange(item.id, e.target.value)}
                        placeholder={item.placeholder}
                        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-xs font-mono text-zinc-800 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400">{item.hint}</p>
                  </div>
                ))}
              </div>

              {/* + Add another platform */}
              <button
                type="button"
                id="btn-add-another-platform"
                onClick={handleAddPlatform}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 py-3 text-xs font-semibold text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add another platform</span>
              </button>

              <div className="rounded-xl bg-zinc-50 p-3 text-[11px] text-zinc-500 border border-zinc-100">
                <span className="font-semibold text-zinc-700">Tip: </span>
                You can enter full profile URLs or direct handles. All data is fetched live from official platform APIs.
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isAnalyzing && (
          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
            <span className="text-xs text-zinc-500">
              {inputs.filter(i => i.url.trim().length > 0).length} platform(s) entered
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-analyze-my-profile"
                onClick={handleStartAnalysis}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-all"
              >
                <span>Read Profile Data & Analyze</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
