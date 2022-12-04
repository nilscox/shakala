import { DecoratorFn, Parameters } from '@storybook/react';
import ReactModal from 'react-modal';

import { SnackbarProvider } from '~/elements/snackbar/snackbar-provider';
import { controls } from '~/utils/storybook';

import '@fontsource/montserrat/latin.css';
import '@fontsource/open-sans/latin.css';

import '~/styles/tailwind.css';
import '~/styles/react-modal.css';
import { PublicConfig } from '~/utils/config';
import { ConfigProvider } from '~/utils/config-provider';

Error.stackTraceLimit = 100;
ReactModal.setAppElement('#root');

export const parameters: Parameters = {
  options: {
    storySort: {
      order: ['Theme', 'Elements', 'Domain'],
    },
  },
};

export const argTypes = {
  setup: controls.disabled(),
};

const config: PublicConfig = {
  version: 'storybook',
  isDevelopment: true,
  apiBaseUrl: '',
};

export const decorators: DecoratorFn[] = [
  (Story) => (
    <SnackbarProvider>
      <Story />
    </SnackbarProvider>
  ),
  (Story) => (
    <ConfigProvider config={config}>
      <Story />
    </ConfigProvider>
  ),
];
