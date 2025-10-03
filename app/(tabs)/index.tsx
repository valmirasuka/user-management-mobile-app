import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { UsersList } from '@/components/users-list';
import { ErrorBoundary } from '@/components/error-boundary';
import { useUsers } from '@/hooks/use-users';
import { User } from '@/types/user';

export default function HomeScreen() {
  const { users, loading, error, refresh, retry } = useUsers();

  const handleUserPress = (user: User) => {
      router.push({ pathname: '/user/[id]', params: { id: String(user.id) } });
  };

  const handleRefresh = () => {
    refresh();
  };

  return (
    <ErrorBoundary>
      <UsersList
        users={users}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        onUserPress={handleUserPress}
        refreshing={loading && users.length > 0}
      />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // styles are handled by the UsersList component
});
