import React from 'react';

import {
  CIPHERTEXT_INPUT,
  CRIB_INPUT,
  DECRYPTED_TEXT_DISPLAY,
  RESULTS_CONTAINER,
  RUN_ANALYSIS_BUTTON,
} from '../../../../constants';
import type * as ReflectorModule from '../../../../features/reflector';
import { initialReflectorState } from '../../../../features/reflector';
import type * as RotorsFeaturesModule from '../../../../features/rotors/features';
import { initialRotorState } from '../../../../features/rotors/features';
import type { PlugboardCable } from '../../../../types';
import { encryptString } from '../../../../utils/codebreaking';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../../utils/test-utils';
import { BreakCipher } from '../BreakCipher';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<object>('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      setOptions: jest.fn(),
    }),
  };
});

// Limit to rotors I–III and one reflector so the real search completes quickly
// (6 permutations × 17,576 positions vs the full 60 × 3 × 17,576).
// __esModule must be explicit — jest.requireActual returns it as non-enumerable
// so spread alone won't include it, causing _interopRequireDefault to wrap the
// whole object and break default imports (e.g. rotorsReducer in test-utils).
jest.mock('../../../../features/rotors/features', () => {
  const actual = jest.requireActual<typeof RotorsFeaturesModule>(
    '../../../../features/rotors/features',
  );
  return {
    __esModule: true,
    ...actual,
    initialRotorState: {
      ...actual.initialRotorState,
      available: {
        1: actual.initialRotorState.available[1],
        2: actual.initialRotorState.available[2],
        3: actual.initialRotorState.available[3],
      },
    },
  };
});

jest.mock('../../../../features/reflector', () => {
  const actual = jest.requireActual<typeof ReflectorModule>(
    '../../../../features/reflector',
  );
  return {
    __esModule: true,
    ...actual,
    initialReflectorState: {
      ...actual.initialReflectorState,
      reflectors: { 2: actual.initialReflectorState.reflectors[2] },
    },
  };
});

jest.setTimeout(20000);

const rotorIII = initialRotorState.available[3]!;
const rotorII = initialRotorState.available[2]!;
const rotorI = initialRotorState.available[1]!;
const reflectorB = initialReflectorState.reflectors[2]!;
const emptyPlugboard: PlugboardCable = {};

// Using the full plaintext as the crib eliminates Bombe false positives —
// only position 0 passes the structural check, so the correct config always
// appears in the results regardless of NLP ranking.
const PLAINTEXT = 'WITHTION';
const CRIB = 'WITHTION';
const CIPHERTEXT = encryptString(
  PLAINTEXT,
  [
    { ...rotorIII, config: { ...rotorIII.config, currentIndex: 0 } },
    { ...rotorII, config: { ...rotorII.config, currentIndex: 0 } },
    { ...rotorI, config: { ...rotorI.config, currentIndex: 0 } },
  ],
  emptyPlugboard,
  reflectorB,
);

describe('BreakCipher crib search (integration)', () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it('finds and displays the correct decryption for a known crib', async () => {
    await render(<BreakCipher />);

    await fireEvent.changeText(
      screen.getByTestId(CIPHERTEXT_INPUT),
      CIPHERTEXT,
    );
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), CRIB);
    await fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(
      () => {
        expect(screen.getByTestId(RESULTS_CONTAINER)).toBeTruthy();
      },
      { timeout: 15000 },
    );

    expect(screen.getByTestId(`${DECRYPTED_TEXT_DISPLAY}_0`)).toBeTruthy();
    expect(screen.getAllByText(/WITHTION/).length).toBeGreaterThan(0);
  });
});
