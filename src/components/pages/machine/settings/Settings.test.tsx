import React from 'react';

import { CLEAR_BUTTON, ENCRYPT_MESSAGE_BUTTON } from '../../../../constants';
import { initialReflectorState } from '../../../../features/reflector';
import { initialRotorState } from '../../../../features/rotors/features';
import { fireEvent, render, screen } from '../../../../utils/test-utils';
import { Settings } from './Settings';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<object>('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      getParent: () => ({ setOptions: jest.fn() }),
    }),
    useFocusEffect: jest.fn(),
  };
});

const allRotorsSelectedState = {
  rotors: {
    ...initialRotorState,
    selectedSlots: [1, 2, 3] as [number, number, number],
  },
  plugboard: {},
  reflector: initialReflectorState,
};

describe(`Settings`, () => {
  it(`navigates to keyboard when all rotors are selected`, async () => {
    await render(<Settings />, { preloadedState: allRotorsSelectedState });
    await fireEvent.press(screen.getByTestId(ENCRYPT_MESSAGE_BUTTON));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('Keyboard');
  });

  it(`disables Encrypt Message button when rotors are not fully selected`, async () => {
    await render(<Settings />);
    expect(screen.getByTestId(ENCRYPT_MESSAGE_BUTTON)).toBeDisabled();
  });

  it(`clears rotor and plugboard state when Clear button is pressed`, async () => {
    await render(<Settings />, { preloadedState: allRotorsSelectedState });
    await fireEvent.press(screen.getByTestId(CLEAR_BUTTON));
    expect(screen.getByTestId(ENCRYPT_MESSAGE_BUTTON)).toBeDisabled();
  });
});
