import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

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

jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual<object>('react-native-paper');
  const MockedModule = {
    ...RealModule,
    Portal: (props: PropsWithChildren) => <View>{props.children}</View>,
  };
  return MockedModule;
});

describe(`Rotor`, () => {
  const renderComponent = () => {
    render(<Rotor />);
  };
  it(`selects a rotor button updates component with rotor`, () => {
    renderComponent();
    expect(screen.getAllByText(SELECT_ROTOR)).toHaveLength(1);
    fireEvent.press(screen.getByTestId(SET_ROTOR_BUTTON));
    expect(screen.getAllByText(SELECT_ROTOR)).toHaveLength(2);
    fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    expect(screen.getAllByText(SELECT_ROTOR)).toHaveLength(1);
    expect(screen.getByText(currentLetter('A'))).toBeTruthy();
  });
  it(`replaces rotor with different one`, () => {
    renderComponent();
    fireEvent.press(screen.getByTestId(SET_ROTOR_BUTTON));
    fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    fireEvent.press(screen.getByTestId(REPLACE_ROTOR_BUTTON));
    expect(screen.queryByTestId(selectRotorButton(1))).toBeFalsy();
    expect(screen.getByTestId(selectRotorButton(2))).toBeTruthy();
  });
  it(`updates rotor current letter`, async () => {
    renderComponent();
    fireEvent.press(screen.getByTestId(SET_ROTOR_BUTTON));
    fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    expect(screen.getByText(currentLetter('A'))).toBeTruthy();
    fireEvent.press(screen.getByTestId(CHANGE_LETTER_BUTTON));
    const newLetterBtn = await screen.findByTestId(letterButton('C', 1));
    fireEvent.press(newLetterBtn);
    expect(screen.getByText(currentLetter('C'))).toBeTruthy();
  });
  it(`removes rotor`, () => {
    renderComponent();
    expect(screen.queryByText(currentLetter('A'))).toBeFalsy();
    fireEvent.press(screen.getByTestId(SET_ROTOR_BUTTON));
    fireEvent.press(screen.getByTestId(selectRotorButton(1)));
    expect(screen.getByText(currentLetter('A'))).toBeTruthy();
    fireEvent.press(screen.getByTestId(REMOVE_ROTOR_BUTTON));
    expect(screen.queryByText(currentLetter('A'))).toBeFalsy();
  });
});
