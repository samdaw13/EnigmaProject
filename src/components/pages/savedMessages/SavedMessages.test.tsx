import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

import { EMPTY_SAVED_MESSAGES } from '../../../constants/labels';
import {
  DELETE_SAVED_BUTTON,
  EMPTY_STATE_TEXT,
  SAVED_MESSAGE_CARD,
} from '../../../constants/selectors';
import type { SavedMessage } from '../../../types/interfaces';
import { fireEvent, render, screen, waitFor } from '../../../utils/test-utils';
import { SavedMessages } from './SavedMessages';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ setOptions: jest.fn() }),
}));

const mockMessage: SavedMessage = {
  id: '123',
  label: 'Test msg',
  plaintext: '',
  ciphertext: 'ABCDE',
  rotorIds: [1, 2, 3],
  rotorStartingPositions: [0, 0, 0],
  reflectorId: 2,
  plugboardCables: { A: 'B' },
  timestamp: 1000,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('SavedMessages', () => {
  it('shows empty state when no saved messages', async () => {
    await render(<SavedMessages />);
    await waitFor(() => {
      expect(screen.getByTestId(EMPTY_STATE_TEXT)).toHaveTextContent(
        EMPTY_SAVED_MESSAGES,
      );
    });
  });

  it('renders saved messages from storage', async () => {
    await AsyncStorage.setItem('saved_messages', JSON.stringify([mockMessage]));
    await render(<SavedMessages />);
    await waitFor(() => {
      expect(screen.getByTestId(`${SAVED_MESSAGE_CARD}_123`)).toBeTruthy();
    });
  });

  it('expands and shows details on tap', async () => {
    await AsyncStorage.setItem('saved_messages', JSON.stringify([mockMessage]));
    await render(<SavedMessages />);
    await waitFor(() => {
      expect(screen.getByTestId(`${SAVED_MESSAGE_CARD}_123`)).toBeTruthy();
    });
    await fireEvent.press(screen.getByTestId(`${SAVED_MESSAGE_CARD}_123`));
    await waitFor(() => {
      expect(screen.getByText('Rotors: 1, 2, 3')).toBeTruthy();
    });
  });

  it('deletes a saved message', async () => {
    await AsyncStorage.setItem('saved_messages', JSON.stringify([mockMessage]));
    await render(<SavedMessages />);
    await waitFor(() => {
      expect(screen.getByTestId(`${SAVED_MESSAGE_CARD}_123`)).toBeTruthy();
    });
    await fireEvent.press(screen.getByTestId(`${SAVED_MESSAGE_CARD}_123`));
    await waitFor(() => {
      expect(screen.getByTestId(`${DELETE_SAVED_BUTTON}_123`)).toBeTruthy();
    });
    await fireEvent.press(screen.getByTestId(`${DELETE_SAVED_BUTTON}_123`));
    await waitFor(() => {
      expect(screen.queryByTestId(`${SAVED_MESSAGE_CARD}_123`)).toBeNull();
    });
  });
});
