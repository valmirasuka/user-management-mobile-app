//
//  search-input.tsx
//  
//
//  Created by Valmira Suka on 3.10.25.
//
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  showResultsCount?: boolean;
  resultsCount?: number;
  isSearching?: boolean;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search users...',
  onClear,
  showResultsCount = false,
  resultsCount = 0,
  isSearching = false,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({ light: '#e1e5e9', dark: '#3a3a3c' }, 'background');
  const focusedBorderColor = tintColor;
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#2c2c2e' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#6c757d', dark: '#8e8e93' }, 'text');

  const animatedBorderColor = useRef(new Animated.Value(0)).current;
  const animatedScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedBorderColor, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, animatedBorderColor]);

  useEffect(() => {
    if (isSearching) {
      Animated.sequence([
        Animated.timing(animatedScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isSearching, animatedScale]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    inputRef.current?.blur();
  };

  const borderColorAnimated = animatedBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [borderColor, focusedBorderColor],
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor: borderColorAnimated,
            backgroundColor,
            transform: [{ scale: animatedScale }],
          },
        ]}
      >
        <IconSymbol
          name="magnifyingglass"
          size={20}
          color={isFocused ? tintColor : iconColor}
          style={styles.searchIcon}
        />
        
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { color: textColor }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
          autoComplete="off"
        />
        
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <IconSymbol name="xmark.circle.fill" size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {showResultsCount && isSearching && (
        <ThemedView style={styles.resultsContainer}>
          <ThemedText style={styles.resultsText}>
            {resultsCount} {resultsCount === 1 ? 'result' : 'results'} found
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  resultsContainer: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  resultsText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
