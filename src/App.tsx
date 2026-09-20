import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardOverview } from './components/DashboardOverview';
import { AIRecommendations } from './components/AIRecommendations';
import { ProblemsExplorer } from './components/ProblemsExplorer';
import { ProblemDetailModal } from './components/ProblemDetailModal';
import { AlgorithmAnimator } from './components/AlgorithmAnimator';
import { AICoachChat } from './components/AICoachChat';
import { UserAccount, CodingProfile, AIAnalysisResult, ProblemItem, ProblemExplanation } from './types/index';

export default function App() {
  // Current user account state - NO DEFAULT DEMO USER
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('codetrack_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Profiles list - NO DEFAULT DEMO PROFILES
  const [profiles, setProfiles] = useState<CodingProfile[]>(() => {
    const saved = localStorage.getItem('codetrack_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // AI Analysis cache - NO DEFAULT DEMO ANALYSIS
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(() => {
    const saved = localStorage.getItem('codetrack_ai_analysis');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Extracted user problems
  const [problems, setProblems] = useState<ProblemItem[]>(() => {
    const saved = localStorage.getItem('codetrack_problems');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coach' | 'problems' | 'animator'>('dashboard');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);

  // Active Problem Deep Dive & Visualizer
  const [activeProblem, setActiveProblem] = useState<ProblemItem | null>(null);
  const [activeExplanation, setActiveExplanation] = useState<ProblemExplanation | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('codetrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('codetrack_user');
    }
  }, [user]);

  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('codetrack_profiles', JSON.stringify(profiles));
    } else {
      localStorage.removeItem('codetrack_profiles');
    }
  }, [profiles]);

  useEffect(() => {
    if (aiAnalysis) {
      localStorage.setItem('codetrack_ai_analysis', JSON.stringify(aiAnalysis));
    } else {
      localStorage.removeItem('codetrack_ai_analysis');
    }
  }, [aiAnalysis]);

  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem('codetrack_problems', JSON.stringify(problems));
    } else {
      localStorage.removeItem('codetrack_problems');
    }
  }, [problems]);

  // Sync user state when profiles change
  const updateUserDataWithProfiles = (newProfiles: CodingProfile[]) => {
    setProfiles(newProfiles);

    // Extract any problems from the fetched profiles
    const extractedProblems: ProblemItem[] = [];
    newProfiles.forEach(p => {
      if (p.recentSubmissions && p.recentSubmissions.length > 0) {
        p.recentSubmissions.forEach(sub => {
          extractedProblems.push({
            id: `${p.platform.toLowerCase()}_${sub.title.replace(/\s+/g, '_').toLowerCase()}`,
            title: sub.title,
            platform: p.platform,
            difficulty: (sub.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Medium',
            topic: (p.topics && p.topics[0]?.topic) || 'Algorithms',
            solvedDate: sub.timestamp ? new Date(sub.timestamp * 1000).toISOString().split('T')[0] : 'Recent',
            url: p.profileUrl || 'https://leetcode.com',
            submissionInfo: {
              status: (sub.status as 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded') || 'Accepted',
              runtime: sub.runtime || 'Optimal',
              language: sub.language || 'Java',
            },
          });
        });
      }
    });

    if (extractedProblems.length > 0) {
      setProblems(extractedProblems);
    }

    // If user is not logged in, auto-seed a clean local session for them
    const primary = newProfiles.find(p => p.fetchStatus !== 'error') || newProfiles[0];
    if (primary) {
      setUser(prev => {
        if (prev) {
          return { ...prev, profiles: newProfiles };
        }
        return {
          id: `usr_${Date.now()}`,
          name: primary.username,
          email: `${primary.username.toLowerCase()}@codetrack.ai`,
          avatar: primary.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(primary.username)}`,
          profiles: newProfiles,
          createdAt: new Date().toISOString(),
        };
      });
    }
  };

  // Quick connect a single URL or handle from dashboard
  const handleQuickConnectUrl = async (urlOrHandle: string, platform?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/profiles/fetch-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrUsername: urlOrHandle, platform }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch profile data');
      }

      const fetchedProfile: CodingProfile = data.profile;
      const updatedProfiles = [...profiles.filter(p => p.platform !== fetchedProfile.platform), fetchedProfile];
      updateUserDataWithProfiles(updatedProfiles);

      // Trigger AI Analysis for the verified profile
      await runAIAnalysis(updatedProfiles);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Profile Multi-Analysis Flow (Section 4 & 5)
  const handleAnalyzeProfiles = async (profileInputs: { platform: string; urlOrUsername: string }[]) => {
    setIsAnalyzing(true);
    try {
      const fetchRes = await fetch('/api/profiles/fetch-multi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles: profileInputs }),
      });
      const fetchData = await fetchRes.json();
      const updatedProfiles: CodingProfile[] = fetchData.profiles || [];

      if (updatedProfiles.length > 0) {
        updateUserDataWithProfiles(updatedProfiles);
        await runAIAnalysis(updatedProfiles);

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Error analyzing profiles:', err);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runAIAnalysis = async (profilesToAnalyze: CodingProfile[]) => {
    const validProfiles = profilesToAnalyze.filter(p => p.fetchStatus !== 'error');
    if (validProfiles.length === 0) return;

    try {
      const aiRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles: validProfiles }),
      });
      const aiData = await aiRes.json();
      if (aiData.analysis) {
        setAiAnalysis(aiData.analysis);

        // Also merge top recommendations into problem explorer if empty
        if (aiData.analysis.topRecommendations && aiData.analysis.topRecommendations.length > 0) {
          setProblems(prev => {
            const existingTitles = new Set(prev.map(p => p.title.toLowerCase()));
            const newRecs: ProblemItem[] = aiData.analysis.topRecommendations
              .filter((rec: any) => !existingTitles.has(rec.title.toLowerCase()))
              .map((rec: any, idx: number) => ({
                id: `rec_${idx}_${Date.now()}`,
                title: rec.title,
                platform: rec.platform || 'LeetCode',
                difficulty: rec.difficulty || 'Medium',
                topic: rec.targetTopic || rec.topic || 'Algorithms',
                url: rec.url || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(rec.title)}`,
                acceptanceRate: 'Recommended',
              }));
            return [...prev, ...newRecs];
          });
        }
      }
    } catch (e) {
      console.error('AI Analysis failed:', e);
    }
  };

  // Problem Deep Dive Solution View (Section 8 & 9)
  const handleOpenProblem = async (problemOrTitle: ProblemItem | string, optionalTopic?: string) => {
    let probObj: ProblemItem | null = null;
    let title = '';
    let topic = optionalTopic || 'Algorithms';
    let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';

    if (typeof problemOrTitle === 'string') {
      title = problemOrTitle;
      probObj = problems.find(p => p.title.toLowerCase() === title.toLowerCase()) || null;
      if (probObj) {
        topic = probObj.topic;
        difficulty = probObj.difficulty;
      }
    } else {
      probObj = problemOrTitle;
      title = probObj.title;
      topic = probObj.topic;
      difficulty = probObj.difficulty;
    }

    setActiveProblem(
      probObj || {
        id: `custom_${Date.now()}`,
        title,
        platform: 'LeetCode',
        difficulty,
        topic,
        url: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(title)}`,
      }
    );
    setIsProblemModalOpen(true);
    setIsLoadingExplanation(true);

    try {
      const res = await fetch('/api/ai/problem-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: title,
          topic,
          difficulty,
          submissionInfo: probObj?.submissionInfo,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setActiveExplanation(data.explanation);
      }
    } catch (err) {
      console.error('Error fetching explanation:', err);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  // Launch Algorithm Animation Mode (Section 10)
  const handleAnimateProblem = async (problemOrTitle: ProblemItem | string, optionalTopic?: string) => {
    let title = typeof problemOrTitle === 'string' ? problemOrTitle : problemOrTitle.title;
    let topic = optionalTopic || (typeof problemOrTitle !== 'string' ? problemOrTitle.topic : 'Algorithms');
    let difficulty = typeof problemOrTitle !== 'string' ? problemOrTitle.difficulty : 'Medium';

    setActiveTab('animator');

    // If an explanation for this exact title is already cached, reuse it
    if (activeExplanation && activeExplanation.title.toLowerCase() === title.toLowerCase()) {
      return;
    }

    try {
      const res = await fetch('/api/ai/problem-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemTitle: title, topic, difficulty }),
      });
      const data = await res.json();
      if (data.explanation) {
        setActiveExplanation(data.explanation);
      }
    } catch (err) {
      console.error('Error preparing animation data:', err);
    }
  };

  const handleLaunchAnimatorFromModal = () => {
    setIsProblemModalOpen(false);
    setActiveTab('animator');
  };

  const handleSelectPresetAlgorithm = (algorithmKey: string) => {
    const keyMap: Record<string, { title: string; topic: string }> = {
      'two-sum': { title: 'Two Sum', topic: 'Arrays & Hashing' },
      'binary-search': { title: 'Binary Search', topic: 'Binary Search' },
      'sliding-window': { title: 'Maximum Subarray (Sliding Window)', topic: 'Sliding Window' },
      'coin-change': { title: 'Coin Change', topic: 'Dynamic Programming' },
      'invert-tree': { title: 'Invert Binary Tree', topic: 'Trees & DFS' },
    };
    const target = keyMap[algorithmKey] || { title: algorithmKey, topic: 'Algorithms' };
    handleAnimateProblem(target.title, target.topic);
  };

  const handleLogout = () => {
    setUser(null);
    setProfiles([]);
    setAiAnalysis(null);
    setProblems([]);
    localStorage.clear();
    setActiveTab('dashboard');
  };

  // Sync / Reanalyze action across all connected profiles
  const handleSyncProfilesAndReanalyze = async () => {
    if (profiles.length === 0 || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const profileInputs = profiles.map(p => ({
        platform: p.platform,
        urlOrUsername: p.username || p.profileUrl,
      }));

      const fetchRes = await fetch('/api/profiles/fetch-multi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles: profileInputs }),
      });
      const fetchData = await fetchRes.json();
      const updatedProfiles: CodingProfile[] = fetchData.profiles || profiles;

      updateUserDataWithProfiles(updatedProfiles);
      await runAIAnalysis(updatedProfiles);

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (err) {
      console.error('Failed to sync and reanalyze:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 font-sans antialiased relative">
      {/* Top Application Navbar */}
      <Navbar
        user={user}
        profiles={profiles}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
        onLogout={handleLogout}
        onSyncProfiles={handleSyncProfilesAndReanalyze}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            profiles={profiles}
            aiAnalysis={aiAnalysis}
            onNavigateToCoach={() => setActiveTab('coach')}
            onNavigateToProblems={() => setActiveTab('problems')}
            onNavigateToAnimator={() => setActiveTab('animator')}
            onOpenConnect={() => setIsOnboardingModalOpen(true)}
            onQuickConnectUrl={handleQuickConnectUrl}
            isAnalyzing={isAnalyzing}
            onStartProblem={handleOpenProblem}
            onAnimateProblem={handleAnimateProblem}
          />
        )}

        {activeTab === 'coach' && (
          <AIRecommendations
            analysis={aiAnalysis}
            profiles={profiles}
            onOpenProblem={handleOpenProblem}
            onAnimateProblem={handleAnimateProblem}
            onOpenConnect={() => setIsOnboardingModalOpen(true)}
            onSyncAndReanalyze={handleSyncProfilesAndReanalyze}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'problems' && (
          <ProblemsExplorer
            problems={problems}
            onOpenProblem={p => handleOpenProblem(p)}
            onAnimateProblem={p => handleAnimateProblem(p)}
            onOpenConnect={() => setIsOnboardingModalOpen(true)}
          />
        )}

        {activeTab === 'animator' && (
          <AlgorithmAnimator
            currentExplanation={activeExplanation}
            onSelectPreset={handleSelectPresetAlgorithm}
          />
        )}
      </main>

      {/* Persistent AI Coach Chat Floating Panel */}
      <AICoachChat profiles={profiles} aiAnalysis={aiAnalysis} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={newUser => {
          setUser(newUser);
          if (newUser.profiles && newUser.profiles.length > 0) {
            updateUserDataWithProfiles(newUser.profiles);
            runAIAnalysis(newUser.profiles);
          }
        }}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onAnalyze={handleAnalyzeProfiles}
        isAnalyzing={isAnalyzing}
        currentProfiles={profiles}
      />

      <ProblemDetailModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
        problem={activeProblem}
        explanation={activeExplanation}
        isLoading={isLoadingExplanation}
        onLaunchAnimator={handleLaunchAnimatorFromModal}
        onSelectSimilarProblem={(simTitle, simTopic) => handleOpenProblem(simTitle, simTopic)}
      />
    </div>
  );
}
