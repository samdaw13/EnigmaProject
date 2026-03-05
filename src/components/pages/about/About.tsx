import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  ABOUT_CODEBREAKERS_BODY,
  ABOUT_CODEBREAKERS_HEADING,
  ABOUT_HISTORY_BODY,
  ABOUT_HISTORY_HEADING,
  ABOUT_HOW_IT_WORKS_BODY,
  ABOUT_HOW_IT_WORKS_HEADING,
  ABOUT_TITLE,
} from '../../../constants/labels';
import { ColorPalette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme/useThemeColors';

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
    title: {
      color: colors.accent,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    section: {
      marginBottom: 24,
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
      marginBottom: 12,
    },
    sectionBody: {
      color: colors.textPrimary,
      fontSize: 15,
      lineHeight: 22,
    },
  });

const AboutSection: FunctionComponent<{ heading: string; body: string }> = ({
  heading,
  body,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeading}>{heading}</Text>
      <View style={styles.sectionDivider} />
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
};

export const About: FunctionComponent = () => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{ABOUT_TITLE}</Text>
        <AboutSection
          heading={ABOUT_HISTORY_HEADING}
          body={ABOUT_HISTORY_BODY}
        />
        <AboutSection
          heading={ABOUT_HOW_IT_WORKS_HEADING}
          body={ABOUT_HOW_IT_WORKS_BODY}
        />
        <AboutSection
          heading={ABOUT_CODEBREAKERS_HEADING}
          body={ABOUT_CODEBREAKERS_BODY}
        />
      </ScrollView>
    </View>
  );
};
