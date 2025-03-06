/* 
Create a component to update JWT token every after expiration.
Log user out if token is not valid.
This is a component that uses side effect.
*/

import { useEffect } from 'react';
import retimer from 'retimer';
import { TokenRefresh } from '../services/TokenRefresh';
import { useAccessToken } from '../hooks/useAccessToken';

export const TokenRefresher: React.FC = () => {
  const { access, setAccess } = useAccessToken();

  useEffect(() => {
    let timer: ReturnType<typeof retimer>;

    const scheduleTimer = async () => {
      const refreshTime = await TokenRefresh(setAccess);

      // Recursively schedule the next refresh according to the time
      if (refreshTime > 0) {
        timer = retimer(() => {
          scheduleTimer();
        }, refreshTime);
      }
    };

    scheduleTimer();

    // Clear timer
    return () => {
      if (timer) {
        timer.clear();
      }
    };
  }, [access, setAccess]);

  return null;
};
