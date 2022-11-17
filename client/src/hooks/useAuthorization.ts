import { useEffect, useState } from 'react';
import { HOST } from '../constants';

export const useAuthorization = () => {
  const [hasLogin, setHasLogin] = useState<boolean>(); // false -> false

  const checkLogin = async () => {
    const response = await fetch(`${HOST}/api/v1/auth/check-login`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    setHasLogin(response.ok);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return hasLogin;
};
