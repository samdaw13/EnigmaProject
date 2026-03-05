import { Theme } from '../types';

export interface ColorPalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  destructive: string;
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
};

export const getColors = (theme: Theme): ColorPalette =>
  theme === 'light' ? lightColors : darkColors;
