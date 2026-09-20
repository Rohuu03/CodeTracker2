import { IPlatformAdapter } from './types';
import { LeetCodeAdapter } from './LeetCodeAdapter';
import { CodeforcesAdapter } from './CodeforcesAdapter';
import { CodeChefAdapter } from './CodeChefAdapter';
import { HackerRankAdapter } from './HackerRankAdapter';
import { GitHubAdapter } from './GitHubAdapter';
import { CodingProfile } from '../../src/types/index';

export class PlatformAdapterManager {
  private adapters: Map<string, IPlatformAdapter> = new Map();

  constructor() {
    this.registerAdapter(new LeetCodeAdapter());
    this.registerAdapter(new CodeforcesAdapter());
    this.registerAdapter(new CodeChefAdapter());
    this.registerAdapter(new HackerRankAdapter());
    this.registerAdapter(new GitHubAdapter());
  }

  registerAdapter(adapter: IPlatformAdapter) {
    this.adapters.set(adapter.platformName.toLowerCase(), adapter);
  }

  detectPlatform(urlOrName: string): string | null {
    const lower = urlOrName.toLowerCase();
    if (lower.includes('leetcode')) return 'leetcode';
    if (lower.includes('codeforces')) return 'codeforces';
    if (lower.includes('codechef')) return 'codechef';
    if (lower.includes('hackerrank')) return 'hackerrank';
    if (lower.includes('github')) return 'github';
    return null;
  }

  async fetchProfile(platformOrUrl: string, identifier?: string): Promise<CodingProfile> {
    let platformKey = this.detectPlatform(platformOrUrl);
    let targetIdentifier = identifier || platformOrUrl;

    if (!platformKey && identifier) {
      platformKey = this.detectPlatform(identifier);
    }

    if (!platformKey && identifier) {
      platformKey = platformOrUrl.toLowerCase();
      targetIdentifier = identifier;
    }

    if (!platformKey) {
      // Default to leetcode if ambiguous handle
      platformKey = 'leetcode';
    }

    const adapter = this.adapters.get(platformKey);
    if (!adapter) {
      throw new Error(`Unsupported platform: "${platformKey}". Please choose LeetCode, Codeforces, CodeChef, HackerRank, or GitHub.`);
    }

    return await adapter.fetchProfile(targetIdentifier);
  }
}

export const platformManager = new PlatformAdapterManager();
