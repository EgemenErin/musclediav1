import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Colors, getThemeColors } from '@/constants/Colors';

type ProgressBarProps = {
  progress: number; // Value between 0 and 1
  color?: string;
  height?: number;
};

export default function ProgressBar({
  progress,
  color = Colors.primary,
  height = 12,
}: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: theme.surfaceLight,
          borderWidth: 1,
          borderColor: theme.border,
        },
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});
