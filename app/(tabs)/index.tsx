import React from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { UsersList } from '@/components/users-list';
import { ErrorBoundary } from '@/components/error-boundary';
import { useUsers } from '@/hooks/use-users';
import { User } from '@/types/user';

export default function HomeScreen() {
  const { users, loading, error, refresh, retry, addUser } = useUsers();

  const handleUserPress = (user: User) => {
      // pass the full user object so local users can be shown without API
      router.push({ pathname: '/user/[id]', params: { id: String(user.id), user: JSON.stringify(user) } });
  };
  
  const handleAddUser = (userData: { name: string; email: string; company: string; phone: string; website: string; address: string }) => {
        addUser(userData);
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
        onAddUser={handleAddUser}
      />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // styles are handled by the UsersList component
});
