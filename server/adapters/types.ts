import { CodingProfile } from '../../src/types/index';

export interface IPlatformAdapter {
  platformName: string;
  extractUsername(urlOrUsername: string): string;
  fetchProfile(identifier: string): Promise<CodingProfile>;
}
