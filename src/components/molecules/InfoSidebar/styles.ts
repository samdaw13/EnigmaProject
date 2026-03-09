import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

export const SIDEBAR_WIDTH_FRACTION = 0.82;

export const makeStyles = (colors: ColorPalette, sidebarWidth: number) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      flexDirection: 'row',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sidebar: {
      width: sidebarWidth,
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingTop: 48,
      paddingBottom: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    title: {
      color: colors.accent,
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
    },
    body: {
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 22,
    },
  });
