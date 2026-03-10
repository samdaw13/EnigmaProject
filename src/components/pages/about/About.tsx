import type { FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { Text } from 'react-native';

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
import { Page } from '../../templates/Page';
import { makeStyles } from './styles';

export const About: FunctionComponent = () => {
  const colors = useThemeColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <Page contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{ABOUT_TITLE}</Text>
      <AboutSection heading={ABOUT_HISTORY_HEADING} body={ABOUT_HISTORY_BODY} />
      <AboutSection
        heading={ABOUT_HOW_IT_WORKS_HEADING}
        body={ABOUT_HOW_IT_WORKS_BODY}
      />
      <AboutSection
        heading={ABOUT_CODEBREAKERS_HEADING}
        body={ABOUT_CODEBREAKERS_BODY}
      />
    </Page>
  );
};
