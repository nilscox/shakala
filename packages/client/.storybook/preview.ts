import { containerDecorator, pageContextDecorator, queryClientDecorator } from '../src/utils/storybook';

import '../src/styles.css';

export const decorators = [containerDecorator, pageContextDecorator, queryClientDecorator];
