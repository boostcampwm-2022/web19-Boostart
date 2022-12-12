import axios, { AxiosError } from 'axios';

export const authorizedHttpRequest = async (callback: Function) => {
  try {
    return await callback();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const response = (error as AxiosError).response;
      if (response && (response.status === 401 || response.status === 403)) {
        window.location.reload();
      }
    }
    throw error;
  }
};
