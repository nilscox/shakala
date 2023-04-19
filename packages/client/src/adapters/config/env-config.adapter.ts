import { AppConfig } from './app-config';

const env = {
  DEV: import.meta.env.DEV,
  SSR: import.meta.env.SSR,
  SERVER_API_URL: import.meta.env.VITE_SERVER_API_URL,
  CLIENT_API_URL: import.meta.env.VITE_CLIENT_API_URL,
  ANALYTICS_URL: import.meta.env.VITE_ANALYTICS_URL,
  ANALYTICS_SITE_ID: import.meta.env.VITE_ANALYTICS_SITE_ID,
};

export const envConfig: AppConfig = {
  isDevelopment: env.DEV,
  apiBaseUrl: env.SSR ? env.SERVER_API_URL : env.CLIENT_API_URL,
  analyticsUrl: env.ANALYTICS_URL,
  analyticsSiteId: Number(env.ANALYTICS_SITE_ID),
};
