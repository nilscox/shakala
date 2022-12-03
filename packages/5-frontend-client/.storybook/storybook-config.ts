import { PublicConfig, ServerConfig } from '~/utils/config';

export const getServerConfig = (): ServerConfig => {
  return {
    apiBaseUrl: '',
  };
};

export const getClientConfig = (): PublicConfig => {
  return {
    apiBaseUrl: '',
    isDevelopment: true,
  };
};