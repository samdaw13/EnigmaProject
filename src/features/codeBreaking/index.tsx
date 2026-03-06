import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CribSearchResult } from '../../utils/codebreaking';

export type SearchStatus = 'idle' | 'searching' | 'complete' | 'cancelled';

interface CodeBreakingState {
  status: SearchStatus;
  progress: number;
  cribSearchResults: CribSearchResult[] | null;
  lastCribSearch: { ciphertext: string; crib: string } | null;
}

const initialState: CodeBreakingState = {
  status: 'idle',
  progress: 0,
  cribSearchResults: null,
  lastCribSearch: null,
};

const codeBreakingSlice = createSlice({
  name: 'codeBreaking',
  initialState,
  reducers: {
    searchStarted: (state) => {
      state.status = 'searching';
      state.progress = 0;
      state.cribSearchResults = null;
      state.lastCribSearch = null;
    },
    progressUpdated: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    cribSearchCompleted: (
      state,
      action: PayloadAction<{
        results: CribSearchResult[];
        ciphertext: string;
        crib: string;
      }>,
    ) => {
      state.status = 'complete';
      state.cribSearchResults = action.payload.results;
      state.lastCribSearch = {
        ciphertext: action.payload.ciphertext,
        crib: action.payload.crib,
      };
      state.progress = 1;
    },
    searchCancelled: (state) => {
      state.status = 'cancelled';
      state.progress = 0;
    },
  },
});

export const {
  searchStarted,
  progressUpdated,
  cribSearchCompleted,
  searchCancelled,
} = codeBreakingSlice.actions;

export default codeBreakingSlice.reducer;
