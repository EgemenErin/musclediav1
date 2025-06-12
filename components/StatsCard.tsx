import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors, getThemeColors } from '@/constants/Colors';

type StatsCardProps = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  accentColor?: string;
};

export default function StatsCard({
  title,
  value,
  icon,
  accentColor = Colors.primary,
}: StatsCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = getThemeColors(isDark);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: isDark ? Colors.black : accentColor,
        },
      ]}
    >
      {icon && (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: accentColor + '15',
              borderRadius: 12,
              padding: 8,
            },
          ]}
        >
          {icon}
        </View>
      )}
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
  },
});
