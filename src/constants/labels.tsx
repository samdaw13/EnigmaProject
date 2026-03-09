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
export const CRIB_ANALYSIS_TAB = 'Crib Analysis';
export const CIPHERTEXT_LABEL = 'Ciphertext';
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
export const CRIB_PREFIX_LABEL = 'Crib';
export const CRIB_POSITION_LABEL = 'Crib position (optional)';
export const COMMON_CRIBS_HINT = 'Common cribs: WETTER, KEINE, OBERKOMMANDO';
export const TAP_TO_EXPAND = 'Tap a position to see alignment';
export const DECRYPTED_TEXT_LABEL = 'Decrypted';
export const NLP_CONFIDENCE_LABEL = 'Confidence';
export const NO_CRIB_RESULTS_FALLBACK =
  'No configurations found — showing structural positions only';
export const RANKING_RESULTS_LABEL = 'Search complete, ranking results...';
export const PAGE_LABEL = 'Page';
export const PREVIOUS_PAGE_LABEL = 'Previous';
export const NEXT_PAGE_LABEL = 'Next';
export const CANCEL_LABEL = 'Cancel';
export const SEARCH_RUNNING_BACKGROUND_LABEL = 'Search running in background';
export const DERIVED_PLUGBOARD_LABEL = 'Plugboard';

export const SETTINGS_APPEARANCE_HEADING = 'Appearance';
export const SETTINGS_THEME_LABEL = 'Theme';
export const SETTINGS_THEME_DARK = 'Dark';
export const SETTINGS_THEME_LIGHT = 'Light';
export const SETTINGS_THEME_SYSTEM = 'System';
export const SETTINGS_MACHINE_HEADING = 'Machine';
export const SETTINGS_RESET_DESCRIPTION =
  'Clears all rotor selections, starting positions, and plugboard cables.';
export const SETTINGS_RESET_BUTTON = 'Reset machine to defaults';
export const SETTINGS_RESET_CONFIRM_TITLE = 'Reset machine?';
export const SETTINGS_RESET_CONFIRM_MESSAGE =
  'This will clear all rotor selections, positions, and plugboard cables.';
export const SETTINGS_RESET_CONFIRM = 'Reset';
export const SETTINGS_RESET_CANCEL = 'Cancel';

export const RANDOMIZE_SETTINGS = 'Randomize';
export const CLEAR_SETTINGS = 'Clear';

export const PASTE_TEXT = 'Feed text';
export const PASTE_TEXT_PLACEHOLDER = 'Enter text to encrypt / decrypt';
export const PASTE_CONFIRM = 'Feed';

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

export const INFO_CRIB_ANALYSIS_TITLE = 'Crib Analysis';
export const INFO_CRIB_ANALYSIS_CONTENT =
  'A crib is a word or phrase you expect to appear in the plaintext. Common WWII examples include WETTER (weather), KEINE (none), and OBERKOMMANDO.\n\nA key Enigma weakness is that a letter can never encrypt to itself. Wherever you slide the crib along the ciphertext, any position where a crib letter matches the ciphertext letter beneath it is structurally impossible — eliminating many positions instantly.\n\nThe search tests all valid positions across every rotor and reflector combination, returning the top results ranked by NLP confidence.';

export const INFO_SETTINGS_TITLE = 'Machine Settings';
export const INFO_SETTINGS_CONTENT =
  "Configure the Enigma machine before encrypting a message.\n\nRotors: choose which three rotors to use and set each one's starting letter. Order matters — the signal flows left-to-right through the rotors on every keypress, and each rotor steps forward like a digit on an odometer.\n\nPlugboard: add cable pairs to swap letters before and after the signal passes through the rotors. Up to 10 pairs can be connected.\n\nThe same settings that encrypt a message will also decrypt it — type the ciphertext with identical rotor positions and plugboard cables to recover the original text.";

export const SAVE_MESSAGE_LABEL = 'Save';
export const SAVE_MESSAGE_TITLE = 'Save message';
export const SAVE_MESSAGE_PLACEHOLDER = 'Label (e.g. "Test message")';
export const SAVE_RESULTS_LABEL = 'Save results';
export const SAVED_MESSAGES_TITLE = 'Saved messages';
export const SAVED_ANALYSES_TITLE = 'Saved analyses';
export const EMPTY_SAVED_MESSAGES = 'No saved messages yet';
export const EMPTY_SAVED_ANALYSES = 'No saved analyses yet';
export const DELETE_LABEL = 'Delete';

export const INFO_KEYBOARD_TITLE = 'Encrypting & Decrypting';
export const INFO_KEYBOARD_CONTENT =
  'Press any letter key to encrypt it. The rotors step first, then the signal travels through the plugboard, the three rotors, the reflector, back through the rotors in reverse, and through the plugboard again.\n\nThe rotor windows at the top show the current letter for each rotor. The rightmost rotor advances one step on every keypress.\n\nTo decrypt, set the rotors to the same starting positions used when the message was encrypted, then type the ciphertext. The output will be the original plaintext.';
