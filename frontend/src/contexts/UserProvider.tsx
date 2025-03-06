/* Useer data provider context for handling user data globally */

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/api';
import { ENDPOINTS } from '../constants/endpoints';
import { useAccessToken } from '../hooks/useAccessToken';
import { AxiosError } from 'axios';

// User data types
interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  is_student: boolean;
  is_teacher: boolean;
  subject?: string[];
  about?: string;
  profile_picture?: string;
  date_joined: string;
}

// Context types
interface ProviderTypes {
  userData: User | null;
  message?: string;
}

// Error response types
interface ErrorResponse {
  detail: string;
}

// Create context
const UserContext = createContext<ProviderTypes | undefined>(undefined);


export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [message, setMessage] = useState<string>('');
  const { access, setAccess } = useAccessToken();

  // Log out handler
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAccess(null);
    setUserData(null);
    setMessage('Logged out');
  };

  // Fetch user's data from server
  const fetchUserData = async (): Promise<void> => {
    try {
      const response = await api.get<User>(ENDPOINTS.MY_PROFILE);

      setUserData(response.data);

    } catch (error) {
      // Log out if provided token is not valid
      const err = error as AxiosError<ErrorResponse>;
      if (err.response?.data?.detail === 'Given token not valid for any token type') {
        handleLogout();
      }

      // Show error only on development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Request failed:', error);
      }
    }
  };

  useEffect(() => {
    if (access && !userData) {
      fetchUserData();
      setMessage('');
    }
    if (!access && userData) {
      handleLogout();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access, userData]);

  return (
    <UserContext.Provider value={{ userData, message }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
