import React from 'react';

import { KEYBOARD_GO_BACK_BUTTON } from '../../../../constants';
import { fireEvent, render, screen } from '../../../../utils';
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

describe(`Keyboard`, () => {
  const renderComponent = () => {
    render(<Keyboard />);
  };
  it(`goes back to previous stack item`, () => {
    renderComponent();
    fireEvent.press(screen.getByTestId(KEYBOARD_GO_BACK_BUTTON));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
