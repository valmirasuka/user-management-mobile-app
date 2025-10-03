//
//  use-users.ts
//  
//
//  Created by Valmira Suka on 2.10.25.
//
import { useState, useEffect, useCallback } from 'react';
import { User, UserListState } from '@/types/user';
import { apiService } from '@/services/api';

export function useUsers() {
  const [state, setState] = useState<UserListState>({
    users: [],
    loading: false,
    error: null,
    lastFetched: null,
  });

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (!isRefresh && state.users.length > 0) return; // do not refetch if we already have data

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const users = await apiService.getUsers();
      setState(prev => ({
        ...prev,
        users,
        loading: false,
        error: null,
        lastFetched: new Date(),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
      }));
    }
  }, [state.users.length]);

  const retry = useCallback(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  const refresh = useCallback(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    ...state,
    retry,
    refresh,
    refetch: () => fetchUsers(true),
  };
}
