import React from 'react';

import {
  CRIB_POSITION_CONFLICT_HINT,
  CRIB_POSITION_MODAL_TITLE,
} from '../../../constants/labels';
import {
  CRIB_POSITION_CLEAR_BUTTON,
  CRIB_POSITION_CONFIRM_BUTTON,
  CRIB_POSITION_LEFT_ARROW,
  CRIB_POSITION_MODAL,
  CRIB_POSITION_RIGHT_ARROW,
} from '../../../constants/selectors';
import { fireEvent, render, screen } from '../../../utils/test-utils';
import { CribPositionModal } from './CribPositionModal';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual<object>('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      setOptions: jest.fn(),
    }),
  };
});

const defaultProps = {
  visible: true,
  onDismiss: jest.fn(),
  ciphertext: 'ABCDEFGH',
  crib: 'XYZ',
  currentPosition: undefined as number | undefined,
  onConfirm: jest.fn(),
  onClear: jest.fn(),
};

const renderModal = (overrides = {}) =>
  render(<CribPositionModal {...defaultProps} {...overrides} />);

describe('CribPositionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with title', async () => {
    await renderModal();
    expect(screen.getByTestId(CRIB_POSITION_MODAL)).toBeTruthy();
    expect(screen.getByText(CRIB_POSITION_MODAL_TITLE)).toBeTruthy();
  });

  it('shows position 1 of N by default', async () => {
    await renderModal();
    expect(screen.getByText(/Position 1 of 6/)).toBeTruthy();
  });

  it('starts at currentPosition when provided', async () => {
    await renderModal({ currentPosition: 3 });
    expect(screen.getByText(/Position 4 of 6/)).toBeTruthy();
  });

  it('navigates right with arrow button', async () => {
    await renderModal();
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_RIGHT_ARROW));
    expect(screen.getByText(/Position 2 of 6/)).toBeTruthy();
  });

  it('navigates left with arrow button', async () => {
    await renderModal({ currentPosition: 2 });
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_LEFT_ARROW));
    expect(screen.getByText(/Position 2 of 6/)).toBeTruthy();
  });

  it('does not navigate left past position 0', async () => {
    await renderModal();
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_LEFT_ARROW));
    expect(screen.getByText(/Position 1 of 6/)).toBeTruthy();
  });

  it('does not navigate right past max position', async () => {
    await renderModal({ currentPosition: 5 });
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_RIGHT_ARROW));
    expect(screen.getByText(/Position 6 of 6/)).toBeTruthy();
  });

  it('shows conflict hint when crib letter matches ciphertext letter', async () => {
    await renderModal({ ciphertext: 'AXCDEFGH', crib: 'AYZ' });
    expect(screen.getByText(CRIB_POSITION_CONFLICT_HINT)).toBeTruthy();
  });

  it('disables confirm button when position has conflicts', async () => {
    const onConfirm = jest.fn();
    await renderModal({ ciphertext: 'AXCDEFGH', crib: 'AYZ', onConfirm });
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_CONFIRM_BUTTON));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('does not show conflict hint when no conflicts', async () => {
    await renderModal({ ciphertext: 'ABCDEFGH', crib: 'XYZ' });
    expect(screen.queryByText(CRIB_POSITION_CONFLICT_HINT)).toBeNull();
  });

  it('calls onConfirm with 0-indexed position and dismisses', async () => {
    const onConfirm = jest.fn();
    const onDismiss = jest.fn();
    await renderModal({ onConfirm, onDismiss, currentPosition: 2 });
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_CONFIRM_BUTTON));
    expect(onConfirm).toHaveBeenCalledWith(2);
    expect(onDismiss).toHaveBeenCalled();
  });

  it('calls onClear and dismisses', async () => {
    const onClear = jest.fn();
    const onDismiss = jest.fn();
    await renderModal({ onClear, onDismiss });
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_CLEAR_BUTTON));
    expect(onClear).toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalled();
  });

  it('confirms navigated position after arrow presses', async () => {
    const onConfirm = jest.fn();
    await renderModal({ onConfirm });
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_RIGHT_ARROW));
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_RIGHT_ARROW));
    await fireEvent.press(screen.getByTestId(CRIB_POSITION_CONFIRM_BUTTON));
    expect(onConfirm).toHaveBeenCalledWith(2);
  });
});
