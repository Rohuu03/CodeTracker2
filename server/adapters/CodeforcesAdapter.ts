import { CodingProfile, Activity, TopicStats, ContestRatingPoint, UserProblemHistory } from '../../src/types/index';
import { IPlatformAdapter } from './types';

export class CodeforcesAdapter implements IPlatformAdapter {
  platformName = 'Codeforces';

  extractUsername(urlOrUsername: string): string {
    const trimmed = urlOrUsername.trim();
    if (!trimmed.includes('/')) return trimmed;
    const match = trimmed.match(/codeforces\.com\/(?:profile\/)?([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) return match[1];
    const parts = trimmed.split('/').filter(Boolean);
    return parts[parts.length - 1] || trimmed;
  }

  async fetchProfile(identifier: string): Promise<CodingProfile> {
    const username = this.extractUsername(identifier);
    const profileUrl = `https://codeforces.com/profile/${username}`;

    // 1. Fetch user info
    const userInfoRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`, {
      signal: AbortSignal.timeout(8000),
    });

    if (!userInfoRes.ok) {
      throw new Error(`Codeforces API returned HTTP ${userInfoRes.status}`);
    }

    const userInfoData = await userInfoRes.json();
    if (userInfoData.status !== 'OK' || !userInfoData.result || userInfoData.result.length === 0) {
      throw new Error(userInfoData.comment || `User "${username}" not found on Codeforces`);
    }

    const user = userInfoData.result[0];

    // 2. Fetch rating history
    let contestHistory: ContestRatingPoint[] = [];
    let contestsParticipated = 0;
    try {
      const ratingRes = await fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(username)}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (ratingRes.ok) {
        const ratingData = await ratingRes.json();
        if (ratingData.status === 'OK' && Array.isArray(ratingData.result)) {
          contestsParticipated = ratingData.result.length;
          contestHistory = ratingData.result.slice(-15).map((c: any) => ({
            contestName: c.contestName,
            rating: c.newRating,
            rank: c.rank,
            date: new Date(c.ratingUpdateTimeSeconds * 1000).toISOString().split('T')[0],
          }));
        }
      }
    } catch (err) {
      console.warn('Codeforces rating fetch warning:', err);
    }

    // 3. Fetch submissions and count exact solved problems
    const topicMap = new Map<string, number>();
    const solvedProblemKeys = new Set<string>();
    const solvedProblems: UserProblemHistory[] = [];
    let totalSubmissions = 0;
    let acceptedSubmissions = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    const recentActivity: Activity[] = [];

    try {
      const statusRes = await fetch(
        `https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}&from=1&count=1000`,
        { signal: AbortSignal.timeout(8000) }
      );

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.status === 'OK' && Array.isArray(statusData.result)) {
          totalSubmissions = statusData.result.length;
          statusData.result.forEach((sub: any) => {
            if (sub.verdict === 'OK' && sub.problem) {
              acceptedSubmissions++;
              const probKey = `${sub.problem.contestId || ''}${sub.problem.index || ''}-${sub.problem.name}`;

              if (!solvedProblemKeys.has(probKey)) {
                solvedProblemKeys.add(probKey);

                const probRating = sub.problem.rating;
                if (!probRating || probRating < 1200) {
                  easySolved++;
                } else if (probRating < 1900) {
                  mediumSolved++;
                } else {
                  hardSolved++;
                }

                const tags: string[] = Array.isArray(sub.problem.tags) ? sub.problem.tags : [];
                if (tags.length > 0) {
                  tags.forEach((tag: string) => {
                    const normalized = tag.charAt(0).toUpperCase() + tag.slice(1);
                    topicMap.set(normalized, (topicMap.get(normalized) || 0) + 1);
                  });
                }

                solvedProblems.push({
                  platform: 'Codeforces',
                  problemId: `${sub.problem.contestId || ''}${sub.problem.index || ''}`,
                  title: sub.problem.name,
                  slug: sub.problem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  difficulty: !probRating || probRating < 1200 ? 'Easy' : probRating < 1900 ? 'Medium' : 'Hard',
                  tags,
                  solvedAt: sub.creationTimeSeconds ? new Date(sub.creationTimeSeconds * 1000).toISOString() : undefined,
                });
              }

              if (sub.creationTimeSeconds && recentActivity.length < 15) {
                recentActivity.push({
                  date: new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0],
                  count: 1,
                  platform: 'Codeforces',
                  problemTitle: `${sub.problem.name} (${sub.problem.rating ? sub.problem.rating + ' pts' : 'Unrated'})`,
                });
              }
            }
          });
        }
      }
    } catch (err) {
      console.warn('Codeforces submissions fetch warning:', err);
    }

    const topics: TopicStats[] = Array.from(topicMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, solved]) => ({
        topic,
        solved,
        proficiency: solved >= 40 ? 'Master' : solved >= 15 ? 'Advanced' : solved >= 5 ? 'Intermediate' : 'Beginner',
      }));

    const problemsSolvedCount = solvedProblemKeys.size;
    const rating = user.rating || 0;
    const maxRating = user.maxRating || rating;
    const rankTitle = user.rank ? user.rank.charAt(0).toUpperCase() + user.rank.slice(1) : (rating > 0 ? 'Rated' : 'Unrated');

    return {
      platform: 'Codeforces',
      username: user.handle,
      profileUrl,
      rating,
      maxRating,
      rankTitle,
      problemsSolved: problemsSolvedCount,
      easySolved,
      mediumSolved,
      hardSolved,
      contestsParticipated,
      acceptanceRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
      submissions: totalSubmissions,
      avatarUrl: user.titlePhoto || user.avatar,
      topics,
      recentActivity,
      solvedProblems,
      contestHistory,
      fetchStatus: 'success',
    };
  }
}
