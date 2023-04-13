import { useInjection } from 'brandi-react';

import { AppConfig } from '~/adapters/config/app-config';

export const useConfigValue = (key: keyof AppConfig) => {
  return useInjection(TOKENS.config)[key];
};
