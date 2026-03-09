import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    runButton: {
      marginVertical: 12,
    },
    progressButton: {
      height: 40,
      borderRadius: 20,
      marginVertical: 12,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressButtonFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: colors.accent,
    },
    progressButtonLabel: {
      fontSize: 13,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    progressButtonTextClip: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      overflow: 'hidden',
      justifyContent: 'center',
    },
  });
