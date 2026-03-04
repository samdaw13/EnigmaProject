/* eslint-disable testing-library/no-await-sync-events */
// THis is due to ESLint both demanding an await and no await for the fireEvents
import React from 'react';

import {
  CHANGE_LETTER_BUTTON,
  REMOVE_ROTOR_BUTTON,
  REPLACE_ROTOR_BUTTON,
  SELECT_ROTOR,
  SET_ROTOR_BUTTON,
} from '../../../../../constants';
import {
  currentLetter,
  letterButton,
  selectRotorButton,
} from '../../../../../utils';
import { fireEvent, render, screen } from '../../../../../utils/test-utils';
import { Rotor } from './Rotor';

describe(`Rotor`, () => {
  const renderComponent = async () => {
    await render(<Rotor slotIndex={0} />);
  };
  it(`selects a rotor button updates component with rotor`, async () => {
    await renderComponent();
    expect(screen.getAllByText(SELECT_ROTOR)).toHaveLength(1);
    await fireEvent.press(screen.getByTestId(SET_ROTOR_BUTTON));
    expect(screen.getAllByText(SELECT_ROTOR)).toHaveLength(2);
    await fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    expect(screen.getAllByText(SELECT_ROTOR)).toHaveLength(1);
    expect(screen.getByText(currentLetter('A'))).toBeTruthy();
  });
  it(`replaces rotor with different one`, async () => {
    await renderComponent();
    await fireEvent.press(screen.getByTestId(SET_ROTOR_BUTTON));
    await fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    await fireEvent.press(screen.getByTestId(REPLACE_ROTOR_BUTTON));
    expect(screen.queryByTestId(selectRotorButton(1))).toBeFalsy();
    expect(screen.getByTestId(selectRotorButton(2))).toBeTruthy();
  });
  it(`updates rotor current letter`, async () => {
    await renderComponent();
    await fireEvent.press(screen.getByTestId(SET_ROTOR_BUTTON));
    await fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    expect(screen.getByText(currentLetter('A'))).toBeTruthy();
    await fireEvent.press(screen.getByTestId(CHANGE_LETTER_BUTTON));
    const newLetterBtn = await screen.findByTestId(letterButton('C', 1));
    await fireEvent.press(newLetterBtn);
    expect(screen.getByText(currentLetter('C'))).toBeTruthy();
  });
  it(`removes rotor`, async () => {
    await renderComponent();
    expect(screen.queryByText(currentLetter('A'))).toBeFalsy();
    await fireEvent.press(screen.getByTestId(SET_ROTOR_BUTTON));
    await fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    expect(screen.getByText(currentLetter('A'))).toBeTruthy();
    await fireEvent.press(screen.getByTestId(REMOVE_ROTOR_BUTTON));
    expect(screen.queryByText(currentLetter('A'))).toBeFalsy();
  });
});
