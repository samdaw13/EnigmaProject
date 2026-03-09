import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import {
  SETTINGS_APPEARANCE_HEADING,
  SETTINGS_MACHINE_HEADING,
  SETTINGS_RESET_BUTTON,
  SETTINGS_RESET_CANCEL,
  SETTINGS_RESET_CONFIRM,
  SETTINGS_RESET_CONFIRM_MESSAGE,
  SETTINGS_RESET_CONFIRM_TITLE,
  SETTINGS_RESET_DESCRIPTION,
  SETTINGS_THEME_DARK,
  SETTINGS_THEME_LABEL,
  SETTINGS_THEME_LIGHT,
  SETTINGS_THEME_SYSTEM,
} from '../../../constants/labels';
import { clearPlugboard } from '../../../features/plugboard';
import { resetRotors } from '../../../features/rotors/features';
import { persistSettings, setTheme } from '../../../features/settings';
import type { AppDispatch, RootState } from '../../../store/store';
import { useThemeColors } from '../../../theme/useThemeColors';
import type { Theme } from '../../../types';
import { SettingsSection } from '../../molecules/SettingsSection';
import { makeStyles } from './styles';

export const AppSettings: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.settings.theme);
  const colors = useThemeColors();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const styles = useMemo(
    () => makeStyles(colors, bottomInset),
    [colors, bottomInset],
  );

  const handleThemeChange = (value: string) => {
    dispatch(setTheme(value as Theme));
    void dispatch(persistSettings());
  };

  const confirmResetMachine = () => {
    Alert.alert(SETTINGS_RESET_CONFIRM_TITLE, SETTINGS_RESET_CONFIRM_MESSAGE, [
      { text: SETTINGS_RESET_CANCEL, style: 'cancel' },
      {
        text: SETTINGS_RESET_CONFIRM,
        style: 'destructive',
        onPress: () => {
          dispatch(resetRotors());
          dispatch(clearPlugboard());
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SettingsSection heading={SETTINGS_APPEARANCE_HEADING}>
          <Text style={styles.label}>{SETTINGS_THEME_LABEL}</Text>
          <SegmentedButtons
            value={theme}
            onValueChange={handleThemeChange}
            buttons={[
              {
                value: 'dark',
                label: SETTINGS_THEME_DARK,
                uncheckedColor: colors.textPrimary,
              },
              {
                value: 'light',
                label: SETTINGS_THEME_LIGHT,
                uncheckedColor: colors.textPrimary,
              },
              {
                value: 'system',
                label: SETTINGS_THEME_SYSTEM,
                uncheckedColor: colors.textPrimary,
              },
            ]}
            theme={{
              colors: {
                secondaryContainer: colors.accent,
                onSecondaryContainer: colors.background,
                outline: colors.border,
                onSurface: colors.textPrimary,
              },
            }}
          />
        </SettingsSection>
        <SettingsSection heading={SETTINGS_MACHINE_HEADING}>
          <Text style={styles.description}>{SETTINGS_RESET_DESCRIPTION}</Text>
          <Button
            mode='outlined'
            onPress={confirmResetMachine}
            textColor={colors.destructive}
            style={styles.resetButton}
          >
            {SETTINGS_RESET_BUTTON}
          </Button>
        </SettingsSection>
      </ScrollView>
    </View>
  );
};
