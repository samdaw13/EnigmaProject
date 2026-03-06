import { getColors } from './colors';
import { useResolvedTheme } from './useResolvedTheme';

export const useThemeColors = () => {
  const resolvedTheme = useResolvedTheme();
  return getColors(resolvedTheme);
};
