import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette, bottomInset: number = 0) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40 + bottomInset,
    },
    title: {
      color: colors.accent,
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
    },
  });
