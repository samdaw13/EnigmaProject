import React from 'react';

import {
  BRUTE_FORCE_RESULT_CARD,
  CANCEL_SEARCH_BUTTON,
  CIPHERTEXT_INPUT,
  COPY_MESSAGE_BUTTON,
  CRIB_INPUT,
  CRIB_POSITION_CARD,
  DECRYPTED_TEXT_DISPLAY,
  PROGRESS_BAR,
  RESULTS_CONTAINER,
  RUN_ANALYSIS_BUTTON,
} from '../../../constants/selectors';
import type { CribSearchResult } from '../../../utils/codebreaking';
import { cribSearchAsync } from '../../../utils/codebreaking';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../utils/test-utils';
import { BreakCipher } from './BreakCipher';

jest.mock('../../../utils/codebreaking', () => {
  const actual = jest.requireActual<object>('../../../utils/codebreaking');
  return {
    ...actual,
    cribSearchAsync: jest.fn(
      (
        _ciphertext: string,
        _crib: string,
        _rotors: object,
        _reflectors: object,
        onProgress: (p: number) => void,
      ) => {
        onProgress(1);
        return Promise.resolve([]);
      },
    ),
  };
});

const mockCribSearchAsync = cribSearchAsync as jest.MockedFunction<
  typeof cribSearchAsync
>;

describe('BreakCipher', () => {
  it('renders the crib analysis interface', async () => {
    await render(<BreakCipher />);
    expect(screen.getByTestId(CIPHERTEXT_INPUT)).toBeTruthy();
    expect(screen.getByTestId(CRIB_INPUT)).toBeTruthy();
    expect(screen.getByTestId(RUN_ANALYSIS_BUTTON)).toBeTruthy();
  });

  it('runs crib analysis and displays structural fallback when cribSearchAsync returns empty', async () => {
    await render(<BreakCipher />);

    await fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    await fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(RESULTS_CONTAINER)).toBeTruthy();
    });
  });

  it('shows progress bar during crib search', async () => {
    let resolveSearch!: (value: CribSearchResult[]) => void;
    mockCribSearchAsync.mockImplementationOnce(
      (
        _c: string,
        _cr: string,
        _r: object,
        _ref: object,
        onProgress: (p: number) => void,
      ) => {
        onProgress(0.5);
        return new Promise((resolve) => {
          resolveSearch = resolve;
        });
      },
    );

    await render(<BreakCipher />);

    await fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    await fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(PROGRESS_BAR)).toBeTruthy();
    });

    await act(() => {
      resolveSearch([]);
    });
  });

  it('cancel button stops search and hides progress bar', async () => {
    mockCribSearchAsync.mockImplementationOnce(
      (
        _c: string,
        _cr: string,
        _r: object,
        _ref: object,
        onProgress: (p: number) => void,
      ) => {
        onProgress(0.5);
        return new Promise(() => {
          // never resolves — simulates long-running search
        });
      },
    );

    await render(<BreakCipher />);

    await fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    await fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(CANCEL_SEARCH_BUTTON)).toBeTruthy();
    });

    await fireEvent.press(screen.getByTestId(CANCEL_SEARCH_BUTTON));

    await waitFor(() => {
      expect(screen.queryByTestId(PROGRESS_BAR)).toBeNull();
      expect(screen.queryByTestId(CANCEL_SEARCH_BUTTON)).toBeNull();
    });
  });

  it('crib analysis shows ranked result cards when cribSearchAsync returns results', async () => {
    const mockResult: CribSearchResult = {
      rotorIds: [3, 2, 1],
      reflectorName: 'UKW-B',
      startingPositions: [0, 0, 0],
      cribPosition: 0,
      decryptedText: 'HELLO',
      nlpScore: 80,
      derivedPlugboard: {},
    };
    mockCribSearchAsync.mockImplementationOnce(
      (
        _c: string,
        _cr: string,
        _r: object,
        _ref: object,
        onProgress: (p: number) => void,
      ) => {
        onProgress(1);
        return Promise.resolve([mockResult]);
      },
    );

    await render(<BreakCipher />);

    await fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    await fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(`${BRUTE_FORCE_RESULT_CARD}_0`)).toBeTruthy();
      expect(screen.getByTestId(`${DECRYPTED_TEXT_DISPLAY}_0`)).toBeTruthy();
    });
  });

  it('crib analysis result card shows copy button for decrypted text', async () => {
    const mockResult: CribSearchResult = {
      rotorIds: [3, 2, 1],
      reflectorName: 'UKW-B',
      startingPositions: [0, 0, 0],
      cribPosition: 0,
      decryptedText: 'HELLO',
      nlpScore: 80,
      derivedPlugboard: {},
    };
    mockCribSearchAsync.mockImplementationOnce(
      (
        _c: string,
        _cr: string,
        _r: object,
        _ref: object,
        onProgress: (p: number) => void,
      ) => {
        onProgress(1);
        return Promise.resolve([mockResult]);
      },
    );

    await render(<BreakCipher />);

    await fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    await fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(`${COPY_MESSAGE_BUTTON}_0`)).toBeTruthy();
    });
  });

  it('expands crib position card on press in structural fallback', async () => {
    await render(<BreakCipher />);

    await fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    await fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(`${CRIB_POSITION_CARD}_0`)).toBeTruthy();
    });

    const alignmentId = `${CRIB_POSITION_CARD}_0_alignment`;
    expect(screen.queryByTestId(alignmentId)).toBeNull();

    await fireEvent.press(screen.getByTestId(`${CRIB_POSITION_CARD}_0`));

    expect(screen.getByTestId(alignmentId)).toBeTruthy();
  });

  it('collapses crib position card on second press', async () => {
    await render(<BreakCipher />);

    await fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    await fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(`${CRIB_POSITION_CARD}_0`)).toBeTruthy();
    });

    const firstCard = screen.getByTestId(`${CRIB_POSITION_CARD}_0`);
    await fireEvent.press(firstCard);
    await fireEvent.press(firstCard);

    expect(
      screen.queryByTestId(`${CRIB_POSITION_CARD}_0_alignment`),
    ).toBeNull();
  });

  it('sanitizes ciphertext input to uppercase alpha only', async () => {
    await render(<BreakCipher />);
    await fireEvent.changeText(
      screen.getByTestId(CIPHERTEXT_INPUT),
      'abc 123!',
    );
    expect(screen.getByTestId(CIPHERTEXT_INPUT).props['value']).toBe('ABC');
  });

  it('sanitizes crib input to uppercase alpha only', async () => {
    await render(<BreakCipher />);
    await fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'cr1b!');
    expect(screen.getByTestId(CRIB_INPUT).props['value']).toBe('CRB');
  });
});
