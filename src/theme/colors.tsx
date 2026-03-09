export interface ColorPalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  destructive: string;
  disabledSurface: string;
  disabledText: string;
}

export const darkColors: ColorPalette = {
  background: '#1a1a1a',
  surface: '#2a2a2a',
  surfaceAlt: '#3a3530',
  border: '#5a534d',
  textPrimary: '#F5F0E8',
  textSecondary: '#E0E0E0',
  accent: '#FFD700',
  destructive: '#9c2a2a',
  disabledSurface: '#3a3a3a',
  disabledText: '#666666',
};

export const lightColors: ColorPalette = {
  background: '#F5F0E8',
  surface: '#E8E0D0',
  surfaceAlt: '#D4C9B5',
  border: '#8B7D6B',
  textPrimary: '#1A1A1A',
  textSecondary: '#5A4A3A',
  accent: '#B8860B',
  destructive: '#9c2a2a',
  disabledSurface: '#C5BAA8',
  disabledText: '#7A6A5A',
};

export const nlpColors = {
  high: '#4CAF50',
  medium: '#FFC107',
  low: '#F44336',
} as const;

export const getColors = (theme: 'dark' | 'light'): ColorPalette =>
  theme === 'light' ? lightColors : darkColors;
