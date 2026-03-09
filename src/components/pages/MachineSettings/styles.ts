import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette, bottomInset: number = 0) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    bottomSection: {
      paddingHorizontal: 16,
      paddingBottom: 16 + bottomInset,
      gap: 8,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
    },
    rowButton: {
      flex: 1,
    },
  });
