//
//  loading-spinner.tsx
//  
//
//  Created by Valmira Suka on 2.10.25.
//
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  message = 'Loading...',
  fullScreen = false
}: LoadingSpinnerProps) {
  const tintColor = useThemeColor({}, 'tint');

  if (fullScreen) {
    return (
      <ThemedView style={styles.fullScreenContainer}>
        <ActivityIndicator size={size} color={tintColor} />
        {message && <ThemedText style={styles.message}>{message}</ThemedText>}
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={tintColor} />
      {message && <ThemedText style={styles.message}>{message}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.7,
  },
});

