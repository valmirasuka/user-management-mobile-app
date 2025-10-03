//
//  users-list.tsx
//  
//
//  Created by Valmira Suka on 2.10.25.
//
import React from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  View,
  Animated
} from 'react-native';
import { User } from '@/types/user';
import { UserCard } from '@/components/user-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorState } from '@/components/ui/error-state';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface UsersListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUserPress?: (user: User) => void;
  refreshing?: boolean;
}

export function UsersList({
  users,
  loading,
  error,
  onRefresh,
  onUserPress,
  refreshing = false
}: UsersListProps) {
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const renderUser = ({ item, index }: { item: User; index: number }) => (
    <UserCard
      user={item}
      onPress={onUserPress}
      index={index}
    />
  );

  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      <IconSymbol name="person.3" size={64} color={iconColor} style={styles.emptyIcon} />
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        No users found
      </ThemedText>
      <ThemedText style={styles.emptyMessage}>
        Pull down to refresh or check your connection
      </ThemedText>
    </ThemedView>
  );

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedText type="title" style={styles.headerTitle}>
        Users
      </ThemedText>
      <ThemedText style={styles.headerSubtitle}>
        {users.length} {users.length === 1 ? 'user' : 'users'} found
      </ThemedText>
    </ThemedView>
  );

  const renderFooter = () => {
    if (loading && users.length > 0) {
      return <LoadingSpinner size="small" message="Loading more..." />;
    }
    return null;
  };

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={onRefresh}
        showRetry={true}
      />
    );
  }

  if (loading && users.length === 0) {
    return <LoadingSpinner fullScreen message="Loading users..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={tintColor}
            colors={[tintColor]}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        getItemLayout={(data, index) => ({
          length: 88, // Approximate height of UserCard + margin
          offset: 88 * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    marginBottom: 4,
  },
  headerSubtitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
  },
  separator: {
    height: 4,
  },
});
