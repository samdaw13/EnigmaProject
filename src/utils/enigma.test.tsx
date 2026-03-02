import {
  PlugboardCable,
  ReflectorState,
  RotorState,
} from '../types/interfaces';
import {
  encryptLetter,
  passThroughPlugboard,
  passThroughReflector,
  passThroughRotor,
} from './enigma';

// Rotor I from the app's initial state
const rotorI: RotorState = {
  isAvailable: true,
  config: {
    stepIndex: 2,
    displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    mappedLetters: 'JGDQOXUSCAMIFRVTPNEWKBLZYH'.split(''),
    currentIndex: 0,
  },
  id: 1,
};

// Rotor II
const rotorII: RotorState = {
  isAvailable: true,
  config: {
    stepIndex: 2,
    displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    mappedLetters: 'NTZPSFBOKMWRCJDIVLAEYUXHGQ'.split(''),
    currentIndex: 0,
  },
  id: 2,
};

// Rotor III
const rotorIII: RotorState = {
  isAvailable: true,
  config: {
    stepIndex: 2,
    displayedLetters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    mappedLetters: 'JVIUBHTCDYAKEQZPOSGXNRMWFL'.split(''),
    currentIndex: 0,
  },
  id: 3,
};

// UKW-B reflector
const reflectorB: ReflectorState = {
  id: 2,
  name: 'UKW-B',
  config: {
    mapping: 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''),
  },
};

describe('passThroughPlugboard', () => {
  const cables: PlugboardCable = { A: 'Z', B: 'Y' };

  it('maps a key letter to its value', () => {
    expect(passThroughPlugboard('A', cables)).toBe('Z');
  });

  it('maps a value letter back to its key (bidirectional)', () => {
    expect(passThroughPlugboard('Z', cables)).toBe('A');
  });

  it('returns the letter unchanged if not in cables', () => {
    expect(passThroughPlugboard('C', cables)).toBe('C');
  });

  it('handles empty plugboard', () => {
    expect(passThroughPlugboard('A', {})).toBe('A');
  });
});

describe('passThroughRotor', () => {
  it('forward pass at position 0: A through Rotor I', () => {
    // A is index 0, mappedLetters[0] = 'J', offset 0 → J
    expect(passThroughRotor('A', rotorI, false)).toBe('J');
  });

  it('reverse pass at position 0: J through Rotor I', () => {
    // Reverse of the forward pass above
    expect(passThroughRotor('J', rotorI, true)).toBe('A');
  });

  it('forward pass at non-zero position', () => {
    const rotorAtPos1: RotorState = {
      ...rotorI,
      config: { ...rotorI.config, currentIndex: 1 },
    };
    // Input B (index 1), shifted index = (1+1)%26 = 2, mappedLetters[2] = 'D'
    // Output index of D = 3, adjusted = (3-1+26)%26 = 2 → 'C'
    expect(passThroughRotor('B', rotorAtPos1, false)).toBe('C');
  });

  it('reverse pass at non-zero position', () => {
    const rotorAtPos1: RotorState = {
      ...rotorI,
      config: { ...rotorI.config, currentIndex: 1 },
    };
    // Should be inverse of the forward pass
    expect(passThroughRotor('C', rotorAtPos1, true)).toBe('B');
  });
});

describe('passThroughReflector', () => {
  it('reflects A through UKW-B to Y', () => {
    // UKW-B mapping[0] = 'Y'
    expect(passThroughReflector('A', reflectorB)).toBe('Y');
  });

  it('reflects Y through UKW-B to A', () => {
    // UKW-B: Y is index 24, mapping[24] = 'A'
    expect(passThroughReflector('Y', reflectorB)).toBe('A');
  });

  it('reflects B through UKW-B to R', () => {
    // UKW-B mapping[1] = 'R'
    expect(passThroughReflector('B', reflectorB)).toBe('R');
  });
});

describe('encryptLetter', () => {
  // Rotors ordered right-to-left: [rightmost, middle, leftmost]
  const rotors = [rotorIII, rotorII, rotorI];
  const emptyPlugboard: PlugboardCable = {};

  it('encrypts a letter through the full signal path', () => {
    const result = encryptLetter('A', rotors, emptyPlugboard, reflectorB);
    // Should produce a valid uppercase letter
    expect(result).toMatch(/^[A-Z]$/);
  });

  it('symmetry: encrypting the output returns the original letter', () => {
    const encrypted = encryptLetter('A', rotors, emptyPlugboard, reflectorB);
    const decrypted = encryptLetter(encrypted, rotors, emptyPlugboard, reflectorB);
    expect(decrypted).toBe('A');
  });

  it('a letter never encrypts to itself', () => {
    // Test all 26 letters
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
      const encrypted = encryptLetter(letter, rotors, emptyPlugboard, reflectorB);
      expect(encrypted).not.toBe(letter);
    }
  });

  it('plugboard affects the encryption', () => {
    const cables: PlugboardCable = { A: 'B' };
    const withPlugboard = encryptLetter('A', rotors, cables, reflectorB);
    const withoutPlugboard = encryptLetter('A', rotors, emptyPlugboard, reflectorB);
    // With plugboard A→B swap, encrypting A should give a different result
    expect(withPlugboard).not.toBe(withoutPlugboard);
  });

  it('symmetry holds with plugboard', () => {
    const cables: PlugboardCable = { A: 'Z', B: 'Y', C: 'X' };
    const encrypted = encryptLetter('A', rotors, cables, reflectorB);
    const decrypted = encryptLetter(encrypted, rotors, cables, reflectorB);
    expect(decrypted).toBe('A');
  });

  it('symmetry holds with different rotor positions', () => {
    const rotorsWithOffset: RotorState[] = [
      { ...rotorIII, config: { ...rotorIII.config, currentIndex: 5 } },
      { ...rotorII, config: { ...rotorII.config, currentIndex: 12 } },
      { ...rotorI, config: { ...rotorI.config, currentIndex: 20 } },
    ];
    const encrypted = encryptLetter(
      'H',
      rotorsWithOffset,
      emptyPlugboard,
      reflectorB,
    );
    const decrypted = encryptLetter(
      encrypted,
      rotorsWithOffset,
      emptyPlugboard,
      reflectorB,
    );
    expect(decrypted).toBe('H');
  });
});
