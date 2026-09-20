import { CodingProfile, Activity, TopicStats, ContestRatingPoint, UserProblemHistory } from '../../src/types/index';
import { IPlatformAdapter } from './types';

export class LeetCodeAdapter implements IPlatformAdapter {
  platformName = 'LeetCode';

  extractUsername(urlOrUsername: string): string {
    const trimmed = urlOrUsername.trim();
    if (!trimmed.includes('/')) return trimmed;
    // Handle formats like:
    // https://leetcode.com/u/username/
    // https://leetcode.com/username/
    // https://leetcode.cn/u/username/
    const match = trimmed.match(/leetcode\.(?:com|cn)\/(?:u\/)?([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) {
      return match[1];
    }
    const parts = trimmed.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart !== 'u' && !lastPart.includes('.')) {
      return lastPart;
    }
    return trimmed;
  }

  async fetchProfile(identifier: string): Promise<CodingProfile> {
    const username = this.extractUsername(identifier);
    const profileUrl = `https://leetcode.com/u/${username}/`;

    // Direct official LeetCode GraphQL query
    const query = `
      query getUserProfileComplete($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            userAvatar
            reputation
            realName
            countryName
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          tagProblemCounts {
            advanced {
              tagName
              problemsSolved
            }
            intermediate {
              tagName
              problemsSolved
            }
            fundamental {
              tagName
              problemsSolved
            }
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
        userContestRankingHistory(username: $username) {
          attended
          rating
          ranking
          contest {
            title
            startTime
          }
        }
        recentAcSubmissionList(username: $username, limit: 100) {
          id
          title
          titleSlug
          timestamp
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://leetcode.com/u/${username}/`,
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`LeetCode server returned status HTTP ${response.status}`);
    }

    const json = await response.json();

    if (json.errors && (!json.data || !json.data.matchedUser)) {
      const errMsg = json.errors[0]?.message || 'User does not exist';
      throw new Error(`LeetCode error: ${errMsg} for username "${username}"`);
    }

    const matchedUser = json.data?.matchedUser;
    if (!matchedUser) {
      throw new Error(`No LeetCode profile found for username "${username}". Please check the profile URL.`);
    }

    // Exact problems solved numbers
    const stats = matchedUser.submitStatsGlobal?.acSubmissionNum || [];
    let totalSolved = 0;
    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;
    let totalSubmissions = 0;

    stats.forEach((item: any) => {
      if (item.difficulty === 'All') {
        totalSolved = Number(item.count) || 0;
        totalSubmissions = Number(item.submissions) || 0;
      } else if (item.difficulty === 'Easy') {
        easySolved = Number(item.count) || 0;
      } else if (item.difficulty === 'Medium') {
        mediumSolved = Number(item.count) || 0;
      } else if (item.difficulty === 'Hard') {
        hardSolved = Number(item.count) || 0;
      }
    });

    // Contest ranking
    const contestData = json.data?.userContestRanking;
    const rating = contestData?.rating ? Math.round(contestData.rating) : 0;
    const contestsParticipated = contestData?.attendedContestsCount || 0;
    const globalRank = matchedUser.profile?.ranking || contestData?.globalRanking || (rating > 0 ? `Top ${contestData?.topPercentage || 10}%` : 'Unrated');
    const badgeName = contestData?.badge?.name;

    let rankTitle = 'LeetCoder';
    if (badgeName) {
      rankTitle = badgeName;
    } else if (rating >= 2200) {
      rankTitle = 'Guardian';
    } else if (rating >= 1850) {
      rankTitle = 'Knight';
    } else if (rating >= 1600) {
      rankTitle = 'Contestant';
    } else if (totalSolved > 0) {
      rankTitle = 'Problem Solver';
    } else {
      rankTitle = 'Newcomer';
    }

    // Recent AC Submissions
    const recentSubmissions = json.data?.recentAcSubmissionList || [];
    const recentActivity: Activity[] = recentSubmissions.map((sub: any) => ({
      date: new Date(parseInt(sub.timestamp) * 1000).toISOString().split('T')[0],
      count: 1,
      platform: 'LeetCode',
      problemTitle: sub.title,
    }));

    const solvedProblems: UserProblemHistory[] = recentSubmissions.map((sub: any) => ({
      platform: 'LeetCode',
      problemId: String(sub.id || sub.titleSlug || sub.title),
      title: sub.title,
      slug: sub.titleSlug || sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      difficulty: 'Medium', // will be enriched from problem database
      tags: [],
      solvedAt: sub.timestamp ? new Date(parseInt(sub.timestamp) * 1000).toISOString() : undefined,
    }));

    // Exact Tag & Topic Counts from LeetCode
    const topics: TopicStats[] = [];
    const tagCounts = matchedUser.tagProblemCounts;
    if (tagCounts) {
      const allTags = [
        ...(tagCounts.advanced || []),
        ...(tagCounts.intermediate || []),
        ...(tagCounts.fundamental || []),
      ];

      // Sort by problems solved descending
      allTags.sort((a: any, b: any) => (b.problemsSolved || 0) - (a.problemsSolved || 0));

      allTags.slice(0, 8).forEach((tag: any) => {
        const count = tag.problemsSolved || 0;
        if (count > 0) {
          topics.push({
            topic: tag.tagName,
            solved: count,
            proficiency: count >= 50 ? 'Master' : count >= 20 ? 'Advanced' : count >= 8 ? 'Intermediate' : 'Beginner',
          });
        }
      });
    }

    // Contest History
    const historyList = json.data?.userContestRankingHistory;
    const contestHistory: ContestRatingPoint[] = [];
    if (Array.isArray(historyList)) {
      historyList
        .filter((c: any) => c.attended)
        .slice(-12)
        .forEach((c: any) => {
          if (c.contest) {
            contestHistory.push({
              contestName: c.contest.title || 'Contest',
              rating: Math.round(c.rating || 0),
              rank: c.ranking,
              date: new Date((c.contest.startTime || 0) * 1000).toISOString().split('T')[0],
            });
          }
        });
    }

    const acceptanceRate = totalSubmissions > 0 ? Math.round((totalSolved / totalSubmissions) * 100) : (totalSolved > 0 ? 65 : 0);

    return {
      platform: 'LeetCode',
      username: matchedUser.username || username,
      profileUrl,
      rating,
      maxRating: rating > 0 ? Math.max(rating, ...contestHistory.map(h => h.rating)) : 0,
      rankTitle,
      problemsSolved: totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      contestsParticipated,
      acceptanceRate,
      globalRank,
      submissions: totalSubmissions,
      topics,
      recentActivity,
      solvedProblems,
      contestHistory,
      avatarUrl: matchedUser.profile?.userAvatar,
      fetchStatus: 'success',
    };
  }
}
