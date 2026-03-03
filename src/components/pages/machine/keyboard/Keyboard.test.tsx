import React from 'react';

import {
  KEYBOARD_GO_BACK_BUTTON,
  MESSAGE_DISPLAY,
  OUTPUT_LETTER_DISPLAY,
} from '../../../../constants';
import { fireEvent, render, screen } from '../../../../utils';
import { keyboardLetterButton } from '../../../../utils/string-utils';
import { Keyboard } from './Keyboard';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<object>('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
  };
});

describe('Keyboard', () => {
  const renderComponent = () => {
    render(<Keyboard />);
  };

  const renderWithRotorsSelected = () => {
    render(<Keyboard />, {
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
      },
    });
  };

  it('goes back to previous stack item', () => {
    renderComponent();
    fireEvent.press(screen.getByTestId(KEYBOARD_GO_BACK_BUTTON));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('does not encrypt when rotors are not selected', () => {
    renderComponent();
    fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    expect(screen.getByTestId(OUTPUT_LETTER_DISPLAY).props.children).toBe('');
    expect(screen.getByTestId(MESSAGE_DISPLAY).props.children).toBe('');
  });

  it('encrypts a letter when all 3 rotors are selected', () => {
    renderWithRotorsSelected();
    fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    const output = screen.getByTestId(OUTPUT_LETTER_DISPLAY);
    expect(output.props.children).toMatch(/^[A-Z]$/);
    expect(output.props.children).not.toBe('A');
  });

  it('accumulates encrypted letters in the message', () => {
    renderWithRotorsSelected();
    fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    const message = screen.getByTestId(MESSAGE_DISPLAY);
    expect(message.props.children as string).toHaveLength(2);
  });

  it('a letter never encrypts to itself', () => {
    renderWithRotorsSelected();
    fireEvent.press(screen.getByTestId(keyboardLetterButton('A')));
    const output = screen.getByTestId(OUTPUT_LETTER_DISPLAY);
    expect(output.props.children).not.toBe('A');
  });
});
