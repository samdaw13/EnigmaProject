# Enigma Machine

A React Native TypeScript app simulating a historical Enigma cipher machine. Users configure rotors and a plugboard, then type on a keyboard to encrypt and decrypt messages.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [React Native CLI environment](https://reactnative.dev/docs/environment-setup) set up for your target platform (Android and/or iOS)
- For Android: Android Studio with an emulator or a connected device
- For iOS (macOS only): Xcode with CocoaPods installed

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/EnigmaProject.git
   cd EnigmaProject
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. For iOS, install CocoaPods:

   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

Start the Metro bundler:

```bash
npm run start
```

Then, in a separate terminal, build and run on your target platform:

```bash
# Android
npm run android

# iOS
npm run ios
```

## Testing

Run all tests:

```bash
npm test
```

Run a specific test file:

```bash
npm test -- --testPathPattern=<pattern>
```

## Linting and Formatting

Type-check and lint:

```bash
npm run lint
```

Auto-fix lint issues:

```bash
npm run lint:fix
```

Format with Prettier and fix lint issues:

```bash
npm run format
```

## Project Structure

```
src/
├── components/pages/machine/   # Main Enigma interface (keyboard + settings)
├── constants/                  # UI strings (labels) and testID selectors
├── features/                   # Redux slices (rotors, plugboard, reflector)
├── store/                      # Redux store configuration
├── styles/                     # Shared StyleSheet definitions
├── types/                      # TypeScript interfaces
└── utils/                      # Test utilities
```

## Architecture

- **Navigation:** Drawer navigator with screens for the Enigma Machine, Break Cipher, About, and Settings. The Machine screen uses a nested Stack navigator.
- **State management:** Redux Toolkit with slices for rotors, plugboard, and reflector.
- **Keyboard layout:** Follows the historical German Enigma layout — `QWERTZUIOP / ASDFGHJKL / YXCVBNM`.
