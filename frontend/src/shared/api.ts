import type { Bot } from './types';

export async function getBots(): Promise<Bot[]> {
  return Promise.resolve([{ id: 1, name: 'Mock Bot' }]);
}
