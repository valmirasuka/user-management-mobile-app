//
//  user.ts
//  
//
//  Created by Valmira Suka on 2.10.25.
//
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
}

export interface UserListState {
  users: User[];
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

