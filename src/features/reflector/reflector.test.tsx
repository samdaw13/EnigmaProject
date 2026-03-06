import { configureStore } from '@reduxjs/toolkit';

import reflectorReducer, { selectReflector } from './index';

const createStore = () =>
  configureStore({
    reducer: {
      reflector: reflectorReducer,
    },
  });

describe('Reflector slice', () => {
  it('should have 3 reflectors in initial state', () => {
    const store = createStore();
    const state = store.getState().reflector;
    expect(Object.keys(state.reflectors)).toHaveLength(3);
  });

  it('should have UKW-B (id 2) selected by default', () => {
    const store = createStore();
    const state = store.getState().reflector;
    expect(state.selectedReflectorId).toBe(2);
    expect(state.reflectors[2]!.name).toBe('UKW-B');
  });

  it('should change selected reflector with selectReflector action', () => {
    const store = createStore();
    store.dispatch(selectReflector({ id: 1 }));
    expect(store.getState().reflector.selectedReflectorId).toBe(1);

    store.dispatch(selectReflector({ id: 3 }));
    expect(store.getState().reflector.selectedReflectorId).toBe(3);
  });

  it('should have valid reflector mappings (26 chars, no letter maps to itself)', () => {
    const store = createStore();
    const { reflectors } = store.getState().reflector;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    Object.values(reflectors).forEach((reflector) => {
      const { mapping } = reflector.config;
      expect(mapping).toHaveLength(26);

      mapping.forEach((mappedLetter, index) => {
        expect(mappedLetter).not.toBe(alphabet[index]);
      });
    });
  });
});
