import React from 'react';
import { View, StyleSheet } from 'react-native';

type ProgressBarProps = {
  progress: number; // Value between 0 and 1
  color?: string;
  height?: number;
  backgroundColor?: string;
};

export default function ProgressBar({
  progress,
  color = '#6D28D9',
  height = 10,
  backgroundColor = '#E5E7EB',
}: ProgressBarProps) {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
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