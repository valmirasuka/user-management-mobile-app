//
//  error-state.tsx
//  
//
//  Created by Valmira Suka on 2.10.25.
//
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorState({ message, onRetry, showRetry = true }: ErrorStateProps) {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={styles.container}>
      <IconSymbol
        name="exclamationmark.triangle"
        size={48}
        color={iconColor}
        style={styles.icon}
      />
      <ThemedText type="subtitle" style={styles.title}>
        Oops! Something went wrong
      </ThemedText>
      <ThemedText style={styles.message}>
        {message}
      </ThemedText>
      {showRetry && onRetry && (
        <TouchableOpacity style={[styles.retryButton, { borderColor: tintColor }]} onPress={onRetry}>
          <IconSymbol name="arrow.clockwise" size={16} color={tintColor} />
          <ThemedText style={[styles.retryText, { color: tintColor }]}>
            Try Again
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  retryText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
