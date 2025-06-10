import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type StatsCardProps = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
};

export default function StatsCard({
  title,
  value,
  icon,
  bgColor = '#FFFFFF',
  textColor = '#111827',
}: StatsCardProps) {
  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
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