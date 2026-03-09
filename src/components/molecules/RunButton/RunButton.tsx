import type { FunctionComponent } from 'react';
import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import {
  RANKING_RESULTS_LABEL,
  RUN_ANALYSIS,
  SEARCHING_LABEL,
} from '../../../constants/labels';
import {
  PROGRESS_BAR,
  RUN_ANALYSIS_BUTTON,
} from '../../../constants/selectors';
import { useThemeColors } from '../../../theme/useThemeColors';
import { makeStyles } from './styles';

export const RunButton: FunctionComponent<{
  isSearching: boolean;
  progress: number;
  disabled: boolean;
  onPress: () => void;
}> = ({ isSearching, progress, disabled, onPress }) => {
  const [buttonWidth, setButtonWidth] = useState(0);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (isSearching) {
    const statusLabel = progress >= 1 ? RANKING_RESULTS_LABEL : SEARCHING_LABEL;
    const fillWidth = Math.min(Math.round(progress * buttonWidth), buttonWidth);
    return (
      <View
        testID={RUN_ANALYSIS_BUTTON}
        style={styles.progressButton}
        onLayout={(e) => setButtonWidth(e.nativeEvent.layout.width)}
      >
        <Text
          style={[styles.progressButtonLabel, { color: colors.textPrimary }]}
        >
          {statusLabel}
        </Text>
        <View
          testID={PROGRESS_BAR}
          style={[styles.progressButtonFill, { width: fillWidth }]}
        />
        <View style={[styles.progressButtonTextClip, { width: fillWidth }]}>
          <View style={{ width: buttonWidth, alignItems: 'center' }}>
            <Text
              style={[styles.progressButtonLabel, { color: colors.background }]}
            >
              {statusLabel}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  return (
    <Button
      testID={RUN_ANALYSIS_BUTTON}
      mode='contained'
      onPress={onPress}
      style={styles.runButton}
      buttonColor={colors.accent}
      textColor={colors.background}
      disabled={disabled}
      theme={{
        colors: {
          surfaceDisabled: colors.disabledSurface,
          onSurfaceDisabled: colors.disabledText,
        },
      }}
    >
      {RUN_ANALYSIS}
    </Button>
  );
};
