//
//  api.ts
//  
//
//  Created by Valmira Suka on 2.10.25.
//
import { User } from '@/types/user';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiService {
  // generic request method with timeout and error handling
  private async request<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      // set up abort controller for 10-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
        
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your connection');
        }
        throw new Error(`Network error: ${error.message}`);
      }
      throw new Error('An unexpected error occurred');
    } 
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }
}

export const apiService = new ApiService();

