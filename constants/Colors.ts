export const Colors = {
  // Primary Brand Colors
  primary: '#FBBC05',      // Golden yellow
  primaryDark: '#E6A800',  // Darker golden yellow
  primaryLight: '#FFCC33', // Lighter golden yellow
  
  // Dark Theme
  dark: {
    background: '#0E121A',     // Main dark background
    surface: '#1A1F2E',       // Card/surface background
    surfaceLight: '#252B3A',  // Lighter surface
    text: '#FFFFFF',          // Primary text
    textSecondary: '#B0B8C4', // Secondary text
    textMuted: '#7A8194',     // Muted text
    border: '#2A3441',        // Border color
    accent: '#FBBC05',        // Accent color (golden)
    accentSecondary: '#FF6B35', // Secondary accent (orange)
    success: '#10B981',       // Success green
    warning: '#F59E0B',       // Warning amber
    error: '#EF4444',         // Error red
    info: '#3B82F6',          // Info blue
  },
  
  // Light Theme
  light: {
    background: '#FFFFFF',    // Light background
    surface: '#F8FAFC',       // Card/surface background
    surfaceLight: '#F1F5F9',  // Lighter surface
    text: '#0E121A',          // Primary text (using dark color)
    textSecondary: '#475569', // Secondary text
    textMuted: '#64748B',     // Muted text
    border: '#E2E8F0',        // Border color
    accent: '#FBBC05',        // Accent color (golden)
    accentSecondary: '#FF6B35', // Secondary accent (orange)
    success: '#10B981',       // Success green
    warning: '#F59E0B',       // Warning amber
    error: '#EF4444',         // Error red
    info: '#3B82F6',          // Info blue
  },
  
  // Common colors that work in both themes
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Gradient combinations
  gradients: {
    primary: ['#FBBC05', '#E6A800'],
    dark: ['#0E121A', '#1A1F2E'],
    accent: ['#FBBC05', '#FF6B35'],
  },
  
  // Status colors with opacity variants
  status: {
    success: {
      main: '#10B981',
      light: 'rgba(16, 185, 129, 0.1)',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: 'rgba(245, 158, 11, 0.1)',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: 'rgba(239, 68, 68, 0.1)',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6',
      light: 'rgba(59, 130, 246, 0.1)',
      dark: '#2563EB',
    },
  },
};

// Helper function to get theme colors
export const getThemeColors = (isDark: boolean) => {
  return isDark ? Colors.dark : Colors.light;
};

// Helper function for opacity
export const withOpacity = (color: string, opacity: number) => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}; 