import { useInjection } from 'brandi-react';

import { AppConfig } from '~/app/container';

export const useConfigValue = (key: keyof AppConfig) => {
  return useInjection(TOKENS.config)[key];
};
