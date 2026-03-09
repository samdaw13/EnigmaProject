import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

import { Keyboard } from '../../src/components/organisms/Keyboard';
import { MachineSettings as Settings } from '../../src/components/pages/MachineSettings';
import {
  MESSAGE_DISPLAY,
  OUTPUT_LETTER_DISPLAY,
  RANDOMIZE_BUTTON,
} from '../../src/constants';
import plugboardReducer from '../../src/features/plugboard';
import reflectorReducer, {
  initialReflectorState,
} from '../../src/features/reflector';
import rotorsReducer, {
  initialRotorState,
} from '../../src/features/rotors/features';
import settingsReducer from '../../src/features/settings';
import { encryptLetter, stepRotors } from '../../src/utils';
import { keyboardLetterButton } from '../../src/utils/string-utils';
import { fireEvent, render, screen } from '../../src/utils/test-utils';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<object>('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      getParent: () => ({ setOptions: jest.fn() }),
    }),
    useFocusEffect: jest.fn(),
  };
});

const createStore = () =>
  configureStore({
    reducer: {
      rotors: rotorsReducer,
      plugboard: plugboardReducer,
      reflector: reflectorReducer,
      settings: settingsReducer,
    },
  });

const rotorIII = initialRotorState.available[3]!;
const rotorII = initialRotorState.available[2]!;
const rotorI = initialRotorState.available[1]!;
const reflectorB = initialReflectorState.reflectors[2]!;

const rotorsSelectedState = {
  rotors: {
    available: {
      ...initialRotorState.available,
      1: { ...rotorI, isAvailable: false },
      2: { ...rotorII, isAvailable: false },
      3: { ...rotorIII, isAvailable: false },
    },
    selectedSlots: [3, 2, 1] as (number | null)[],
  },
  plugboard: {} as Record<string, string>,
  reflector: initialReflectorState,
};

describe('Configure and encrypt', () => {
  it('UI output matches encryptString for the same rotor and reflector config', async () => {
    const orderedRotors = [rotorIII, rotorII, rotorI];
    const steppedRotors = stepRotors(orderedRotors);
    const expectedOutput = encryptLetter('A', steppedRotors, {}, reflectorB);

    await render(<Keyboard />, { preloadedState: rotorsSelectedState });
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));

    expect(screen.getByTestId(OUTPUT_LETTER_DISPLAY).props['children']).toBe(
      expectedOutput,
    );
  });

  it('accumulates a full message and no letter encrypts to itself', async () => {
    await render(<Keyboard />, { preloadedState: rotorsSelectedState });

    const keys = ['A', 'B', 'C', 'D', 'E'];
    for (const key of keys) {
      await fireEvent.press(screen.getByTestId(keyboardLetterButton(key)));
    }

    const message = screen.getByTestId(MESSAGE_DISPLAY).props[
      'children'
    ] as string;
    expect(message).toHaveLength(5);
    keys.forEach((key, i) => expect(message[i]).not.toBe(key));
  });

  it('Redux rotor currentIndex is used in encryption — different starting position gives different output', async () => {
    const rotorIIIAt5 = {
      ...rotorIII,
      config: { ...rotorIII.config, currentIndex: 5 },
    };
    const expectedAt0 = encryptLetter(
      'A',
      stepRotors([rotorIII, rotorII, rotorI]),
      {},
      reflectorB,
    );
    const expectedAt5 = encryptLetter(
      'A',
      stepRotors([rotorIIIAt5, rotorII, rotorI]),
      {},
      reflectorB,
    );
    expect(expectedAt0).not.toBe(expectedAt5);

    await render(<Keyboard />, {
      preloadedState: {
        ...rotorsSelectedState,
        rotors: {
          ...rotorsSelectedState.rotors,
          available: {
            ...rotorsSelectedState.rotors.available,
            3: {
              ...rotorIII,
              isAvailable: false,
              config: { ...rotorIII.config, currentIndex: 5 },
            },
          },
        },
      },
    });
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));

    expect(screen.getByTestId(OUTPUT_LETTER_DISPLAY).props['children']).toBe(
      expectedAt5,
    );
  });

  it('plugboard from Redux state is applied to encryption', async () => {
    const plugboard = { A: 'Z' };
    const steppedRotors = stepRotors([rotorIII, rotorII, rotorI]);
    const expectedWithPlug = encryptLetter(
      'A',
      steppedRotors,
      plugboard,
      reflectorB,
    );
    const expectedWithoutPlug = encryptLetter(
      'A',
      steppedRotors,
      {},
      reflectorB,
    );
    expect(expectedWithPlug).not.toBe(expectedWithoutPlug);

    await render(<Keyboard />, {
      preloadedState: { ...rotorsSelectedState, plugboard },
    });
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));

    expect(screen.getByTestId(OUTPUT_LETTER_DISPLAY).props['children']).toBe(
      expectedWithPlug,
    );
  });
});

describe('Redux state across Settings and Keyboard', () => {
  it('Randomize button dispatches rotor selections to the Redux store', async () => {
    const store = createStore();

    await render(<Settings />, { store });
    await fireEvent.press(screen.getByTestId(RANDOMIZE_BUTTON));

    expect(
      store.getState().rotors.selectedSlots.every((id) => id !== null),
    ).toBe(true);
  });

  it('Keyboard reads rotor selections from the shared Redux store', async () => {
    const store = configureStore({
      reducer: {
        rotors: rotorsReducer,
        plugboard: plugboardReducer,
        reflector: reflectorReducer,
        settings: settingsReducer,
      },
      preloadedState: rotorsSelectedState,
    });

    await render(<Keyboard />, { store });
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));

    expect(screen.getByTestId(OUTPUT_LETTER_DISPLAY).props['children']).toMatch(
      /^[A-Z]$/,
    );
  });

  it('key presses step rotor indices in the shared store and leave slot selections intact', async () => {
    const store = configureStore({
      reducer: {
        rotors: rotorsReducer,
        plugboard: plugboardReducer,
        reflector: reflectorReducer,
        settings: settingsReducer,
      },
      preloadedState: rotorsSelectedState,
    });

    const indicesBefore = [
      store.getState().rotors.available[1]!.config.currentIndex,
      store.getState().rotors.available[2]!.config.currentIndex,
      store.getState().rotors.available[3]!.config.currentIndex,
    ];

    await render(<Keyboard />, { store });
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));

    const indicesAfter = [
      store.getState().rotors.available[1]!.config.currentIndex,
      store.getState().rotors.available[2]!.config.currentIndex,
      store.getState().rotors.available[3]!.config.currentIndex,
    ];

    expect(indicesAfter).not.toEqual(indicesBefore);
    expect(store.getState().rotors.selectedSlots).toEqual([3, 2, 1]);
  });
});
