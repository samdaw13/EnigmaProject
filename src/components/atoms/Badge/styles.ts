import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    badge: {
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    badgeText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
