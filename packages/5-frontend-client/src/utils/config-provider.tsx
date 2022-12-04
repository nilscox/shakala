import { createContext, useContext } from 'react';

import { PublicConfig } from '~/utils/config';

const configContext = createContext<PublicConfig>(null as never);

type ConfigProviderProps = {
  config: PublicConfig;
  children: React.ReactNode;
};

export const ConfigProvider = ({ config, children }: ConfigProviderProps) => (
  <configContext.Provider value={config}>{children}</configContext.Provider>
);

export const useConfig = () => {
  const config = useContext(configContext);

  if (!config) {
    throw new Error('missing ConfigProvider');
  }

  return config;
};

export const useConfigValue = (key: keyof PublicConfig) => {
  return useConfig()[key];
};
