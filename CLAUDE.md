# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native TypeScript app simulating a historical Enigma cipher machine. Users configure rotors and a plugboard, then type on a keyboard to encrypt/decrypt messages.

## Common Commands

- `npm test` — Run all Jest tests
- `npm test -- --testPathPattern=<pattern>` — Run a single test file (e.g. `Keyboard.test`)
- `npm run lint` — TypeScript type-check + ESLint
- `npm run lint:fix` — Auto-fix lint issues
- `npm run format` — Prettier + lint fix
- `npm run start` — Start Metro bundler
- `npm run android` / `npm run ios` — Build and run on device/emulator

## Architecture

**Navigation:** Drawer navigator (App.tsx) with screens: Enigma Machine, Break Cipher, About, Settings. The Machine screen uses a nested Stack navigator (Settings → Keyboard).

**State management:** Redux Toolkit with two slices:
- `rotors` — 5 pre-configured rotors with step indices, letter mappings, and current position. Actions: `updateRotorAvailability`, `updateRotorCurrentIndex`.
- `plugboard` — Key-value letter pair mappings (cables). Actions: `addCable`, `removeCable`.

**Store config:** `src/store/store.tsx`
**Redux slices:** `src/features/rotors/features.tsx`, `src/features/plugboard/index.tsx`
**Types/interfaces:** `src/types/interfaces.tsx`

## Code Layout

- `src/components/pages/machine/` — Main Enigma interface (keyboard + settings with rotors and plugboard)
- `src/constants/labels.tsx` — All UI strings (centralized for i18n readiness)
- `src/constants/selectors.tsx` — testID constants and helper functions (`currentLetter()`, `selectRotorButton()`, `letterButton()`)
- `src/styles/index.tsx` — Shared StyleSheet definitions
- `src/utils/test-utils.tsx` — Custom `render()` wrapping components with Redux store + SafeAreaProvider

## Testing Conventions

- Tests are colocated with components (`.test.tsx` suffix)
- Always use the custom `render` from `src/utils/test-utils.tsx` (provides Redux store + SafeAreaProvider)
- Use testID constants from `src/constants/selectors.tsx` — never hardcode testID strings
- Mock `@react-navigation/native` and `react-native-paper` Portal in component tests
- Framework: Jest + @testing-library/react-native

## Code Style

- Import sorting enforced via `simple-import-sort` ESLint plugin
- Single quotes, trailing commas everywhere, arrow parens always
- Keyboard layout follows German Enigma: `QWERTZUIOP / ASDFGHJKL / YXCVBNM`

### Self-Documenting Code
- **Never use explanatory comments for code blocks**: If you need a comment to explain what a block of code does, extract it into a well-named function/method instead
- Function and method names should clearly communicate their purpose
- Comments should explain *why*, not *what*

### Examples

❌ **Bad:**
```typescript
// Check if letter exists as a value in cables and return the key
let result = letter;
for (const key in cables) {
  if (cables[key] === letter) {
    result = key;
    break;
  }
}
return result;
```

✅ **Good:**
```typescript
const findReverseCableMapping = (letter: string, cables: PlugboardCable): string | undefined => {
  for (const key in cables) {
    if (cables[key] === letter) {
      return key;
    }
  }
  return undefined;
};

return findReverseCableMapping(letter, cables) ?? letter;
```