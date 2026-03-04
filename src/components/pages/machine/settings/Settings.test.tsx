import React from 'react';

import { ENCRYPT_MESSAGE_BUTTON } from '../../../../constants';
import { fireEvent, render, screen } from '../../../../utils/test-utils';
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

describe(`Settings`, () => {
  const renderComponent = async () => {
    await render(<Settings />);
  };
  it(`navigates to keyboard`, async () => {
    await renderComponent();
    // eslint-disable-next-line testing-library/no-await-sync-events
    await fireEvent.press(screen.getByTestId(ENCRYPT_MESSAGE_BUTTON));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('Keyboard');
  });
});
