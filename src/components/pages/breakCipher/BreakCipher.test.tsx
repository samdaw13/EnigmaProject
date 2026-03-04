import React from 'react';

import {
  BRUTE_FORCE_TAB_BUTTON,
  CIPHERTEXT_INPUT,
  CRIB_ANALYSIS_TAB_BUTTON,
  CRIB_INPUT,
  CRIB_POSITION_CARD,
  PLAINTEXT_INPUT,
  PROGRESS_BAR,
  RESULTS_CONTAINER,
  RUN_ANALYSIS_BUTTON,
} from '../../../constants/selectors';
import {
  BruteForceResult,
  bruteForceSearchAsync,
} from '../../../utils/codebreaking';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../utils/test-utils';
import { BreakCipher } from './BreakCipher';

jest.mock('react-native-paper', () => {
  const RNPaper = jest.requireActual<object>('react-native-paper');
  return {
    ...RNPaper,
    Portal: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../../utils/codebreaking', () => {
  const actual = jest.requireActual<object>('../../../utils/codebreaking');
  return {
    ...actual,
    bruteForceSearchAsync: jest.fn(
      (
        _ciphertext: string,
        _plaintext: string,
        _rotors: object,
        _reflectors: object,
        onProgress: (p: number) => void,
      ) => {
        onProgress(0.5);
        onProgress(1);
        return Promise.resolve([
          {
            rotorIds: [3, 2, 1],
            reflectorName: 'UKW-B',
            startingPositions: [0, 0, 0],
          },
        ]);
      },
    ),
  };
});

const mockBruteForceSearchAsync = bruteForceSearchAsync as jest.MockedFunction<
  typeof bruteForceSearchAsync
>;

describe('BreakCipher', () => {
  it('renders the brute force tab by default', () => {
    render(<BreakCipher />);
    expect(screen.getByTestId(CIPHERTEXT_INPUT)).toBeTruthy();
    expect(screen.getByTestId(PLAINTEXT_INPUT)).toBeTruthy();
    expect(screen.getByTestId(RUN_ANALYSIS_BUTTON)).toBeTruthy();
  });

  it('switches to crib analysis tab', () => {
    render(<BreakCipher />);
    fireEvent.press(screen.getByTestId(CRIB_ANALYSIS_TAB_BUTTON));
    expect(screen.getByTestId(CRIB_INPUT)).toBeTruthy();
    expect(screen.queryByTestId(PLAINTEXT_INPUT)).toBeNull();
  });

  it('switches back to brute force tab', () => {
    render(<BreakCipher />);
    fireEvent.press(screen.getByTestId(CRIB_ANALYSIS_TAB_BUTTON));
    fireEvent.press(screen.getByTestId(BRUTE_FORCE_TAB_BUTTON));
    expect(screen.getByTestId(PLAINTEXT_INPUT)).toBeTruthy();
    expect(screen.queryByTestId(CRIB_INPUT)).toBeNull();
  });

  it('runs crib analysis and displays valid positions', () => {
    render(<BreakCipher />);
    fireEvent.press(screen.getByTestId(CRIB_ANALYSIS_TAB_BUTTON));

    fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    expect(screen.getByTestId(RESULTS_CONTAINER)).toBeTruthy();
  });

  it('runs brute force and displays results', async () => {
    render(<BreakCipher />);

    fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABC');
    fireEvent.changeText(screen.getByTestId(PLAINTEXT_INPUT), 'XYZ');
    fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(RESULTS_CONTAINER)).toBeTruthy();
    });
  });

  it('shows progress bar during brute force search', async () => {
    let resolveSearch!: (value: BruteForceResult[]) => void;
    mockBruteForceSearchAsync.mockImplementationOnce(
      (
        _c: string,
        _p: string,
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

    render(<BreakCipher />);

    fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABC');
    fireEvent.changeText(screen.getByTestId(PLAINTEXT_INPUT), 'XYZ');
    fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    await waitFor(() => {
      expect(screen.getByTestId(PROGRESS_BAR)).toBeTruthy();
    });

    await act(() => {
      resolveSearch([]);
    });
  });

  it('expands crib position card on press', () => {
    render(<BreakCipher />);
    fireEvent.press(screen.getByTestId(CRIB_ANALYSIS_TAB_BUTTON));

    fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    const firstCard = screen.getByTestId(`${CRIB_POSITION_CARD}_0`);
    expect(firstCard).toBeTruthy();

    const alignmentId = `${CRIB_POSITION_CARD}_0_alignment`;
    expect(screen.queryByTestId(alignmentId)).toBeNull();

    fireEvent.press(firstCard);

    expect(screen.getByTestId(alignmentId)).toBeTruthy();
  });

  it('collapses crib position card on second press', () => {
    render(<BreakCipher />);
    fireEvent.press(screen.getByTestId(CRIB_ANALYSIS_TAB_BUTTON));

    fireEvent.changeText(screen.getByTestId(CIPHERTEXT_INPUT), 'ABCDEF');
    fireEvent.changeText(screen.getByTestId(CRIB_INPUT), 'XY');
    fireEvent.press(screen.getByTestId(RUN_ANALYSIS_BUTTON));

    const firstCard = screen.getByTestId(`${CRIB_POSITION_CARD}_0`);
    fireEvent.press(firstCard);
    fireEvent.press(firstCard);

    expect(
      screen.queryByTestId(`${CRIB_POSITION_CARD}_0_alignment`),
    ).toBeNull();
  });
});
