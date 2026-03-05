import React from 'react';

import { INFO_SIDEBAR, INFO_SIDEBAR_CLOSE } from '../constants/selectors';
import { fireEvent, render, screen, waitFor } from '../utils/test-utils';
import { InfoSidebar } from './InfoSidebar';

const defaultProps = {
  title: 'Test Title',
  content: 'Test content explaining the feature.',
  onDismiss: jest.fn(),
};

describe('InfoSidebar', () => {
  it('renders sidebar content when visible', async () => {
    await render(<InfoSidebar {...defaultProps} visible />);
    expect(screen.getByTestId(INFO_SIDEBAR)).toBeTruthy();
    expect(screen.getByText(defaultProps.title)).toBeTruthy();
    expect(screen.getByText(defaultProps.content)).toBeTruthy();
  });

  it('does not render sidebar when not visible', async () => {
    await render(<InfoSidebar {...defaultProps} visible={false} />);
    expect(screen.queryByTestId(INFO_SIDEBAR)).toBeNull();
  });

  it('calls onDismiss when close button is pressed', async () => {
    const onDismiss = jest.fn();
    await render(
      <InfoSidebar {...defaultProps} visible onDismiss={onDismiss} />,
    );
    fireEvent.press(screen.getByTestId(INFO_SIDEBAR_CLOSE));
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
  });
});
