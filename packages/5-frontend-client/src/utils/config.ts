import getConfig from 'next/config';

export type ServerConfig = {
  apiBaseUrl: string;
};

export const getServerConfig = (): ServerConfig => {
  return getConfig().serverRuntimeConfig;
};

export type PublicConfig = {
  version: string;
  isDevelopment: boolean;
  apiBaseUrl: string;
  analyticsUrl?: string;
  analyticsSiteId?: number;
};

export const getPublicConfig = (): PublicConfig => {
  return getConfig().publicRuntimeConfig;
};
