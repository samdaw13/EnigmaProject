import React, { PropsWithChildren } from 'react';
import { render, screen, fireEvent } from '../../../../../utils/test-utils';
import { Rotors } from './Rotors';
import { View } from 'react-native';

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
        expect(screen.getAllByText('No rotor selected')).toHaveLength(3);
    })
})