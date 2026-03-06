import { by, device, element, expect, waitFor } from 'detox';

// testID helpers — mirrors src/utils/string-utils.tsx
const selectRotorButton = (id: number) => `selectRotorBtn${id}`;
const keyboardLetter = (letter: string) => `keyboardLetter_${letter}`;

const SET_ROTOR_BTN = 'selectRotorBtn';
const REPLACE_ROTOR_BTN = 'replaceRotorBtn';
const ENCRYPT_MESSAGE_BTN = 'goToKeyboardButton';
const OUTPUT_LETTER = 'outputLetterDisplay';
const MESSAGE = 'messageDisplay';

const selectRotor = async (rotorId: number): Promise<void> => {
  // Tap the first still-unset rotor slot button
  await element(by.id(SET_ROTOR_BTN)).atIndex(0).tap();
  await waitFor(element(by.id(selectRotorButton(rotorId))))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.id(selectRotorButton(rotorId))).tap();
};

const setupThreeRotors = async (): Promise<void> => {
  await selectRotor(1);
  await selectRotor(2);
  await selectRotor(3);
};

const navigateToKeyboard = async (): Promise<void> => {
  await element(by.id(ENCRYPT_MESSAGE_BTN)).tap();
};

describe('Machine flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('selects three rotors from the Settings screen', async () => {
    await setupThreeRotors();
    // All three slots are now set — no unset slot button should remain
    await expect(element(by.id(SET_ROTOR_BTN))).not.toBeVisible();
    // Each slot now shows a Replace button
    await expect(element(by.id(REPLACE_ROTOR_BTN)).atIndex(0)).toBeVisible();
  });

  it('navigates to the Keyboard screen after selecting rotors', async () => {
    await setupThreeRotors();
    await navigateToKeyboard();
    await expect(element(by.id(OUTPUT_LETTER))).toBeVisible();
  });

  it('shows an encrypted output letter when a key is pressed', async () => {
    await setupThreeRotors();
    await navigateToKeyboard();
    await element(by.id(keyboardLetter('A'))).tap();
    await waitFor(element(by.id(OUTPUT_LETTER)))
      .not.toHaveText('')
      .withTimeout(2000);
    await expect(element(by.id(OUTPUT_LETTER))).toBeVisible();
  });

  it('never encrypts a letter to itself (Enigma property)', async () => {
    await setupThreeRotors();
    await navigateToKeyboard();
    await element(by.id(keyboardLetter('A'))).tap();
    await expect(element(by.id(OUTPUT_LETTER))).not.toHaveText('A');
  });

  it('accumulates the message as more letters are pressed', async () => {
    await setupThreeRotors();
    await navigateToKeyboard();
    await element(by.id(keyboardLetter('H'))).tap();
    await element(by.id(keyboardLetter('E'))).tap();
    await element(by.id(keyboardLetter('L'))).tap();
    await waitFor(element(by.id(MESSAGE)))
      .not.toHaveText('')
      .withTimeout(2000);
  });

  it('shows the copy button once a message exists', async () => {
    await setupThreeRotors();
    await navigateToKeyboard();
    await element(by.id(keyboardLetter('A'))).tap();
    await waitFor(element(by.text('Copy')))
      .toBeVisible()
      .withTimeout(2000);
  });
});
