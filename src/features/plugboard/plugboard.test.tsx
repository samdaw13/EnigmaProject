import reducer, { addCable, clearPlugboard, removeCable } from './index';

describe('plugboard reducer', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual({});
  });

  it('addCable adds a cable mapping', () => {
    const state = reducer(
      undefined,
      addCable({ inputLetter: 'A', outputLetter: 'B' }),
    );
    expect(state).toEqual({ A: 'B' });
  });

  it('removeCable removes a cable mapping', () => {
    let state = reducer(
      undefined,
      addCable({ inputLetter: 'A', outputLetter: 'B' }),
    );
    state = reducer(
      state,
      removeCable({ inputLetter: 'A', outputLetter: 'B' }),
    );
    expect(state).toEqual({});
  });

  it('clearPlugboard removes all cables', () => {
    let state = reducer(
      undefined,
      addCable({ inputLetter: 'A', outputLetter: 'B' }),
    );
    state = reducer(state, addCable({ inputLetter: 'C', outputLetter: 'D' }));
    state = reducer(state, clearPlugboard());
    expect(state).toEqual({});
  });
});
