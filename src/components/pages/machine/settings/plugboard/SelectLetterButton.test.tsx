import React from 'react';

import {
  SELECT_INPUT_LETTER,
  SELECT_INPUT_LETTER_DISPLAY,
} from '../../../../../constants';
import { fireEvent, render, screen } from '../../../../../utils';
import { SelectLetterButton } from './SelectLetterButton';

describe(`SelectLetterButton`, () => {
  const mockSetLetter = jest.fn();
  const mockSetAvailableLetteres = jest.fn();
  const renderComponent = () => {
    render(
      <SelectLetterButton
        setLetter={mockSetLetter}
        displayText={SELECT_INPUT_LETTER_DISPLAY}
        availableLetters={[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']}
        setAvailableLetters={mockSetAvailableLetteres}
        testID={SELECT_INPUT_LETTER}
      />,
    );
  };
  it(`calls updateLetter function`, () => {
    renderComponent();
    fireEvent.press(screen.getByTestId(`${SELECT_INPUT_LETTER}1`));
    expect(mockSetLetter).toHaveBeenCalledWith('B');
    expect(mockSetAvailableLetteres).toHaveBeenCalledWith([
      ...'ACDEFGHIJKLMNOPQRSTUVWXYZ',
    ]);
  });
});
