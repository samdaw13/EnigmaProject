import type { FunctionComponent } from 'react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ScrollView as ScrollViewType } from 'react-native';
import { ScrollView, Text, View } from 'react-native';
import { Button, IconButton, Modal } from 'react-native-paper';

import { findConflictIndices } from '../../../codebreaking';
import {
  CRIB_POSITION_CLEAR,
  CRIB_POSITION_CONFIRM,
  CRIB_POSITION_CONFLICT_HINT,
  CRIB_POSITION_MODAL_TITLE,
  POSITION_LABEL,
} from '../../../constants/labels';
import {
  CRIB_POSITION_CLEAR_BUTTON,
  CRIB_POSITION_CONFIRM_BUTTON,
  CRIB_POSITION_INDICATOR,
  CRIB_POSITION_LEFT_ARROW,
  CRIB_POSITION_MODAL,
  CRIB_POSITION_RIGHT_ARROW,
} from '../../../constants/selectors';
import { useThemeColors } from '../../../theme/useThemeColors';
import { CELL_SIZE, makeStyles } from './styles';

interface CribPositionModalProps {
  visible: boolean;
  onDismiss: () => void;
  ciphertext: string;
  crib: string;
  currentPosition: number | undefined;
  onConfirm: (position: number) => void;
  onClear: () => void;
}

export const CribPositionModal: FunctionComponent<CribPositionModalProps> = ({
  visible,
  onDismiss,
  ciphertext,
  crib,
  currentPosition,
  onConfirm,
  onClear,
}) => {
  const maxPosition = Math.max(0, ciphertext.length - crib.length);
  const [position, setPosition] = useState(currentPosition ?? 0);
  const scrollRef = useRef<ScrollViewType>(null);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    if (visible) {
      setPosition(currentPosition ?? 0);
    }
  }, [visible, currentPosition]);

  const scrollToPosition = useCallback(
    (pos: number) => {
      scrollRef.current?.scrollTo({
        x: Math.max(0, (pos + crib.length / 2) * CELL_SIZE - 150),
        animated: true,
      });
    },
    [crib.length],
  );

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => scrollToPosition(position), 100);
      return () => clearTimeout(timer);
    }
  }, [visible, position, scrollToPosition]);

  const conflictIndices = useMemo(
    () => findConflictIndices(ciphertext, crib, position),
    [ciphertext, crib, position],
  );

  const hasConflicts = conflictIndices.length > 0;
  const conflictSet = useMemo(
    () => new Set(conflictIndices),
    [conflictIndices],
  );

  const handleLeft = useCallback(() => {
    setPosition((p) => Math.max(0, p - 1));
  }, []);

  const handleRight = useCallback(() => {
    setPosition((p) => Math.min(maxPosition, p + 1));
  }, [maxPosition]);

  const handleConfirm = useCallback(() => {
    onConfirm(position);
    onDismiss();
  }, [position, onConfirm, onDismiss]);

  const handleClear = useCallback(() => {
    onClear();
    onDismiss();
  }, [onClear, onDismiss]);

  const ciphertextLetters = useMemo(
    () =>
      ciphertext.split('').map((letter, pos) => ({
        key: `ct-${pos}`,
        letter,
        pos,
      })),
    [ciphertext],
  );

  const ciphertextCells = useMemo(
    () =>
      ciphertextLetters.map(({ key, letter, pos }) => {
        const cribIndex = pos - position;
        const isConflict =
          cribIndex >= 0 &&
          cribIndex < crib.length &&
          conflictSet.has(cribIndex);
        return (
          <View
            key={key}
            style={[styles.cell, isConflict && styles.conflictCell]}
          >
            <Text style={[styles.cellText, isConflict && styles.conflictText]}>
              {letter}
            </Text>
          </View>
        );
      }),
    [ciphertextLetters, position, crib.length, conflictSet, styles],
  );

  const cribLetters = useMemo(
    () =>
      crib.split('').map((letter, pos) => ({
        key: `cr-${pos}`,
        letter,
        pos,
      })),
    [crib],
  );

  const cribCells = useMemo(() => {
    const cells: React.ReactNode[] = [];
    for (let s = 0; s < position; s++) {
      cells.push(<View key={`sp-${s}`} style={styles.emptyCell} />);
    }
    cribLetters.forEach(({ key, letter, pos }) => {
      const isConflict = conflictSet.has(pos);
      cells.push(
        <View
          key={key}
          style={[styles.cribCell, isConflict && styles.conflictCell]}
        >
          <Text
            style={[styles.cribCellText, isConflict && styles.conflictText]}
          >
            {letter}
          </Text>
        </View>,
      );
    });
    return cells;
  }, [cribLetters, position, conflictSet, styles]);

  return (
    <Modal
      testID={CRIB_POSITION_MODAL}
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>{CRIB_POSITION_MODAL_TITLE}</Text>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        <View>
          <View style={styles.row}>{ciphertextCells}</View>
          <View style={styles.cribRow}>{cribCells}</View>
        </View>
      </ScrollView>

      <View style={styles.navRow}>
        <IconButton
          testID={CRIB_POSITION_LEFT_ARROW}
          icon='chevron-left'
          onPress={handleLeft}
          disabled={position === 0}
          iconColor={colors.textPrimary}
        />
        <Text testID={CRIB_POSITION_INDICATOR} style={styles.positionText}>
          {POSITION_LABEL} {position + 1} of {maxPosition + 1}
        </Text>
        <IconButton
          testID={CRIB_POSITION_RIGHT_ARROW}
          icon='chevron-right'
          onPress={handleRight}
          disabled={position === maxPosition}
          iconColor={colors.textPrimary}
        />
      </View>

      {hasConflicts && (
        <Text style={styles.hintText}>{CRIB_POSITION_CONFLICT_HINT}</Text>
      )}

      <View style={styles.buttonRow}>
        <Button
          testID={CRIB_POSITION_CLEAR_BUTTON}
          mode='outlined'
          onPress={handleClear}
          style={styles.button}
          textColor={colors.textSecondary}
        >
          {CRIB_POSITION_CLEAR}
        </Button>
        <Button
          testID={CRIB_POSITION_CONFIRM_BUTTON}
          mode='contained'
          onPress={handleConfirm}
          disabled={hasConflicts}
          style={styles.button}
          buttonColor={colors.accent}
          textColor={colors.background}
          theme={{
            colors: {
              surfaceDisabled: colors.disabledSurface,
              onSurfaceDisabled: colors.disabledText,
            },
          }}
        >
          {CRIB_POSITION_CONFIRM}
        </Button>
      </View>
    </Modal>
  );
};
