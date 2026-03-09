import React from 'react';

import { encryptString } from '../../src/codebreaking';
import { BreakCipher } from '../../src/components/pages/breakCipher';
import {
  CIPHERTEXT_INPUT,
  CRIB_INPUT,
  DECRYPTED_TEXT_DISPLAY,
  RESULTS_CONTAINER,
  RUN_ANALYSIS_BUTTON,
} from '../../src/constants';
import type * as ReflectorModule from '../../src/features/reflector';
import { initialReflectorState } from '../../src/features/reflector';
import type * as RotorsFeaturesModule from '../../src/features/rotors/features';
import { initialRotorState } from '../../src/features/rotors/features';
import type { PlugboardCable } from '../../src/types';
import { fireEvent, render, screen, waitFor } from '../../src/utils/test-utils';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<object>('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      setOptions: jest.fn(),
    }),
  };
});

jest.mock('../../src/features/rotors/features', () => {
  const actual = jest.requireActual<typeof RotorsFeaturesModule>(
    '../../src/features/rotors/features',
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

jest.mock('../../src/features/reflector', () => {
  const actual = jest.requireActual<typeof ReflectorModule>(
    '../../src/features/reflector',
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
