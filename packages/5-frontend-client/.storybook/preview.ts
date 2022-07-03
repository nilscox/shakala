import { DecoratorFn, Parameters } from '@storybook/react';
import ReactModal from 'react-modal';

import { snackbarDecorator } from '~/utils/storybook';

import '@fontsource/montserrat/latin.css';
import '@fontsource/open-sans/latin.css';

import '../src/styles/tailwind.css';
import '../src/styles/react-modal.css';

ReactModal.setAppElement('#root');

export const parameters: Parameters = {
  options: {
    storySort: {
      order: ['Theme', 'Elements', 'Domain'],
    },
  },
};

export const decorators: DecoratorFn[] = [snackbarDecorator()];

Error.stackTraceLimit = 100;
