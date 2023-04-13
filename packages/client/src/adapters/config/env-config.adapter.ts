import { AppConfig } from './app-config';

export const envConfig: AppConfig = {
  isDevelopment: import.meta.env.DEV,
  apiBaseUrl: import.meta.env.SSR ? import.meta.env.VITE_SERVER_API_URL : import.meta.env.VITE_CLIENT_API_URL,
};
