import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { ENCRYPT_MESSAGE_BUTTON } from '../../../../constants';
import { fireEvent, render, screen } from '../../../../utils';
import { Settings } from './Settings';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<object>('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual<object>('react-native-paper');
  const MockedModule = {
    ...RealModule,
    Portal: (props: PropsWithChildren) => <View>{props.children}</View>,
  };
  return MockedModule;
});

describe(`Settings`, () => {
  const renderComponent = () => {
    render(<Settings />);
  };
  it(`navigates to keyboard`, () => {
    renderComponent();
    fireEvent.press(screen.getByTestId(ENCRYPT_MESSAGE_BUTTON));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('Keyboard');
  });
});
