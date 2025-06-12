import React from 'react';
import {
  ScrollView,
  View,
  Platform,
  ScrollViewProps,
  ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeTabViewProps extends ScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewProps['style'];
  useScrollView?: boolean;
}

export default function SafeTabView({
  children,
  contentContainerStyle,
  useScrollView = true,
  ...props
}: SafeTabViewProps) {
  const insets = useSafeAreaInsets();

  // Calculate bottom padding for content
  const tabBarHeight = 60;
  const bottomPadding =
    Platform.OS === 'android' ? Math.max(insets.bottom, 8) : 8;
  const totalBottomPadding = tabBarHeight + bottomPadding + 16; // 16 for extra spacing

  const paddingStyle = { paddingBottom: totalBottomPadding };

  if (useScrollView) {
    return (
      <ScrollView
        {...props}
        contentContainerStyle={[contentContainerStyle, paddingStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[{ flex: 1 }, contentContainerStyle, paddingStyle]}>
      {children}
    </View>
  );
}
