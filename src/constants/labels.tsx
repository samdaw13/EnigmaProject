export const REPLACE_ROTOR = 'Replace rotor';
export const CHANGE_CURRENT_LETTER = 'Change current letter';
export const NO_ROTOR_SELECTED = 'No rotor selected';
export const SELECT_ROTOR = 'Select rotor';
export const SELECT_NEW_LETTER = 'Select new letter';
export const SELECT_INPUT_LETTER_DISPLAY = 'Select input letter';
export const SELECT_OUTPUT_LETTER_DISPLAY = 'Select output letter';
export const ADD_CABLE = 'Add cable to plugboard';
export const ENCRYPT_MESSAGE = 'Encrypt a message';
export const KEYBOARD = 'Keyboard';
export const GO_BACK = 'Go back';
export const COPY_MESSAGE = 'Copy';
export const COPIED_MESSAGE = 'Copied!';

export const BREAK_CIPHER_TITLE = 'Break Cipher';
export const BRUTE_FORCE_TAB = 'Brute Force';
export const CRIB_ANALYSIS_TAB = 'Crib Analysis';
export const CIPHERTEXT_LABEL = 'Ciphertext';
export const KNOWN_PLAINTEXT_LABEL = 'Known plaintext';
export const CRIB_LABEL = 'Crib (suspected word)';
export const RUN_ANALYSIS = 'Run';
export const RUNNING_ANALYSIS = 'Running...';
export const NO_RESULTS = 'No results found';
export const SEARCHING_LABEL = 'Searching...';
export const RESULTS_TITLE = 'Results';
export const ROTOR_ORDER_LABEL = 'Rotors';
export const REFLECTOR_LABEL = 'Reflector';
export const POSITIONS_LABEL = 'Positions';
export const VALID_POSITIONS_LABEL = 'Valid crib positions';
export const POSITION_LABEL = 'Position';
export const KNOWN_PLAINTEXT_HINT =
  'Both methods require some known or suspected plaintext';
export const KNOWN_PLAINTEXT_OPTIONAL_HINT =
  'Known plaintext is optional — omit to search all combinations (ciphertext ≤ 50 chars)';
export const COMMON_CRIBS_HINT = 'Common cribs: WETTER, KEINE, OBERKOMMANDO';
export const CRIB_SEARCH_HINT = 'Common cribs: WETTER, KEINE, OBERKOMMANDO';
export const TAP_TO_EXPAND = 'Tap a position to see alignment';
export const DECRYPTED_TEXT_LABEL = 'Decrypted';
export const NLP_CONFIDENCE_LABEL = 'Confidence';
export const NO_CRIB_RESULTS_FALLBACK =
  'No configurations found — showing structural positions only';
export const CIPHERTEXT_TOO_LONG =
  'Ciphertext must be 50 characters or fewer for keyless brute force';
export const RANKING_RESULTS_LABEL = 'Search complete, ranking results...';
export const CANCEL_LABEL = 'Cancel';

export const SETTINGS_APPEARANCE_HEADING = 'Appearance';
export const SETTINGS_THEME_LABEL = 'Theme';
export const SETTINGS_THEME_DARK = 'Dark';
export const SETTINGS_THEME_LIGHT = 'Light';
export const SETTINGS_MACHINE_HEADING = 'Machine';
export const SETTINGS_RESET_DESCRIPTION =
  'Clears all rotor selections, starting positions, and plugboard cables.';
export const SETTINGS_RESET_BUTTON = 'Reset machine to defaults';
export const SETTINGS_RESET_CONFIRM_TITLE = 'Reset machine?';
export const SETTINGS_RESET_CONFIRM_MESSAGE =
  'This will clear all rotor selections, positions, and plugboard cables.';
export const SETTINGS_RESET_CONFIRM = 'Reset';
export const SETTINGS_RESET_CANCEL = 'Cancel';

export const ABOUT_TITLE = 'The Enigma Machine';

export const ABOUT_HISTORY_HEADING = 'History';
export const ABOUT_HISTORY_BODY =
  'The Enigma machine was a cipher device used by Nazi Germany during World War II to protect military communications. Invented by Arthur Scherbius in the early 1920s and adopted by the German military in the late 1920s, it was considered unbreakable by its operators. Millions of messages were encrypted using Enigma throughout the war.';

export const ABOUT_HOW_IT_WORKS_HEADING = 'How It Works';
export const ABOUT_HOW_IT_WORKS_BODY =
  'Enigma uses a combination of rotors, a plugboard, and a reflector to scramble letters. When a key is pressed, an electrical signal passes through the plugboard (which swaps pairs of letters), then through a series of rotating cipher wheels (rotors), through a reflector that sends the signal back through the rotors in reverse, and finally through the plugboard again before lighting up the encrypted letter.\n\nThe rotors step forward with each keypress — much like an odometer — ensuring that the same letter typed twice in a row produces two different ciphertext letters. This polyalphabetic substitution made Enigma far more secure than simpler ciphers.';

export const ABOUT_CODEBREAKERS_HEADING = 'The Codebreakers';
export const ABOUT_CODEBREAKERS_BODY =
  'Breaking Enigma was a collaborative effort spanning decades. Polish mathematician Marian Rejewski first cracked early Enigma variants in the 1930s using mathematical analysis, sharing his work with British and French intelligence shortly before the war.\n\nAt Bletchley Park, Alan Turing and Gordon Welchman improved on the Polish "Bomba" to create the electromechanical Bombe, a machine that could systematically eliminate incorrect Enigma settings. By exploiting predictable message structures — known as "cribs" — codebreakers could narrow down millions of possible configurations in hours.\n\nThe intelligence produced, codenamed ULTRA, is widely credited with shortening the war by two to four years.';
