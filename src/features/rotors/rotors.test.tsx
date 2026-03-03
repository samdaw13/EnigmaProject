import reducer, {
  clearSelectedRotor,
  setSelectedRotor,
  updateRotorAvailability,
  updateRotorCurrentIndex,
} from './features';

describe('rotors reducer', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state.selectedSlots).toEqual([null, null, null]);
    expect(state.available[1]).toBeDefined();
    expect(state.available[5]).toBeDefined();
  });

  describe('rotor availability', () => {
    it('updates rotor availability', () => {
      const state = reducer(
        undefined,
        updateRotorAvailability({ id: 1, isAvailable: false }),
      );
      expect(state.available[1].isAvailable).toBe(false);
    });
  });

  describe('rotor current index', () => {
    it('updates rotor current index', () => {
      const state = reducer(
        undefined,
        updateRotorCurrentIndex({ id: 1, currentIndex: 5 }),
      );
      expect(state.available[1].config.currentIndex).toBe(5);
    });
  });

  describe('selected slots', () => {
    it('sets a rotor in a slot', () => {
      const state = reducer(
        undefined,
        setSelectedRotor({ slotIndex: 0, rotorId: 3 }),
      );
      expect(state.selectedSlots).toEqual([3, null, null]);
    });

    it('sets rotors in multiple slots', () => {
      let state = reducer(
        undefined,
        setSelectedRotor({ slotIndex: 0, rotorId: 1 }),
      );
      state = reducer(state, setSelectedRotor({ slotIndex: 1, rotorId: 4 }));
      state = reducer(state, setSelectedRotor({ slotIndex: 2, rotorId: 2 }));
      expect(state.selectedSlots).toEqual([1, 4, 2]);
    });

    it('clears a rotor from a slot', () => {
      let state = reducer(
        undefined,
        setSelectedRotor({ slotIndex: 0, rotorId: 1 }),
      );
      state = reducer(state, setSelectedRotor({ slotIndex: 1, rotorId: 4 }));
      state = reducer(state, setSelectedRotor({ slotIndex: 2, rotorId: 2 }));
      state = reducer(state, clearSelectedRotor({ slotIndex: 1 }));
      expect(state.selectedSlots).toEqual([1, null, 2]);
    });

    it('replaces a rotor in an occupied slot', () => {
      let state = reducer(
        undefined,
        setSelectedRotor({ slotIndex: 0, rotorId: 1 }),
      );
      state = reducer(state, setSelectedRotor({ slotIndex: 0, rotorId: 5 }));
      expect(state.selectedSlots[0]).toBe(5);
    });
  });
});
