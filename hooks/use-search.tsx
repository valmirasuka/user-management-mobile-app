//
//  use-search.tsx
//  
//
//  Created by Valmira Suka on 3.10.25.
//
import { useState, useMemo, useCallback } from 'react';
import { User } from '@/types/user';

interface UseSearchProps {
  users: User[];
  searchFields: (keyof User)[];
}

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredUsers: User[];
  isSearching: boolean;
  clearSearch: () => void;
  searchResultsCount: number;
}

export function useSearch({ users, searchFields }: UseSearchProps): UseSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return users.filter(user => {
      return searchFields.some(field => {
        const fieldValue = user[field];
        
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(query);
        }
        
        if (typeof fieldValue === 'object' && fieldValue !== null) {
          if (field === 'company' && 'name' in fieldValue) {
            return (fieldValue as any).name.toLowerCase().includes(query);
          }
        }
        
        return false;
      });
    });
  }, [users, searchQuery, searchFields]);

  const isSearching = searchQuery.trim().length > 0;
  const searchResultsCount = filteredUsers.length;

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredUsers,
    isSearching,
    clearSearch,
    searchResultsCount,
  };
}
