/**
 * NutriHealth Game Storage Service
 *
 * Persists game scores locally using AsyncStorage.
 * No backend required — all data is stored on-device.
 *
 * High scores are now stored in the user profile (services/userProfile.ts).
 * This service delegates high score reads/writes to the profile service,
 * while keeping the recent scores list in its own AsyncStorage keys for
 * backward compatibility.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveProfileHighScore, getProfileHighScore } from './userProfile';

const RECENT_SCORES_KEY = (gameId: string) => `game_recent_scores_${gameId}`;
const MAX_RECENT_SCORES = 10;

/**
 * Get the all-time high score for a game.
 * Reads from the user profile. Returns 0 if no score has been saved yet.
 */
export async function getHighScore(gameId: string): Promise<number> {
  return getProfileHighScore(gameId);
}

/**
 * Save a new score if it is higher than the existing high score.
 * Writes to the user profile. Returns true if the new score is a new high score.
 */
export async function saveHighScore(gameId: string, score: number): Promise<boolean> {
  return saveProfileHighScore(gameId, score);
}

/**
 * Get the list of recent scores for a game (most recent first).
 * @param limit - Maximum number of scores to return (default: 10)
 */
export async function getRecentScores(gameId: string, limit: number = MAX_RECENT_SCORES): Promise<number[]> {
  try {
    const value = await AsyncStorage.getItem(RECENT_SCORES_KEY(gameId));
    if (value === null) return [];
    const scores: number[] = JSON.parse(value);
    return scores.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Append a score to the recent scores list.
 * Keeps only the last MAX_RECENT_SCORES entries.
 */
export async function saveRecentScore(gameId: string, score: number): Promise<void> {
  try {
    const existing = await getRecentScores(gameId);
    const updated = [score, ...existing].slice(0, MAX_RECENT_SCORES);
    await AsyncStorage.setItem(RECENT_SCORES_KEY(gameId), JSON.stringify(updated));
  } catch {
    // Silently fail — score storage is non-critical
  }
}

/**
 * Save a completed game score: updates high score in profile and appends to recent scores.
 * Returns true if the score is a new high score.
 */
export async function saveGameScore(gameId: string, score: number): Promise<boolean> {
  const [isNewHighScore] = await Promise.all([
    saveHighScore(gameId, score),
    saveRecentScore(gameId, score),
  ]);
  return isNewHighScore;
}
