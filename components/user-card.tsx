//
//  user-card.tsx
//  
//
//  Created by Valmira Suka on 2.10.25.
//
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { User } from '@/types/user';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface UserCardProps {
  user: User;
  onPress?: (user: User) => void;
  index: number;
}

export function UserCard({ user, onPress, index }: UserCardProps) {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const cardBackground = useThemeColor({ light: '#f8f9fa', dark: '#2c2c2e' }, 'background');

  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 50, // Stagger animation
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, { backgroundColor: cardBackground }]}
        onPress={() => onPress?.(user)}
        activeOpacity={0.7}
      >
        <ThemedView style={styles.avatarContainer}>
          <ThemedText style={[styles.avatarText, { color: tintColor }]}>
            {user.name.charAt(0).toUpperCase()}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={1}>
            {user.name}
          </ThemedText>
          
          <ThemedView style={styles.emailContainer}>
            <IconSymbol name="envelope" size={14} color={iconColor} />
            <ThemedText style={styles.email} numberOfLines={1}>
              {user.email}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.companyContainer}>
            <IconSymbol name="building.2" size={14} color={iconColor} />
            <ThemedText style={styles.company} numberOfLines={1}>
              {user.company.name}
            </ThemedText>
          </ThemedView>

          {user.company.catchPhrase && (
            <ThemedText style={styles.catchPhrase} numberOfLines={2}>
              "{user.company.catchPhrase}"
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.chevronContainer}>
          <IconSymbol name="chevron.right" size={16} color={iconColor} />
        </ThemedView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    marginHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    marginBottom: 2,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  company: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  catchPhrase: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.6,
    marginTop: 4,
  },
  chevronContainer: {
    marginLeft: 8,
  },
});
