import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SavedAnalysis, SavedMessage } from '../types/interfaces';
import {
  addSavedAnalysis,
  addSavedMessage,
  deleteSavedAnalysis,
  deleteSavedMessage,
  loadSavedAnalyses,
  loadSavedMessages,
} from './storage';

const mockMessage: SavedMessage = {
  id: '1',
  label: 'Test message',
  plaintext: '',
  ciphertext: 'ABCDE',
  rotorIds: [1, 2, 3],
  rotorStartingPositions: [0, 0, 0],
  reflectorId: 2,
  plugboardCables: {},
  timestamp: 1000,
};

const mockAnalysis: SavedAnalysis = {
  id: '1',
  ciphertext: 'ABCDE',
  crib: 'HELLO',
  results: [
    {
      rotorIds: [1, 2, 3],
      reflectorName: 'UKW-B',
      startingPositions: [0, 0, 0],
      cribPosition: 0,
      decryptedText: 'HELLO',
      nlpScore: 85,
      derivedPlugboard: {},
    },
  ],
  timestamp: 1000,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('saved messages', () => {
  it('returns empty array when no messages saved', async () => {
    const result = await loadSavedMessages();
    expect(result).toEqual([]);
  });

  it('adds and loads a saved message', async () => {
    await addSavedMessage(mockMessage);
    const result = await loadSavedMessages();
    expect(result).toHaveLength(1);
    expect(result[0]!.label).toBe('Test message');
  });

  it('prepends new messages', async () => {
    await addSavedMessage(mockMessage);
    const second = { ...mockMessage, id: '2', label: 'Second' };
    await addSavedMessage(second);
    const result = await loadSavedMessages();
    expect(result).toHaveLength(2);
    expect(result[0]!.label).toBe('Second');
  });

  it('deletes a saved message', async () => {
    await addSavedMessage(mockMessage);
    const result = await deleteSavedMessage('1');
    expect(result).toHaveLength(0);
  });
});

describe('saved analyses', () => {
  it('returns empty array when no analyses saved', async () => {
    const result = await loadSavedAnalyses();
    expect(result).toEqual([]);
  });

  it('adds and loads a saved analysis', async () => {
    await addSavedAnalysis(mockAnalysis);
    const result = await loadSavedAnalyses();
    expect(result).toHaveLength(1);
    expect(result[0]!.crib).toBe('HELLO');
  });

  it('deletes a saved analysis', async () => {
    await addSavedAnalysis(mockAnalysis);
    const result = await deleteSavedAnalysis('1');
    expect(result).toHaveLength(0);
  });
});
