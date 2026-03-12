import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { findCribPositions } from '../../../codebreaking';
import {
  NO_CRIB_RESULTS_FALLBACK,
  POSITION_LABEL,
  TAP_TO_EXPAND,
  VALID_POSITIONS_LABEL,
} from '../../../constants/labels';
import { CRIB_POSITION_CARD } from '../../../constants/selectors';
import { useThemeColors } from '../../../theme/useThemeColors';
import { makeStyles } from './styles';

const formatPositionAlignment = (
  ciphertext: string,
  crib: string,
  position: number,
): string => {
  const padding = ' '.repeat(position);
  return `${ciphertext}\n${padding}${crib}`;
};

export const CribStructuralFallback: FunctionComponent<{
  ciphertext: string;
  crib: string;
  expandedPosition: number | null;
  onTogglePosition: (pos: number) => void;
}> = ({ ciphertext, crib, expandedPosition, onTogglePosition }) => {
  const positions = findCribPositions(ciphertext, crib);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View>
      <Text style={styles.fallbackHeader}>{NO_CRIB_RESULTS_FALLBACK}</Text>
      <Text style={styles.resultsTitle}>
        {VALID_POSITIONS_LABEL} ({positions.length})
      </Text>
      <Text style={styles.hintText}>{TAP_TO_EXPAND}</Text>
      {positions.map((pos) => (
        <Pressable
          key={pos}
          testID={`${CRIB_POSITION_CARD}_${pos}`}
          onPress={() => onTogglePosition(pos)}
          style={styles.resultCard}
          role='button'
        >
          <Text style={styles.resultText}>
            {POSITION_LABEL} {pos}
          </Text>
          {expandedPosition === pos && (
            <Text
              testID={`${CRIB_POSITION_CARD}_${pos}_alignment`}
              style={styles.alignmentText}
            >
              {formatPositionAlignment(ciphertext, crib, pos)}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
};
