import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, SegmentedButtons } from 'react-native-paper';
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
import type { ColorPalette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/useThemeColors';
import type { Theme } from '../../../types';

const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    section: {
      marginBottom: 32,
    },
    sectionHeading: {
      color: colors.accent,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 16,
    },
    label: {
      color: colors.textPrimary,
      fontSize: 15,
      marginBottom: 12,
    },
    description: {
      color: colors.textSecondary,
      fontSize: 13,
      marginBottom: 12,
    },
    resetButton: {
      borderColor: colors.destructive,
    },
  });

const SettingsSection: FunctionComponent<{
  heading: string;
  children: React.ReactNode;
}> = ({ heading, children }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      <View style={styles.sectionDivider} />
      {children}
    </View>
  );
};

export const Settings: FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.settings.theme);
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

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
              { value: 'dark', label: SETTINGS_THEME_DARK },
              { value: 'light', label: SETTINGS_THEME_LIGHT },
              { value: 'system', label: SETTINGS_THEME_SYSTEM },
            ]}
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
