/* Event-driven token refreshing flow */

import { useEffect } from 'react';
import { useAccessToken } from '../hooks/useAccessToken';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { BaseURLS } from '../constants/base-urls';
import { ENDPOINTS } from '../constants/endpoints';


interface DecodedToken {
  exp: number;
}

const AuthInterceptor: React.FC = () => {
  const { setAccess } = useAccessToken();

  useEffect(() => {
    const refreshToken = async (): Promise<string | null> => {
      try {
        // Get refresh token from local storage
        const refresh = localStorage.getItem('refresh');

        // Logout if there are no refresh token
        if (!refresh) {
          setAccess(null);
          return null;
        }

        // send request to get new token
        const response = await axios.post(BaseURLS.API + ENDPOINTS.TOKEN, {
          refresh,
        });

        // Set new tokens
        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh;
        localStorage.setItem('access', newAccessToken);
        localStorage.setItem('refresh', newRefreshToken);
        setAccess(newAccessToken);
        return newAccessToken;

        // Logout on any error case
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Request failed:', error);
        }
        setAccess(null);
        return null;
      }
    };

    // Interceptor
    const interceptor = api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        let token = localStorage.getItem('access');

        // Call refreshToken() function only there are access token
        if (token) {
          // Decode JWT token and calculate expiration date
          const now = Math.floor(Date.now() / 1000);
          const decoded: DecodedToken = jwtDecode(token);
          const jwtExpire = decoded.exp;

          // Get new token if access token expired, logout otherwise
          if (now > jwtExpire) {
            token = await refreshToken();

            if (!token) {
              setAccess(null);
            }
          }

          config.headers!['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [setAccess]);

  return null;
};

export default AuthInterceptor;
