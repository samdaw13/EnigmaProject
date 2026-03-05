import { useSelector } from 'react-redux';

import type { RootState } from '../store/store';
import { getColors } from './colors';

export const useThemeColors = () => {
  const theme = useSelector((state: RootState) => state.settings.theme);
  return getColors(theme);
};
