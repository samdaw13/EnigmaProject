import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import {
  Button,
  Chip,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
  CANCEL_LABEL,
  INFO_BUTTON,
  INFO_KEYBOARD_CONTENT,
  INFO_KEYBOARD_TITLE,
  MESSAGE_DISPLAY,
  OUTPUT_LETTER_DISPLAY,
  PASTE_CONFIRM,
  PASTE_CONFIRM_BUTTON,
  PASTE_TEXT_BUTTON,
  PASTE_TEXT_INPUT,
  PASTE_TEXT_PLACEHOLDER,
} from '../../../../constants';
import { updateRotorCurrentIndex } from '../../../../features/rotors/features';
import type { RootState } from '../../../../store/store';
import { makeKeyboardStyles } from '../../../../styles';
import { useThemeColors } from '../../../../theme/useThemeColors';
import {
  encryptLetter,
  keyboardLetterButton,
  plugboardChipText,
  stepRotors,
} from '../../../../utils';
import { CopyButton } from '../../../common';
import { InfoSidebar } from '../../../InfoSidebar';
import { BackButton } from './BackButton';

export const Keyboard: FunctionComponent = () => {
  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Y', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  const selectedRotorIds = useSelector(
    (state: RootState) => state.rotors.selectedSlots,
  );
  const rotors = useSelector((state: RootState) => state.rotors.available);
  const plugboard = useSelector((state: RootState) => state.plugboard);
  const { reflectors, selectedReflectorId } = useSelector(
    (state: RootState) => state.reflector,
  );
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const keyboardStyles = useMemo(() => makeKeyboardStyles(colors), [colors]);

  const [outputLetter, setOutputLetter] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [infoVisible, setInfoVisible] = useState(false);
  const [pasteVisible, setPasteVisible] = useState(false);
  const [pasteInput, setPasteInput] = useState('');

  const allRotorsSelected = (): boolean =>
    selectedRotorIds.every((id) => id !== null);

  const handleKeyPress = (key: string) => {
    if (!allRotorsSelected()) {
      return;
    }

    const orderedRotors = selectedRotorIds.map((id) => rotors[id as number]);
    const steppedRotors = stepRotors(orderedRotors);

    steppedRotors.forEach((rotor, index) => {
      dispatch(
        updateRotorCurrentIndex({
          id: selectedRotorIds[index] as number,
          currentIndex: rotor.config.currentIndex,
        }),
      );
    });

    const reflector = reflectors[selectedReflectorId];
    const encrypted = encryptLetter(key, steppedRotors, plugboard, reflector);
    setOutputLetter(encrypted);
    setMessage((prev) => prev + encrypted);
  };

  const processTextInput = (text: string) => {
    if (!allRotorsSelected()) return;

    const orderedRotors = selectedRotorIds.map((id) => rotors[id as number]);
    const reflector = reflectors[selectedReflectorId];
    let currentRotors = orderedRotors;
    const results: string[] = [];

    for (const key of text.toUpperCase()) {
      if (!/[A-Z]/.test(key)) continue;
      currentRotors = stepRotors(currentRotors);
      results.push(encryptLetter(key, currentRotors, plugboard, reflector));
    }

    if (results.length === 0) return;

    currentRotors.forEach((rotor, index) => {
      dispatch(
        updateRotorCurrentIndex({
          id: selectedRotorIds[index] as number,
          currentIndex: rotor.config.currentIndex,
        }),
      );
    });

    setOutputLetter(results[results.length - 1]);
    setMessage((prev) => prev + results.join(''));
    setPasteInput('');
    setPasteVisible(false);
  };

  const currentRotorLetter = (slotId: number | null): string => {
    if (slotId === null) return '-';
    const rotor = rotors[slotId];
    return rotor.config.displayedLetters[rotor.config.currentIndex];
  };

  return (
    <View style={keyboardStyles.screen}>
      <Portal>
        <Modal
          visible={pasteVisible}
          onDismiss={() => setPasteVisible(false)}
          contentContainerStyle={keyboardStyles.pasteModal}
        >
          <TextInput
            testID={PASTE_TEXT_INPUT}
            label={PASTE_TEXT_PLACEHOLDER}
            value={pasteInput}
            onChangeText={setPasteInput}
            mode='outlined'
            autoCapitalize='characters'
            style={keyboardStyles.pasteInput}
            textColor={colors.textPrimary}
            outlineColor={colors.border}
            activeOutlineColor={colors.accent}
            theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
          />
          <View style={keyboardStyles.pasteButtonRow}>
            <Button
              mode='outlined'
              textColor={colors.textSecondary}
              style={{ borderColor: colors.border }}
              onPress={() => setPasteVisible(false)}
            >
              {CANCEL_LABEL}
            </Button>
            <Button
              testID={PASTE_CONFIRM_BUTTON}
              mode='contained'
              buttonColor={colors.accent}
              textColor={colors.background}
              disabled={pasteInput.length === 0}
              onPress={() => processTextInput(pasteInput)}
            >
              {PASTE_CONFIRM}
            </Button>
          </View>
        </Modal>
      </Portal>
      <View style={keyboardStyles.headerRow}>
        <BackButton />
        <View style={keyboardStyles.headerActions}>
          <IconButton
            testID={PASTE_TEXT_BUTTON}
            icon='clipboard-text-outline'
            iconColor={colors.textSecondary}
            size={22}
            onPress={() => setPasteVisible(true)}
          />
          <IconButton
            testID={INFO_BUTTON}
            icon='information'
            iconColor={colors.textSecondary}
            size={22}
            onPress={() => setInfoVisible(true)}
          />
        </View>
      </View>

      <View style={keyboardStyles.rotorDisplayRow}>
        {selectedRotorIds.map((slotId, index) => (
          <View key={index} style={keyboardStyles.rotorWindow}>
            <Text style={keyboardStyles.rotorWindowText}>
              {currentRotorLetter(slotId)}
            </Text>
          </View>
        ))}
      </View>

      <View style={keyboardStyles.outputContainer}>
        <Text
          testID={OUTPUT_LETTER_DISPLAY}
          style={keyboardStyles.outputLetter}
        >
          {outputLetter ?? ''}
        </Text>
        <Text testID={MESSAGE_DISPLAY} style={keyboardStyles.messageText}>
          {message}
        </Text>
        {message.length > 0 && <CopyButton text={message} />}
      </View>

      {Object.keys(plugboard).length > 0 && (
        <View style={keyboardStyles.plugboardRow}>
          {Object.keys(plugboard).map((cable) => (
            <Chip
              key={cable}
              mode='flat'
              textStyle={{ color: colors.textPrimary }}
              style={keyboardStyles.plugboardChip}
              theme={{ colors: { secondaryContainer: colors.surfaceAlt } }}
            >
              {plugboardChipText(cable, plugboard[cable])}
            </Chip>
          ))}
        </View>
      )}

      <View style={keyboardStyles.container}>
        {keyboardLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={keyboardStyles.horizontalRow}>
            {row.map((key) => (
              <Button
                key={key}
                testID={keyboardLetterButton(key)}
                mode='outlined'
                compact={true}
                style={keyboardStyles.key}
                theme={{ roundness: 10 }}
                textColor={colors.textPrimary}
                buttonColor={colors.surfaceAlt}
                onPress={() => handleKeyPress(key)}
              >
                {key}
              </Button>
            ))}
          </View>
        ))}
      </View>
      <InfoSidebar
        visible={infoVisible}
        onDismiss={() => setInfoVisible(false)}
        title={INFO_KEYBOARD_TITLE}
        content={INFO_KEYBOARD_CONTENT}
      />
    </View>
  );
};
