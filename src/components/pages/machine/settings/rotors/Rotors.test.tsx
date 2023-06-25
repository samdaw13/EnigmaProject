import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { NO_ROTOR_SELECTED } from '../../../../../constants';
import { render, screen } from '../../../../../utils/test-utils';
import { Rotors } from './Rotors';

jest.mock('react-native-paper', () => {
  const RealModule = jest.requireActual<object>('react-native-paper');
  const MockedModule = {
    ...RealModule,
    Portal: (props: PropsWithChildren) => <View>{props.children}</View>,
  };
  return MockedModule;
});

describe(`Rotors`, () => {
  const renderComponent = () => {
    render(<Rotors />);
  };
  it(`displays all rotors`, () => {
    renderComponent();
    expect(screen.getAllByText(NO_ROTOR_SELECTED)).toHaveLength(3);
  });
});
