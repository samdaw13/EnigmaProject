import { StyleSheet } from 'react-native';

import type { ColorPalette } from '../../../theme/colors';

const CELL_SIZE = 32;

export const makeStyles = (colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: 24,
      marginHorizontal: 16,
      borderRadius: 12,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 20,
    },
    scrollContainer: {
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
    },
    cribRow: {
      flexDirection: 'row',
      marginTop: 2,
    },
    cell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      marginHorizontal: 1,
    },
    cellText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '700',
      fontFamily: 'monospace',
    },
    cribCell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.accent,
      borderWidth: 1,
      borderColor: colors.accent,
      borderRadius: 4,
      marginHorizontal: 1,
    },
    cribCellText: {
      color: colors.background,
      fontSize: 14,
      fontWeight: '700',
      fontFamily: 'monospace',
    },
    emptyCell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      marginHorizontal: 1,
    },
    conflictCell: {
      backgroundColor: colors.destructive,
      borderColor: colors.destructive,
    },
    conflictText: {
      color: '#FFFFFF',
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    positionText: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '500',
      minWidth: 120,
      textAlign: 'center',
    },
    hintText: {
      color: colors.destructive,
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 12,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    button: {
      flex: 1,
    },
  });

export { CELL_SIZE };
