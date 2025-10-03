//
//  [id].tsx
//  
//
//  Created by Valmira Suka on 3.10.25.
//
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';
import { useThemeColor } from '@/hooks/use-theme-color';
import { apiService } from '@/services/api';
import { User } from '@/types/user';

export default function UserDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const userId = Number(params.id);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await apiService.getUserById(userId);
        if (mounted) {
          setUser(data);
          setError(null);
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : 'Failed to load user');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (!Number.isNaN(userId)) load();
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading user..." />;
  }

  if (error || !user) {
    return <ErrorState message={error ?? 'User not found'} />;
  }

  const openWebsite = () => {
    const url = user.website?.startsWith('http') ? user.website : `https://${user.website}`;
    if (url) Linking.openURL(url).catch(() => {});
  };

  const address = user.address
    ? `${user.address.street}, ${user.address.suite},\n${user.address.city} ${user.address.zipcode}`
    : '—';

  return (
    <>
      <Stack.Screen options={{ title: user.name }} />
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Contact</ThemedText>
          <ThemedView style={styles.row}>
            <IconSymbol name="phone" size={18} color={iconColor} />
            <ThemedText style={styles.value}>{user.phone ?? '—'}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.row}>
            <IconSymbol name="globe" size={18} color={iconColor} />
            <TouchableOpacity onPress={openWebsite} activeOpacity={0.7}>
              <ThemedText style={[styles.value, { color: tintColor }]}>
                {user.website ?? '—'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Address</ThemedText>
          <ThemedView style={styles.row}>
            <IconSymbol name="mappin.and.ellipse" size={18} color={iconColor} />
            <ThemedText style={styles.value}>{address}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  value: {
    flex: 1,
    lineHeight: 20,
  },
});


