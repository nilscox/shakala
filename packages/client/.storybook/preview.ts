import {
  containerDecorator,
  pageContextDecorator,
  queryClientDecorator,
  snackbarDecorator,
} from '../src/utils/storybook';

import '../src/styles.css';

export const decorators = [containerDecorator, pageContextDecorator, queryClientDecorator, snackbarDecorator];
