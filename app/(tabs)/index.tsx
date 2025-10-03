import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { UsersList } from '@/components/users-list';
import { ErrorBoundary } from '@/components/error-boundary';
import { useUsers } from '@/hooks/use-users';
import { User } from '@/types/user';

export default function HomeScreen() {
  const { users, loading, error, refresh, retry } = useUsers();

  const handleUserPress = (user: User) => {
    Alert.alert(
      user.name,
      `Email: ${user.email}\nCompany: ${user.company.name}`,
      [{ text: 'OK' }]
    );
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
