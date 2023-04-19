import { useInjection } from 'brandi-react';

import { AppConfig } from '~/adapters/config/app-config';
import { TOKENS } from '~/app/tokens';

export const useConfigValue = <Key extends keyof AppConfig>(key: Key): AppConfig[Key] => {
  return useInjection(TOKENS.config)[key];
};
