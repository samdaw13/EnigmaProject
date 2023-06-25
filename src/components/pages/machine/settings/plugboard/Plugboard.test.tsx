import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';

import { fireEvent, render, screen } from '../../../../../utils/test-utils';
import { Plugboard } from './Plugboard';
import { ADD_CABLE_MODAL_BUTTON, SELECT_INPUT_LETTER, SELECT_OUTPUT_LETTER } from '../../../../../constants';

jest.mock('react-native-paper', () => {
    const RealModule = jest.requireActual<object>('react-native-paper');
    const MockedModule = {
      ...RealModule,
      Portal: (props: PropsWithChildren) => <View>{props.children}</View>,
    };
    return MockedModule;
  });

describe(`Plugboard`, () => {
    const renderComponent = () => {
        render(<Plugboard />);
    };
    it(`opens modal and adds chip`, () => {
        renderComponent();
        fireEvent.press(screen.getByTestId(ADD_CABLE_MODAL_BUTTON));
        fireEvent.press(screen.getByTestId(`${SELECT_INPUT_LETTER}1`));
        fireEvent.press(screen.getByTestId(`${SELECT_OUTPUT_LETTER}1`));
        expect(screen.queryAllByTestId(`BC`)).toHaveLength(1);
    })
})