import { setupDOMFormatter } from '@nilscox/expect-dom';
import { prettyDOM } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@shakala/shared/vitest.setup';

setupDOMFormatter(prettyDOM);
afterEach(cleanup);

window.scroll = () => {};
