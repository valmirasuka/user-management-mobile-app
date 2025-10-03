//
//  index.ts
//  
//
//  Created by Valmira Suka on 3.10.25.
//
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';

// configure Redux store with users slice
export const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

// export types for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


