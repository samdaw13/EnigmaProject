# E2E Tests

This directory contains two layers of E2E testing:

| Layer | Tool | Location | When to run |
|---|---|---|---|
| Smoke | Maestro YAML | `smoke/` | Quick navigation checks against a dev build |
| Full E2E | Detox + Jest | `*.test.ts` | Complete user journeys on a real simulator |

---

## Detox E2E tests

Full interaction tests written in TypeScript using [Detox](https://wix.github.io/Detox/). Tests run on a real iOS Simulator or Android Emulator and cover machine setup, encryption, plugboard management, and the Break Cipher feature.

### Prerequisites

- macOS with Xcode installed (for iOS)
- Android SDK and a configured AVD (for Android)
- Detox CLI: `npm install -g detox-cli`

### Build the app for testing

```bash
# iOS
npm run build:e2e:ios

# Android
npm run build:e2e:android
```

### Run the tests

```bash
# iOS simulator (default)
npm run test:e2e

# Android emulator
npm run test:e2e:android

# Run a single test file
npx detox test --configuration ios.sim.debug e2e/machine.test.ts
```

### Test files

| File | Flows covered |
|---|---|
| `machine.test.ts` | Select rotors, navigate to Keyboard, encrypt letters, verify Enigma property, message accumulation, copy button |
| `plugboard.test.ts` | Add cable, verify chip, remove cable, add multiple cables |
| `breakCipher.test.ts` | Navigate via drawer, brute force with known plaintext, cancel search, switch to Crib Analysis, run crib analysis |

### Configuration

- `detox.config.js` — app binary paths, device/emulator targets, build commands
- `jest.e2e.config.js` — separate Jest config so Detox tests never run with `npm test`

Adjust the `avdName` in `detox.config.js` to match your local Android Virtual Device name.

### Element selectors

Tests use `testID` constants from `src/constants/selectors.tsx` directly. The app ships with `testID` props throughout — no changes to app code are needed to run these tests.

---

## Smoke tests (Maestro)

Lightweight smoke tests using [Maestro](https://maestro.mobile.dev/) to verify core navigation flows on a real device or simulator. No code changes or build step required — runs against a Metro dev build.

## Prerequisites

Install the Maestro CLI:

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Verify the installation:

```bash
maestro --version
```

## Running the tests

1. Build and launch the app on a connected device or simulator:

```bash
# Android
npm run android

# iOS
npm run ios
```

2. Run all smoke tests:

```bash
npm run test:e2e:smoke
```

Or run a single flow:

```bash
maestro test e2e/smoke/app-launch.yaml
```

## Flows

| File | What it verifies |
|---|---|
| `smoke/app-launch.yaml` | App launches and the Machine screen is visible |
| `smoke/navigate-break-cipher.yaml` | Drawer opens and navigates to Break Cipher |
| `smoke/navigate-about.yaml` | Drawer opens and navigates to About |
| `smoke/navigate-settings.yaml` | Drawer opens and navigates to Settings |

## Element selectors

Flows use `testID` constants from `src/constants/selectors.tsx` as element IDs (via Maestro's `id` selector). Text assertions use the screen header titles defined in `src/App.tsx`.

## iOS app ID

For iOS, update `appId` in each YAML file to:

```
org.reactjs.native.example.EnigmaProject
```
