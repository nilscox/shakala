import {
  containerDecorator,
  pageContextDecorator,
  queryClientDecorator,
  routerDecorator,
  snackbarDecorator,
} from '../src/utils/storybook';

import '../src/styles.css';

export const decorators = [
  containerDecorator,
  pageContextDecorator,
  queryClientDecorator,
  routerDecorator,
  snackbarDecorator,
].reverse();
