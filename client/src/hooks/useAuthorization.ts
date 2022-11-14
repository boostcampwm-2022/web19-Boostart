import { useEffect, useState } from 'react';

export const useAuthorization = () => {
  const [isLogined, setIsLogined] = useState<boolean>(); // false -> false

  const checkLogin = async () => {
    const response = await fetch(`http://localhost:8000/api/v1/auth/check-login`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    setIsLogined(response.ok);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return isLogined;
};
