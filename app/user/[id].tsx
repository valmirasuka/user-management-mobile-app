//
//  [id].tsx
//  
//
//  Created by Valmira Suka on 3.10.25.
//
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { AddUserForm } from '@/components/add-user-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ErrorState } from '@/components/ui/error-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useThemeColor } from '@/hooks/use-theme-color';
import { apiService } from '@/services/api';
import type { RootState } from '@/store';
import { deleteUser, updateUser } from '@/store/usersSlice';
import { User } from '@/types/user';
import { useDispatch, useSelector } from 'react-redux';

export default function UserDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string; user?: string }>();
  const userId = Number(params.id);
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.users);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        // if full user data was passed via params (local user), use it directly
        if (params.user) {
          const parsed = JSON.parse(String(params.user)) as User;
          console.log('Using user from navigation params (local user):', parsed);
          if (mounted) {
            setUser(parsed);
            setError(null);
          }
          return;
        }

        const data = await apiService.getUserById(userId);
        if (mounted) {
          setUser(data);
          setError(null);
        }
      } catch (e) {
        console.error('API Error:', e);
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
  }, [userId, params.user]);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (user) {
              dispatch(deleteUser(user.id));
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleUpdateUser = (userData: { name: string; email: string; company: string; phone: string; website: string; address: string }) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name: userData.name,
      email: userData.email,
      company: {
        ...user.company,
        name: userData.company,
      },
      phone: userData.phone,
      website: userData.website,
      address: {
        street: userData.address.split(',')[0] || user.address?.street || '',
        suite: userData.address.split(',')[1]?.trim() || user.address?.suite || '',
        city: userData.address.split(',')[2]?.trim() || user.address?.city || '',
        zipcode: userData.address.split(',')[3]?.trim() || user.address?.zipcode || '',
        geo: user.address?.geo || { lat: '0.0000', lng: '0.0000' },
      },
    };

    dispatch(updateUser(updatedUser));
    setUser(updatedUser);
    setShowEditForm(false);
  };

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
      <Stack.Screen 
        options={{ 
          title: user.name, 
          headerBackTitle: '',
          headerRight: () => (
            <TouchableOpacity onPress={handleEdit} style={{ marginRight: 16 }}>
              <IconSymbol name="pencil" size={20} color={tintColor} />
            </TouchableOpacity>
          ),
        }} 
      />
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

        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: '#ff6b6b' }]}
          onPress={handleDelete}
        >
          <IconSymbol name="trash" size={16} color="#ff6b6b" />
          <ThemedText style={[styles.deleteButtonText, { color: '#ff6b6b' }]}> 
            Delete User
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>

      {showEditForm && (
        <AddUserForm
          onSubmit={handleUpdateUser}
          onCancel={() => setShowEditForm(false)}
          initialData={{
            name: user.name,
            email: user.email,
            company: user.company.name,
            phone: user.phone,
            website: user.website,
            address: address,
          }}
          submitLabel="Update User"
        />
      )}
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




