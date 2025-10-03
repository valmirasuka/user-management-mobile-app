//
//  users-list.tsx
//  
//
//  Created by Valmira Suka on 2.10.25.
//
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ErrorState } from '@/components/ui/error-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SearchInput } from '@/components/ui/search-input';
import { UserCard } from '@/components/user-card';
import { AddUserForm } from '@/components/add-user-form';
import { useSearch } from '@/hooks/use-search';
import { useThemeColor } from '@/hooks/use-theme-color';
import { User } from '@/types/user';
import React, { useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UsersListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUserPress?: (user: User) => void;
  refreshing?: boolean;
  onAddUser?: (userData: { name: string; email: string; company: string; phone: string; website: string; address: string }) => void;
}

export function UsersList({
  users,
  loading,
  error,
  onRefresh,
  onUserPress,
  refreshing = false,
  onAddUser
}: UsersListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const {
    searchQuery,
    setSearchQuery,
    filteredUsers,
    isSearching,
    clearSearch,
    searchResultsCount,
  } = useSearch({
    users,
    searchFields: ['name', 'email', 'company'],
  });

  const renderUser = ({ item, index }: { item: User; index: number }) => (
    <UserCard
      user={item}
      onPress={onUserPress}
      index={index}
    />
  );

  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      <IconSymbol
        name={isSearching ? "magnifyingglass" : "person.3"}
        size={64}
        color={iconColor}
        style={styles.emptyIcon}
      />
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        {isSearching ? 'No results found' : 'No users found'}
      </ThemedText>
      <ThemedText style={styles.emptyMessage}>
        {isSearching
          ? `No users match "${searchQuery}"`
          : 'Pull down to refresh or check your connection'
        }
      </ThemedText>
      {isSearching && (
        <ThemedText style={styles.clearHint}>
          Try a different search term or clear the search
        </ThemedText>
      )}
    </ThemedView>
  );

  const handleAddUser = (userData: { name: string; email: string; company: string; phone: string; website: string; address: string }) => {
    onAddUser?.(userData);
    setShowAddForm(false);
  };

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerTop}>
        <ThemedText type="title" style={styles.headerTitle}>
          Users
        </ThemedText>
        {onAddUser && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: tintColor }]}
            onPress={() => setShowAddForm(true)}
          >
            <IconSymbol name="plus" size={16} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
      <ThemedText style={styles.headerSubtitle}>
        {isSearching
          ? `${searchResultsCount} of ${users.length} ${users.length === 1 ? 'user' : 'users'}`
          : `${users.length} ${users.length === 1 ? 'user' : 'users'} found`
        }
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by name or email..."
        onClear={clearSearch}
        showResultsCount={isSearching}
        resultsCount={searchResultsCount}
        isSearching={isSearching}
      />
      <FlatList
        data={filteredUsers}
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
      
      {showAddForm && onAddUser && (
        <AddUserForm
          onSubmit={handleAddUser}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </SafeAreaView>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  clearHint: {
    textAlign: 'center',
    opacity: 0.5,
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  separator: {
    height: 4,
  },
});

