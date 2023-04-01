import {
  containerDecorator,
  pageContextDecorator,
  queryClientDecorator,
  snackbarDecorator,
  trapLinksDecorator,
} from '../src/utils/storybook';

import '../src/styles.css';

export const decorators = [
  containerDecorator,
  pageContextDecorator,
  queryClientDecorator,
  snackbarDecorator,
  trapLinksDecorator,
].reverse();
