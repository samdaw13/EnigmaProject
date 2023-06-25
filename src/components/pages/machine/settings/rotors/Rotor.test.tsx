import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

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
    expect(screen.getAllByText('Select rotor')).toHaveLength(1);
    fireEvent.press(screen.getByTestId('selectRotorBtn'));
    expect(screen.getAllByText('Select rotor')).toHaveLength(2);
    fireEvent.press(screen.getByTestId('selectRotorBtn1'));
    expect(screen.getAllByText('Select rotor')).toHaveLength(1);
    expect(screen.getByText('Current letter: A')).toBeTruthy();
  });
  it(`replaces rotor with different one`, () => {
    renderComponent();
    fireEvent.press(screen.getByTestId('selectRotorBtn'));
    fireEvent.press(screen.getByTestId('selectRotorBtn1'));
    fireEvent.press(screen.getByTestId('replaceRotorBtn'));
    expect(screen.queryByTestId('selectRotorBtn1')).toBeFalsy();
    expect(screen.getByTestId('selectRotorBtn2')).toBeTruthy();
  });
  it(`updates rotor current letter`, async () => {
    renderComponent();
    fireEvent.press(screen.getByTestId('selectRotorBtn'));
    fireEvent.press(screen.getByTestId('selectRotorBtn1'));
    expect(screen.getByText('Current letter: A')).toBeTruthy();
    fireEvent.press(screen.getByTestId('changeLetterBtn'));
    const newLetterBtn = await screen.findByTestId('buttonC1');
    fireEvent.press(newLetterBtn);
    expect(screen.getByText('Current letter: C')).toBeTruthy();
  });
  it(`removes rotor`, () => {
    renderComponent();
    expect(screen.queryByText('Current letter: A')).toBeFalsy();
    fireEvent.press(screen.getByTestId('selectRotorBtn'));
    fireEvent.press(screen.getByTestId('selectRotorBtn1'));
    expect(screen.getByText('Current letter: A')).toBeTruthy();
    fireEvent.press(screen.getByTestId('removeRotor'));
    expect(screen.queryByText('Current letter: A')).toBeFalsy();
  });
});
