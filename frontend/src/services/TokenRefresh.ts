import { jwtDecode, JwtPayload } from 'jwt-decode';
import api from './api';
import { ENDPOINTS } from '../constants/endpoints';

export const TokenRefresh = async (setAccess: (value: string | null) => void): Promise<number> => {
  const storedAccess: string | null = localStorage.getItem('access');
  const storedRefresh: string | null = localStorage.getItem('refresh');

  if (!storedAccess || !storedRefresh) {
    setAccess(null);
    return 0;
  }

  const now: number = Date.now();
  const decoded: JwtPayload = storedAccess ? jwtDecode(storedAccess) : ({} as JwtPayload);
  const localExpiration: number = decoded.exp ? decoded.exp * 1000 - 60000 : 0;
  let refreshTime = Math.max(localExpiration - now, 1000);

  if (localExpiration && now > localExpiration) {
    try {
      const response = await api.post(ENDPOINTS.TOKEN, {
        refresh: storedRefresh,
      });

      if (response.status < 300) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setAccess(response.data.access);

        const decodedNew: JwtPayload = jwtDecode(response.data.access);
        const accessExpiration: number = decodedNew.exp ? decodedNew.exp * 1000 - 60000 : 0;
        refreshTime = Math.max(accessExpiration - now, 1000);
      } else {
        setAccess(null);
        return 0;
      }
    } catch (error) {
      setAccess(null);
      if (process.env.NODE_ENV === 'development') {
        console.error('Request failed:', error);
      }
      return 0;
    }
  }

  return refreshTime;
};
