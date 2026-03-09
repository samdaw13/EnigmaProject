import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
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
  });
