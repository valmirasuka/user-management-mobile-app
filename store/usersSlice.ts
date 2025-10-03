//
//  usersSlice.ts
//  
//
//  Created by Valmira Suka on 3.10.25.
//
import { User } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // set users from API fetch (overwrites existing users)
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
      state.lastFetched = Date.now();
      state.loading = false;
      state.error = null;
    },
    // toggle loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    // set error message and stop loading
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    // add new user to the beginning of the list
    addUser(state, action: PayloadAction<User>) {
      state.users = [action.payload, ...state.users];
    },
    // update existing user by ID
    updateUser(state, action: PayloadAction<User>) {
      state.users = state.users.map(u => (u.id === action.payload.id ? action.payload : u));
    },
    // remove user by ID
    deleteUser(state, action: PayloadAction<number>) {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
  },
});

export const { setUsers, setLoading, setError, addUser, updateUser, deleteUser } = usersSlice.actions;
export default usersSlice.reducer;


