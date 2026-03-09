import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SavedAnalysis, SavedMessage } from '../types/interfaces';

const SAVED_MESSAGES_KEY = 'saved_messages';
const SAVED_ANALYSES_KEY = 'saved_analyses';

export const loadSavedMessages = async (): Promise<SavedMessage[]> => {
  const json = await AsyncStorage.getItem(SAVED_MESSAGES_KEY);
  if (json === null) return [];
  return JSON.parse(json) as SavedMessage[];
};

export const saveSavedMessages = async (
  messages: SavedMessage[],
): Promise<void> => {
  await AsyncStorage.setItem(SAVED_MESSAGES_KEY, JSON.stringify(messages));
};

export const addSavedMessage = async (
  message: SavedMessage,
): Promise<SavedMessage[]> => {
  const messages = await loadSavedMessages();
  const updated = [message, ...messages];
  await saveSavedMessages(updated);
  return updated;
};

export const deleteSavedMessage = async (
  id: string,
): Promise<SavedMessage[]> => {
  const messages = await loadSavedMessages();
  const updated = messages.filter((m) => m.id !== id);
  await saveSavedMessages(updated);
  return updated;
};

export const loadSavedAnalyses = async (): Promise<SavedAnalysis[]> => {
  const json = await AsyncStorage.getItem(SAVED_ANALYSES_KEY);
  if (json === null) return [];
  return JSON.parse(json) as SavedAnalysis[];
};

export const saveSavedAnalyses = async (
  analyses: SavedAnalysis[],
): Promise<void> => {
  await AsyncStorage.setItem(SAVED_ANALYSES_KEY, JSON.stringify(analyses));
};

export const addSavedAnalysis = async (
  analysis: SavedAnalysis,
): Promise<SavedAnalysis[]> => {
  const analyses = await loadSavedAnalyses();
  const updated = [analysis, ...analyses];
  await saveSavedAnalyses(updated);
  return updated;
};

export const deleteSavedAnalysis = async (
  id: string,
): Promise<SavedAnalysis[]> => {
  const analyses = await loadSavedAnalyses();
  const updated = analyses.filter((a) => a.id !== id);
  await saveSavedAnalyses(updated);
  return updated;
};
