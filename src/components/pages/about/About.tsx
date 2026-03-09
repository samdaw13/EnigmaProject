import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ABOUT_CODEBREAKERS_BODY,
  ABOUT_CODEBREAKERS_HEADING,
  ABOUT_HISTORY_BODY,
  ABOUT_HISTORY_HEADING,
  ABOUT_HOW_IT_WORKS_BODY,
  ABOUT_HOW_IT_WORKS_HEADING,
  ABOUT_TITLE,
} from '../../../constants/labels';
import { useThemeColors } from '../../../theme/useThemeColors';
import { AboutSection } from '../../molecules/AboutSection';
import { makeStyles } from './styles';

export const About: FunctionComponent = () => {
  const colors = useThemeColors();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const styles = useMemo(
    () => makeStyles(colors, bottomInset),
    [colors, bottomInset],
  );
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
