# E2E Smoke Tests

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
