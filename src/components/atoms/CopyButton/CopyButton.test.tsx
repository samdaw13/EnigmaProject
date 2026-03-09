import { act } from '@testing-library/react-native';
import React from 'react';

import { COPY_MESSAGE_BUTTON } from '../../../constants';
import { fireEvent, render, screen } from '../../../utils/test-utils';
import { CopyButton } from './CopyButton';

jest.mock('@react-native-clipboard/clipboard', () => ({
  __esModule: true,
  default: { setString: jest.fn() },
}));

const mockClipboard = jest.requireMock<{
  default: { setString: jest.Mock };
}>('@react-native-clipboard/clipboard');

describe('CopyButton', () => {
  beforeEach(() => {
    mockClipboard.default.setString.mockClear();
  });

  it('renders with copy label', async () => {
    await render(<CopyButton text='HELLO' />);
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('copies text to clipboard when pressed', async () => {
    await render(<CopyButton text='HELLO' />);
    await fireEvent.press(screen.getByTestId(COPY_MESSAGE_BUTTON));
    expect(mockClipboard.default.setString).toHaveBeenCalledWith('HELLO');
  });

  it('shows "Copied!" after being pressed', async () => {
    jest.useFakeTimers();
    await render(<CopyButton text='HELLO' />);
    await fireEvent.press(screen.getByTestId(COPY_MESSAGE_BUTTON));
    expect(screen.getByText('Copied!')).toBeTruthy();
    jest.useRealTimers();
  });

  it('reverts to "Copy" label after 2 seconds', async () => {
    jest.useFakeTimers();
    await render(<CopyButton text='HELLO' />);
    await fireEvent.press(screen.getByTestId(COPY_MESSAGE_BUTTON));
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });
    expect(screen.getByText('Copy')).toBeTruthy();
    jest.useRealTimers();
  });
});
