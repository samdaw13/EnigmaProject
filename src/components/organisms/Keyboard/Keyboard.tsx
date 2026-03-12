import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
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
  SAVE_MESSAGE_BUTTON,
  SAVE_MESSAGE_CONFIRM_BUTTON,
  SAVE_MESSAGE_INPUT,
  SAVE_MESSAGE_LABEL,
  SAVE_MESSAGE_MODAL,
  SAVE_MESSAGE_PLACEHOLDER,
  SAVE_MESSAGE_TITLE,
} from '../../../constants';
import { updateRotorCurrentIndex } from '../../../features/rotors/features';
import type { RootState } from '../../../store/store';
import { useThemeColors } from '../../../theme/useThemeColors';
import type { SavedMessage } from '../../../types/interfaces';
import {
  encryptLetter,
  keyboardLetterButton,
  plugboardChipText,
  stepRotors,
} from '../../../utils';
import { addSavedMessage } from '../../../utils/storage';
import { BackButton } from '../../atoms/BackButton';
import { CopyButton } from '../../atoms/CopyButton';
import { InfoSidebar } from '../../molecules/InfoSidebar';
import { Page } from '../../templates/Page';
import { makeStyles } from './styles';

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
  const keyboardStyles = useMemo(() => makeStyles(colors), [colors]);

  const navigation = useNavigation();
  const [outputLetter, setOutputLetter] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [infoVisible, setInfoVisible] = useState(false);
  const [pasteVisible, setPasteVisible] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [saveVisible, setSaveVisible] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');
  const [startingPositions, setStartingPositions] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        headerRight: () => (
          <IconButton
            testID={INFO_BUTTON}
            icon='information'
            iconColor={colors.textSecondary}
            size={22}
            onPress={() => setInfoVisible(true)}
          />
        ),
      });
    }, [navigation, colors.textSecondary, setInfoVisible]),
  );

  const allRotorsSelected = (): boolean =>
    selectedRotorIds.every((id) => id !== null);

  const captureStartingPositions = () => {
    if (message.length === 0) {
      setStartingPositions(
        selectedRotorIds.map((id) =>
          id !== null ? rotors[id]!.config.currentIndex : 0,
        ),
      );
    }
  };

  const handleSaveMessage = () => {
    const saved: SavedMessage = {
      id: Date.now().toString(),
      label: saveLabel.trim() || message.slice(0, 20),
      plaintext: '',
      ciphertext: message,
      rotorIds: selectedRotorIds.filter((id): id is number => id !== null),
      rotorStartingPositions: startingPositions,
      reflectorId: selectedReflectorId,
      plugboardCables: { ...plugboard },
      timestamp: Date.now(),
    };
    void addSavedMessage(saved);
    setSaveVisible(false);
    setSaveLabel('');
  };

  const handleKeyPress = (key: string) => {
    if (!allRotorsSelected()) {
      return;
    }

    captureStartingPositions();
    const orderedRotors = selectedRotorIds.map((id) => rotors[id as number]!);
    const steppedRotors = stepRotors(orderedRotors);

    steppedRotors.forEach((rotor, index) => {
      dispatch(
        updateRotorCurrentIndex({
          id: selectedRotorIds[index] as number,
          currentIndex: rotor.config.currentIndex,
        }),
      );
    });

    const reflector = reflectors[selectedReflectorId]!;
    const encrypted = encryptLetter(key, steppedRotors, plugboard, reflector);
    setOutputLetter(encrypted);
    setMessage((prev) => prev + encrypted);
  };

  const processTextInput = (text: string) => {
    if (!allRotorsSelected()) return;

    captureStartingPositions();
    const orderedRotors = selectedRotorIds.map((id) => rotors[id as number]!);
    const reflector = reflectors[selectedReflectorId]!;
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

    setOutputLetter(results[results.length - 1]!);
    setMessage((prev) => prev + results.join(''));
    setPasteInput('');
    setPasteVisible(false);
  };

  const currentRotorLetter = (slotId: number | null): string => {
    if (slotId === null) return '-';
    const rotor = rotors[slotId]!;
    return rotor.config.displayedLetters[rotor.config.currentIndex]!;
  };

  return (
    <Page scrollable={false} style={keyboardStyles.noPadding}>
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
            accessibilityRole='search'
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
              theme={{
                colors: {
                  surfaceDisabled: colors.disabledSurface,
                  onSurfaceDisabled: colors.disabledText,
                },
              }}
              onPress={() => processTextInput(pasteInput)}
            >
              {PASTE_CONFIRM}
            </Button>
          </View>
        </Modal>
        <Modal
          testID={SAVE_MESSAGE_MODAL}
          visible={saveVisible}
          onDismiss={() => setSaveVisible(false)}
          contentContainerStyle={keyboardStyles.pasteModal}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            {SAVE_MESSAGE_TITLE}
          </Text>
          <TextInput
            testID={SAVE_MESSAGE_INPUT}
            label={SAVE_MESSAGE_PLACEHOLDER}
            value={saveLabel}
            onChangeText={setSaveLabel}
            mode='outlined'
            style={keyboardStyles.pasteInput}
            textColor={colors.textPrimary}
            outlineColor={colors.border}
            activeOutlineColor={colors.accent}
            theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
            accessibilityRole='text'
          />
          <View style={keyboardStyles.pasteButtonRow}>
            <Button
              mode='outlined'
              textColor={colors.textSecondary}
              style={{ borderColor: colors.border }}
              onPress={() => setSaveVisible(false)}
            >
              {CANCEL_LABEL}
            </Button>
            <Button
              testID={SAVE_MESSAGE_CONFIRM_BUTTON}
              mode='contained'
              buttonColor={colors.accent}
              textColor={colors.background}
              onPress={handleSaveMessage}
            >
              {SAVE_MESSAGE_LABEL}
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
        </View>
      </View>

      <View style={keyboardStyles.rotorDisplayRow}>
        {selectedRotorIds.map((slotId, index) => (
          <View
            key={(['left', 'middle', 'right'] as const)[index]}
            style={keyboardStyles.rotorWindow}
          >
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
        {message.length > 0 && (
          <>
            <CopyButton text={message} />
            <Button
              testID={SAVE_MESSAGE_BUTTON}
              mode='text'
              compact={true}
              textColor={colors.textPrimary}
              onPress={() => setSaveVisible(true)}
            >
              {SAVE_MESSAGE_LABEL}
            </Button>
          </>
        )}
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
              {plugboardChipText(cable, plugboard[cable]!)}
            </Chip>
          ))}
        </View>
      )}

      <View style={keyboardStyles.container}>
        {keyboardLayout.map((row) => (
          <View key={row.join('')} style={keyboardStyles.horizontalRow}>
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
    </Page>
  );
};
