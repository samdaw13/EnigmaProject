import React from 'react';

import { KEYBOARD_GO_BACK_BUTTON } from '../../../constants';
import { fireEvent, render, screen } from '../../../utils/test-utils';
import { BackButton } from './BackButton';

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

describe(`BackButton`, () => {
  const renderComponent = async () => {
    await render(<BackButton />);
  };
  it(`goes back to previous stack item`, async () => {
    await renderComponent();
    await fireEvent.press(screen.getByTestId(KEYBOARD_GO_BACK_BUTTON));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
