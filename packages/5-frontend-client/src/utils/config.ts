import getConfig from 'next/config';

type ServerConfig = {
  apiBaseUrl: string;
};

export const getServerConfig = (): ServerConfig => {
  return getConfig().serverRuntimeConfig;
};

type ClientConfig = {
  apiBaseUrl: string;
};

export const getClientConfig = (): ClientConfig => {
  return getConfig().publicRuntimeConfig;
};
