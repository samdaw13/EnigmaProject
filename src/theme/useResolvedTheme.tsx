import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import type { RootState } from '../store/store';

export const useResolvedTheme = (): 'dark' | 'light' => {
  const theme = useSelector((state: RootState) => state.settings.theme);
  const systemScheme = useColorScheme();

  if (theme === 'system') {
    return systemScheme === 'light' ? 'light' : 'dark';
  }

  return theme;
};
