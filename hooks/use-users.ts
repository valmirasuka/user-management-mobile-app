//
//  use-users.ts
//  
//
//  Created by Valmira Suka on 2.10.25.
//
import { apiService } from '@/services/api';
import type { RootState } from '@/store';
import { addUser as addUserAction, setError, setLoading, setUsers } from '@/store/usersSlice';
import { User } from '@/types/user';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useUsers() {
  const dispatch = useDispatch();
  const state = useSelector((s: RootState) => s.users);

  // Fetch users from API with caching (only fetch if no data exists)
  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (!isRefresh && state.users.length > 0) return; // do not refetch if we already have data

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const users = await apiService.getUsers();
      dispatch(setUsers(users));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch users'));
    }
  }, [state.users.length]);

  const retry = useCallback(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  const refresh = useCallback(() => {
    fetchUsers(true);
  }, [fetchUsers]);

  // Add new user locally (not persisted to server)
  const addUser = useCallback((userData: { name: string; email: string; company: string; phone: string; website: string; address: string }) => {
    const newUser: User = {
      id: Date.now(), // simple local ID generation
      name: userData.name,
      email: userData.email,
      company: {
        name: userData.company,
        catchPhrase: 'Local user - no catchphrase available',
        bs: 'Local user business description',
      },
      address: {
        street: userData.address.split(',')[0] || 'Local User Street',
        suite: userData.address.split(',')[1]?.trim() || 'Suite 100',
        city: userData.address.split(',')[2]?.trim() || 'Local City',
        zipcode: userData.address.split(',')[3]?.trim() || '12345',
        geo: {
          lat: '0.0000',
          lng: '0.0000',
        },
      },
      phone: userData.phone,
      website: userData.website,
      username: userData.name.toLowerCase().replace(/\s+/g, ''),
    };

    dispatch(addUserAction(newUser));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    ...state,
    retry,
    refresh,
    refetch: () => fetchUsers(true),
    addUser,
  };
}
