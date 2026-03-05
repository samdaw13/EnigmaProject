import { useSelector } from 'react-redux';

import { RootState } from '../store/store';
import { ColorPalette, getColors } from './colors';

export const useThemeColors = (): ColorPalette => {
  const theme = useSelector((state: RootState) => state.settings.theme);
  return getColors(theme);
};
