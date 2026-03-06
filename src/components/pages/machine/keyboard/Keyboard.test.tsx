import React from 'react';

import {
  COPY_MESSAGE_BUTTON,
  KEYBOARD_GO_BACK_BUTTON,
  MESSAGE_DISPLAY,
  OUTPUT_LETTER_DISPLAY,
} from '../../../../constants';
import { keyboardLetterButton } from '../../../../utils/string-utils';
import { fireEvent, render, screen } from '../../../../utils/test-utils';
import { Keyboard } from './Keyboard';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<object>('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
      getParent: () => ({ setOptions: jest.fn() }),
    }),
    useFocusEffect: jest.fn(),
  };
});

describe('Keyboard', () => {
  const renderComponent = async () => {
    await render(<Keyboard />);
  };

  const renderWithRotorsSelected = async () => {
    await render(<Keyboard />, {
      preloadedState: {
        rotors: {
          available: {
            1: {
              isAvailable: false,
              config: {
                stepIndex: 16,
                displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
                mappedLetters: 'JGDQOXUSCAMIFRVTPNEWKBLZYH'.split(''),
                currentIndex: 0,
              },
              id: 1,
            },
            2: {
              isAvailable: false,
              config: {
                stepIndex: 4,
                displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
                mappedLetters: 'NTZPSFBOKMWRCJDIVLAEYUXHGQ'.split(''),
                currentIndex: 0,
              },
              id: 2,
            },
            3: {
              isAvailable: false,
              config: {
                stepIndex: 21,
                displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
                mappedLetters: 'JVIUBHTCDYAKEQZPOSGXNRMWFL'.split(''),
                currentIndex: 0,
              },
              id: 3,
            },
          },
          selectedSlots: [3, 2, 1],
        },
        plugboard: {},
        reflector: {
          reflectors: {
            1: {
              id: 1,
              name: 'Reflector A',
              config: {
                mapping: [],
              },
            },
          },
          selectedReflectorId: 1,
        },
      },
    });
  };

  it('goes back to previous stack item', async () => {
    await renderComponent();
    await fireEvent.press(screen.getByTestId(KEYBOARD_GO_BACK_BUTTON));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('does not encrypt when rotors are not selected', async () => {
    await renderComponent();
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    expect(screen.getByTestId(OUTPUT_LETTER_DISPLAY).props['children']).toBe(
      '',
    );
    expect(screen.getByTestId(MESSAGE_DISPLAY).props['children']).toBe('');
  });

  it('encrypts a letter when all 3 rotors are selected', async () => {
    await renderWithRotorsSelected();
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    const output = screen.getByTestId(OUTPUT_LETTER_DISPLAY);
    expect(output.props['children']).toMatch(/^[A-Z]$/);
    expect(output.props['children']).not.toBe('A');
  });

  it('accumulates encrypted letters in the message', async () => {
    await renderWithRotorsSelected();
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    const message = screen.getByTestId(MESSAGE_DISPLAY);
    expect(message.props['children'] as string).toHaveLength(2);
  });

  it('a letter never encrypts to itself', async () => {
    await renderWithRotorsSelected();
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    const output = screen.getByTestId(OUTPUT_LETTER_DISPLAY);
    expect(output.props['children']).not.toBe('A');
  });

  it('does not show copy button when message is empty', async () => {
    await renderComponent();
    expect(screen.queryByTestId(COPY_MESSAGE_BUTTON)).toBeNull();
  });

  it('shows copy button after a letter is encrypted', async () => {
    await renderWithRotorsSelected();
    await fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    expect(screen.getByTestId(COPY_MESSAGE_BUTTON)).toBeTruthy();
  });
});
