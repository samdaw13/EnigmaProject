import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

import { EMPTY_SAVED_ANALYSES } from '../../../constants/labels';
import {
  DELETE_SAVED_BUTTON,
  EMPTY_STATE_TEXT,
  SAVED_ANALYSIS_CARD,
} from '../../../constants/selectors';
import type { SavedAnalysis } from '../../../types/interfaces';
import { fireEvent, render, screen, waitFor } from '../../../utils/test-utils';
import { SavedAnalyses } from './SavedAnalyses';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ setOptions: jest.fn() }),
}));

const mockAnalysis: SavedAnalysis = {
  id: '456',
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

describe('SavedAnalyses', () => {
  it('shows empty state when no saved analyses', async () => {
    await render(<SavedAnalyses />);
    await waitFor(() => {
      expect(screen.getByTestId(EMPTY_STATE_TEXT)).toHaveTextContent(
        EMPTY_SAVED_ANALYSES,
      );
    });
  });

  it('renders saved analyses from storage', async () => {
    await AsyncStorage.setItem(
      'saved_analyses',
      JSON.stringify([mockAnalysis]),
    );
    await render(<SavedAnalyses />);
    await waitFor(() => {
      expect(screen.getByTestId(`${SAVED_ANALYSIS_CARD}_456`)).toBeTruthy();
    });
  });

  it('expands and shows results on tap', async () => {
    await AsyncStorage.setItem(
      'saved_analyses',
      JSON.stringify([mockAnalysis]),
    );
    await render(<SavedAnalyses />);
    await waitFor(() => {
      expect(screen.getByTestId(`${SAVED_ANALYSIS_CARD}_456`)).toBeTruthy();
    });
    await fireEvent.press(screen.getByTestId(`${SAVED_ANALYSIS_CARD}_456`));
    await waitFor(() => {
      expect(screen.getByText('Decrypted: HELLO')).toBeTruthy();
    });
  });

  it('shows NLP confidence badges', async () => {
    await AsyncStorage.setItem(
      'saved_analyses',
      JSON.stringify([mockAnalysis]),
    );
    await render(<SavedAnalyses />);
    await waitFor(() => {
      expect(screen.getByTestId(`${SAVED_ANALYSIS_CARD}_456`)).toBeTruthy();
    });
    await fireEvent.press(screen.getByTestId(`${SAVED_ANALYSIS_CARD}_456`));
    await waitFor(() => {
      expect(screen.getByText('Confidence: 85%')).toBeTruthy();
    });
  });

  it('deletes a saved analysis', async () => {
    await AsyncStorage.setItem(
      'saved_analyses',
      JSON.stringify([mockAnalysis]),
    );
    await render(<SavedAnalyses />);
    await waitFor(() => {
      expect(screen.getByTestId(`${SAVED_ANALYSIS_CARD}_456`)).toBeTruthy();
    });
    await fireEvent.press(screen.getByTestId(`${SAVED_ANALYSIS_CARD}_456`));
    await waitFor(() => {
      expect(screen.getByTestId(`${DELETE_SAVED_BUTTON}_456`)).toBeTruthy();
    });
    await fireEvent.press(screen.getByTestId(`${DELETE_SAVED_BUTTON}_456`));
    await waitFor(() => {
      expect(screen.queryByTestId(`${SAVED_ANALYSIS_CARD}_456`)).toBeNull();
    });
  });
});
