import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    scrollContent: {},
    title: {
      color: colors.accent,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
    },
  });
