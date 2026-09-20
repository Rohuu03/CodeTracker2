import {
  CodingProfile,
  AIAnalysisResult,
  LeetCodeProblemMetadata,
  UserProblemHistory,
  RecommendedProblemItem,
  WhatShouldISolveNowItem,
  PersonalizedRecommendationResponse,
} from '../src/types/index';
import { problemDatabaseService } from './problemDatabase';

export class RecommendationEngine {
  /**
   * Main recommendation generation function
   */
  generateRecommendations(
    profiles: CodingProfile[],
    aiAnalysis: AIAnalysisResult | null
  ): PersonalizedRecommendationResponse {
    // 1. Gather all solved problems across all connected profiles
    const userSolvedHistory: UserProblemHistory[] = [];
    const solvedKeys = new Set<string>();

    profiles.forEach(p => {
      if (Array.isArray(p.solvedProblems)) {
        p.solvedProblems.forEach(sp => {
          userSolvedHistory.push(sp);
          if (sp.title) {
            solvedKeys.add(sp.title.toLowerCase().trim());
            solvedKeys.add(sp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            solvedKeys.add(sp.title.toLowerCase().replace(/[^a-z0-9]/g, ''));
          }
          if (sp.slug) {
            solvedKeys.add(sp.slug.toLowerCase().trim());
          }
          if (sp.problemId) {
            solvedKeys.add(sp.problemId.toLowerCase().trim());
          }
        });
      }

      // Also gather from recentActivity problem titles
      if (Array.isArray(p.recentActivity)) {
        p.recentActivity.forEach(act => {
          if (act.problemTitle) {
            const clean = act.problemTitle.replace(/\(.*?\)/g, '').trim();
            solvedKeys.add(clean.toLowerCase());
            solvedKeys.add(clean.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            solvedKeys.add(clean.toLowerCase().replace(/[^a-z0-9]/g, ''));
          }
        });
      }

      // Also check recent submissions
      if (Array.isArray(p.recentSubmissions)) {
        p.recentSubmissions.forEach(sub => {
          if (sub.title) {
            solvedKeys.add(sub.title.toLowerCase().trim());
            solvedKeys.add(sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
          }
        });
      }
    });

    // 2. Compute: ALL AVAILABLE PROBLEMS - USER'S SOLVED PROBLEMS = PROBLEMS USER CAN STILL SOLVE
    const allProblems = problemDatabaseService.getAllProblems();
    const unsolvedProblems = problemDatabaseService.getUnsolvedProblems(userSolvedHistory);
    const dbStatus = problemDatabaseService.getStatus();

    // 3. Extract user mastery and progression profiles
    const topicMastery = aiAnalysis?.topicMasteryList || [];
    const weakAreas = aiAnalysis?.weakAreas || [];

    // Find strong topics (> 65 score)
    const strongTopics = new Set<string>();
    topicMastery
      .filter(t => t.score >= 65 || t.status === 'Strong')
      .forEach(t => strongTopics.add(normalizeTopic(t.topic)));

    // Find weak topics (< 50 score or explicit weakArea)
    const weakTopicSet = new Set<string>();
    weakAreas.forEach(w => weakTopicSet.add(normalizeTopic(w.topic)));
    topicMastery
      .filter(t => t.score < 50 || t.status === 'Limited practice' || t.status === 'Very limited practice')
      .forEach(t => weakTopicSet.add(normalizeTopic(t.topic)));

    // If no weak topics were explicitly flagged yet, default to foundational topics
    if (weakTopicSet.size === 0) {
      weakTopicSet.add('binary search');
      weakTopicSet.add('stack');
      weakTopicSet.add('sliding window');
    }

    // Determine target difficulty level
    const totalSolved = profiles.reduce((acc, p) => acc + (p.problemsSolved || 0), 0);
    const easyCount = profiles.reduce((acc, p) => acc + (p.easySolved || 0), 0);
    const medCount = profiles.reduce((acc, p) => acc + (p.mediumSolved || 0), 0);
    const hardCount = profiles.reduce((acc, p) => acc + (p.hardSolved || 0), 0);

    let primaryDifficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
    if (totalSolved < 20 || easyCount > (totalSolved * 0.7)) {
      primaryDifficulty = 'Easy';
    } else if (hardCount >= 15 || totalSolved > 350) {
      primaryDifficulty = 'Medium'; // Will include bridge to Hard
    }

    // 4. GENERATE "WHAT SHOULD I SOLVE NOW?" (Section 6)
    // Three sequenced, high-impact tactical recommendations
    const whatShouldISolveNow: WhatShouldISolveNowItem[] = [];

    // Step 1: Binary Search or Direct Weak Area Progression
    const candidate1 = findBestProblem(unsolvedProblems, ['Binary Search', 'Two Pointers'], primaryDifficulty === 'Easy' ? 'Easy' : 'Medium');
    if (candidate1) {
      whatShouldISolveNow.push({
        step: 1,
        topic: 'Binary Search',
        difficulty: candidate1.difficulty,
        reason: strongTopics.has('arrays')
          ? 'Recommended because you have solid array fundamentals and are ready for more Binary Search variations.'
          : 'Recommended because mastering logarithmic search is foundational to your difficulty progression.',
        badge: 'Core Skill Leap',
        problem: {
          problemId: candidate1.problemId,
          frontendQuestionId: candidate1.frontendQuestionId,
          title: candidate1.title,
          slug: candidate1.titleSlug,
          url: candidate1.url,
          difficulty: candidate1.difficulty,
          topic: 'Binary Search',
          tags: candidate1.topicTags,
          acceptanceRate: candidate1.acceptanceRate,
          priority: 'High',
          reason: 'Ready for more Binary Search variations to expand boundary conditions.',
          progressionNote: 'Focus on invariant maintenance: low <= high vs low < high.',
          matchType: 'weak_topic',
          estimatedTimeMin: candidate1.difficulty === 'Easy' ? 15 : 25,
        },
      });
    }

    // Step 2: Topic Combination (e.g., Sliding Window builds on HashMap or String)
    const candidate2 = findBestProblem(
      unsolvedProblems.filter(p => p.frontendQuestionId !== candidate1?.frontendQuestionId),
      ['Sliding Window', 'Hash Table', 'String'],
      'Medium'
    );
    if (candidate2) {
      whatShouldISolveNow.push({
        step: 2,
        topic: 'Sliding Window',
        difficulty: candidate2.difficulty,
        reason: 'Builds directly on your HashMap knowledge and trains frequency table state maintenance.',
        badge: 'Topic Combination',
        problem: {
          problemId: candidate2.problemId,
          frontendQuestionId: candidate2.frontendQuestionId,
          title: candidate2.title,
          slug: candidate2.titleSlug,
          url: candidate2.url,
          difficulty: candidate2.difficulty,
          topic: 'Sliding Window',
          tags: candidate2.topicTags,
          acceptanceRate: candidate2.acceptanceRate,
          priority: 'High',
          reason: 'Builds on your HashMap knowledge.',
          progressionNote: 'Combines two pointers with frequency counting for optimal O(N) runtime.',
          matchType: 'topic_combination',
          estimatedTimeMin: 30,
        },
      });
    }

    // Step 3: Stack (Monotonic Stack or Parentheses/State)
    const usedIds = new Set([candidate1?.frontendQuestionId, candidate2?.frontendQuestionId]);
    const candidate3 = findBestProblem(
      unsolvedProblems.filter(p => !usedIds.has(p.frontendQuestionId)),
      ['Stack', 'Monotonic Stack'],
      'Medium'
    ) || findBestProblem(
      unsolvedProblems.filter(p => !usedIds.has(p.frontendQuestionId)),
      ['Stack'],
      'Easy'
    );

    if (candidate3) {
      whatShouldISolveNow.push({
        step: 3,
        topic: 'Stack',
        difficulty: primaryDifficulty === 'Easy' ? 'Easy' : 'Easy → Medium',
        reason: 'You have limited practice in this topic; cementing LIFO mechanics will unlock monotonic parsing.',
        badge: 'Weakness Rectification',
        problem: {
          problemId: candidate3.problemId,
          frontendQuestionId: candidate3.frontendQuestionId,
          title: candidate3.title,
          slug: candidate3.titleSlug,
          url: candidate3.url,
          difficulty: candidate3.difficulty,
          topic: 'Stack',
          tags: candidate3.topicTags,
          acceptanceRate: candidate3.acceptanceRate,
          priority: 'Medium',
          reason: 'You have limited practice in this topic.',
          progressionNote: 'Great for learning when to delay evaluation until condition holds.',
          matchType: 'weak_topic',
          estimatedTimeMin: 20,
        },
      });
    }

    // 5. GENERATE "TODAY'S PROBLEMS" / TODAY'S PLAN (Section 7)
    // 3 to 5 calibrated daily problems: e.g. Two Pointers, Binary Search, HashMap, Stack
    const todaysPlan: RecommendedProblemItem[] = [];
    const usedPlanIds = new Set<string>();

    const targetCategories = [
      { topic: 'Two Pointers', diff: 'Medium', reason: 'Refine optimal left/right pointer convergence patterns.' },
      { topic: 'Binary Search', diff: 'Medium', reason: 'Master predicate-based monotonic space search.' },
      { topic: 'Hash Table', diff: 'Medium', reason: 'Strengthen O(1) lookups and coordinate mapping.' },
      { topic: 'Stack', diff: primaryDifficulty === 'Easy' ? 'Easy' : 'Medium', reason: 'Build memory of previous elements and monotonic constraints.' },
    ];

    targetCategories.forEach(cat => {
      const match = unsolvedProblems.find(p => {
        if (usedPlanIds.has(p.frontendQuestionId)) return false;
        const matchesTopic = p.topicTags.some(t => t.toLowerCase() === cat.topic.toLowerCase());
        const matchesDiff = cat.diff.includes(p.difficulty);
        return matchesTopic && matchesDiff;
      }) || unsolvedProblems.find(p => {
        if (usedPlanIds.has(p.frontendQuestionId)) return false;
        return p.topicTags.some(t => t.toLowerCase() === cat.topic.toLowerCase());
      });

      if (match) {
        usedPlanIds.add(match.frontendQuestionId);
        todaysPlan.push({
          problemId: match.problemId,
          frontendQuestionId: match.frontendQuestionId,
          title: match.title,
          slug: match.titleSlug,
          url: match.url,
          difficulty: match.difficulty,
          topic: cat.topic,
          tags: match.topicTags,
          acceptanceRate: match.acceptanceRate,
          priority: 'High',
          reason: cat.reason,
          matchType: 'weak_topic',
          estimatedTimeMin: match.difficulty === 'Easy' ? 15 : match.difficulty === 'Medium' ? 25 : 45,
        });
      }
    });

    // 6. Topic-specific recommendations
    const topicRecommendations = [
      'Binary Search',
      'Sliding Window',
      'Stack',
      'Dynamic Programming',
      'Tree',
      'Graph',
    ].map(topicName => {
      const matchingProblems = unsolvedProblems
        .filter(p => p.topicTags.some(t => t.toLowerCase() === topicName.toLowerCase()))
        .slice(0, 3)
        .map(p => ({
          problemId: p.problemId,
          frontendQuestionId: p.frontendQuestionId,
          title: p.title,
          slug: p.titleSlug,
          url: p.url,
          difficulty: p.difficulty,
          topic: topicName,
          tags: p.topicTags,
          acceptanceRate: p.acceptanceRate,
          priority: 'Recommended' as const,
          reason: `Targeted practice for ${topicName} progression.`,
          matchType: 'weak_topic' as const,
          estimatedTimeMin: p.difficulty === 'Easy' ? 15 : 30,
        }));

      const masteryItem = topicMastery.find(tm => tm.topic.toLowerCase() === topicName.toLowerCase());
      const score = masteryItem ? masteryItem.score : 35;

      return {
        topic: topicName,
        masteryScore: score,
        recommendedDifficulty: score > 60 ? 'Medium / Hard' : 'Easy / Medium',
        reason: score < 50
          ? `Identified as a growth area (${score}% score). Daily drills recommended.`
          : `Consolidate intermediate patterns to achieve mastery.`,
        problems: matchingProblems,
      };
    });

    return {
      lastProblemDatabaseSync: dbStatus.lastSyncTime,
      totalIndexedProblems: allProblems.length,
      totalUserSolvedCount: userSolvedHistory.length,
      unsolvedAvailableCount: unsolvedProblems.length,
      userSolvedHistory,
      whatShouldISolveNow,
      todaysPlan,
      topicRecommendations,
    };
  }
}

function normalizeTopic(topic: string): string {
  return topic.toLowerCase().trim();
}

function findBestProblem(
  problems: LeetCodeProblemMetadata[],
  tags: string[],
  preferredDifficulty: 'Easy' | 'Medium' | 'Hard'
): LeetCodeProblemMetadata | undefined {
  const normalizedTags = tags.map(t => t.toLowerCase());

  // 1. Try exact tag match + exact difficulty
  const exact = problems.find(p => {
    const hasTag = p.topicTags.some(t => normalizedTags.includes(t.toLowerCase()));
    return hasTag && p.difficulty === preferredDifficulty;
  });
  if (exact) return exact;

  // 2. Try exact tag match with any difficulty
  const tagAnyDiff = problems.find(p => {
    return p.topicTags.some(t => normalizedTags.includes(t.toLowerCase()));
  });
  if (tagAnyDiff) return tagAnyDiff;

  // 3. Fallback to any problem matching difficulty
  return problems.find(p => p.difficulty === preferredDifficulty);
}

export const recommendationEngine = new RecommendationEngine();
