import { by, device, element, expect, waitFor } from 'detox';

// testID values — mirrors src/constants/selectors.tsx and string-utils.tsx
const ADD_CABLE_BTN = 'addCableModal';
const INPUT_LETTER = (index: number) => `inputLetter${index}`;
const OUTPUT_LETTER = (index: number) => `outputLetter${index}`;
const cableChipId = (a: string, b: string) => `${a}${b}`;
const cableChipText = (a: string, b: string) => `${a} -> ${b}`;

// Adds a cable between the letters at the given indices in each selection list.
// Index 0 = 'A', index 1 = 'B', etc.  After 'A' is picked as input, output
// index 0 becomes 'B' (the next available letter).
const addCable = async (
  inputIndex: number,
  outputIndex: number,
): Promise<void> => {
  await element(by.id(ADD_CABLE_BTN)).tap();
  await waitFor(element(by.id(INPUT_LETTER(inputIndex))))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.id(INPUT_LETTER(inputIndex))).tap();
  await waitFor(element(by.id(OUTPUT_LETTER(outputIndex))))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.id(OUTPUT_LETTER(outputIndex))).tap();
};

describe('Plugboard flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('adds a cable between two letters', async () => {
    // Input index 0 = 'A', output index 0 = 'B' (first available after 'A')
    await addCable(0, 0);
    await waitFor(element(by.text(cableChipText('A', 'B'))))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('cable chip shows with correct testID', async () => {
    await addCable(0, 0);
    await expect(element(by.id(cableChipId('A', 'B')))).toBeVisible();
  });

  it('removes a cable and the chip disappears', async () => {
    await addCable(0, 0);
    await waitFor(element(by.text(cableChipText('A', 'B'))))
      .toBeVisible()
      .withTimeout(2000);

    // The Chip close icon is the only 'close' labelled button on screen
    await element(by.label('close')).tap();

    await waitFor(element(by.text(cableChipText('A', 'B'))))
      .not.toBeVisible()
      .withTimeout(2000);
  });

  it('can add multiple cables', async () => {
    // A->B (indices 0,0) then C->D (after A and B are taken: index 2=C, output index 2=E... adjusted)
    // Simpler: just add two cables and verify both chips appear
    await addCable(0, 0); // A -> B
    await addCable(0, 0); // C -> D (A and B now taken; next available input index 0 = C)
    await expect(element(by.text(cableChipText('A', 'B')))).toBeVisible();
    await expect(element(by.text(cableChipText('C', 'D')))).toBeVisible();
  });
});
