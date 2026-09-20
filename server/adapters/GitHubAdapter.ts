import { CodingProfile, Activity, TopicStats } from '../../src/types/index';
import { IPlatformAdapter } from './types';

export class GitHubAdapter implements IPlatformAdapter {
  platformName = 'GitHub';

  extractUsername(urlOrUsername: string): string {
    const trimmed = urlOrUsername.trim();
    if (!trimmed.includes('/')) return trimmed;
    const match = trimmed.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    if (match && match[1]) return match[1];
    const parts = trimmed.split('/').filter(Boolean);
    return parts[parts.length - 1] || trimmed;
  }

  async fetchProfile(identifier: string): Promise<CodingProfile> {
    const username = this.extractUsername(identifier);
    const profileUrl = `https://github.com/${username}`;

    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/vnd.github.v3+json',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`GitHub user "${username}" does not exist.`);
      }
      throw new Error(`GitHub API returned status HTTP ${res.status}`);
    }

    const data = await res.json();
    const repos = Number(data.public_repos) || 0;
    const followers = Number(data.followers) || 0;

    // Fetch top repo languages
    const topics: TopicStats[] = [];
    try {
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=20`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          signal: AbortSignal.timeout(6000),
        }
      );
      if (reposRes.ok) {
        const repoList = await reposRes.json();
        if (Array.isArray(repoList)) {
          const langMap = new Map<string, number>();
          repoList.forEach((r: any) => {
            if (r.language) {
              langMap.set(r.language, (langMap.get(r.language) || 0) + 1);
            }
          });
          Array.from(langMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .forEach(([lang, count]) => {
              topics.push({
                topic: lang,
                solved: count,
                proficiency: count >= 5 ? 'Master' : count >= 2 ? 'Advanced' : 'Intermediate',
              });
            });
        }
      }
    } catch (e) {
      // non-critical
    }

    return {
      platform: 'GitHub',
      username: data.login || username,
      profileUrl,
      rating: 0,
      maxRating: 0,
      rankTitle: repos > 30 ? 'Prolific OSS Contributor' : repos > 10 ? 'Active Developer' : 'Developer',
      problemsSolved: repos,
      easySolved: repos,
      mediumSolved: 0,
      hardSolved: 0,
      contestsParticipated: 0,
      acceptanceRate: 100,
      submissions: repos,
      topics,
      avatarUrl: data.avatar_url,
      fetchStatus: 'success',
    };
  }
}
