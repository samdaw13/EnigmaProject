import { by, device, element, expect, waitFor } from 'detox';

// testID values — mirrors src/constants/selectors.tsx
const CIPHERTEXT_INPUT = 'ciphertextInput';
const PLAINTEXT_INPUT = 'plaintextInput';
const CRIB_INPUT = 'cribInput';
const RUN_ANALYSIS_BTN = 'runAnalysisButton';
const BRUTE_FORCE_TAB = 'bruteForceTab';
const CRIB_ANALYSIS_TAB = 'cribAnalysisTab';
const RESULTS_CONTAINER = 'resultsContainer';
const CANCEL_BTN = 'cancelSearchButton';

// A short known-good ciphertext + plaintext pair produced from the unit tests
// (rotors 1,2,3 at positions A,A,A, no plugboard): pressing 'A' → 'P'
const SAMPLE_CIPHERTEXT = 'PXBIZ';
const SAMPLE_PLAINTEXT = 'HELLO';

const openDrawerAndNavigateTo = async (screenTitle: string): Promise<void> => {
  // React Navigation drawer toggle has accessibilityLabel 'Open drawer'
  await waitFor(element(by.label('Open drawer')))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.label('Open drawer')).tap();
  await waitFor(element(by.text(screenTitle)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.text(screenTitle)).tap();
};

describe('Break Cipher flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await openDrawerAndNavigateTo('Break a cipher');
  });

  beforeEach(async () => {
    // Stay on Break Cipher — just scroll to top to reset view state
    await element(by.id(CIPHERTEXT_INPUT)).clearText();
  });

  it('shows the Brute Force tab by default', async () => {
    await expect(element(by.id(BRUTE_FORCE_TAB))).toBeVisible();
    await expect(element(by.id(CRIB_ANALYSIS_TAB))).toBeVisible();
    await expect(element(by.id(PLAINTEXT_INPUT))).toBeVisible();
  });

  it('runs brute force with known plaintext and shows results card', async () => {
    await element(by.id(CIPHERTEXT_INPUT)).typeText(SAMPLE_CIPHERTEXT);
    await element(by.id(PLAINTEXT_INPUT)).typeText(SAMPLE_PLAINTEXT);
    await element(by.id(RUN_ANALYSIS_BTN)).tap();

    // Wait for the search to complete and results to appear
    await waitFor(element(by.id(RESULTS_CONTAINER)))
      .toBeVisible()
      .withTimeout(60000);
  });

  it('shows a cancel button while searching', async () => {
    await element(by.id(CIPHERTEXT_INPUT)).typeText(SAMPLE_CIPHERTEXT);
    await element(by.id(RUN_ANALYSIS_BTN)).tap();

    await waitFor(element(by.id(CANCEL_BTN)))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id(CANCEL_BTN)).tap();
  });

  it('switches to Crib Analysis tab', async () => {
    await element(by.id(CRIB_ANALYSIS_TAB)).tap();
    await expect(element(by.id(CRIB_INPUT))).toBeVisible();
    await expect(element(by.id(PLAINTEXT_INPUT))).not.toBeVisible();
  });

  it('runs crib analysis and shows results or structural fallback', async () => {
    await element(by.id(CRIB_ANALYSIS_TAB)).tap();
    await element(by.id(CIPHERTEXT_INPUT)).typeText(SAMPLE_CIPHERTEXT);
    await element(by.id(CRIB_INPUT)).typeText('HE');
    await element(by.id(RUN_ANALYSIS_BTN)).tap();

    await waitFor(element(by.id(RESULTS_CONTAINER)))
      .toBeVisible()
      .withTimeout(60000);
  });
});
