import { setupDOMFormatter } from '@nilscox/expect-dom';
import { prettyDOM } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// eslint-disable-next-line import/no-unresolved
import '@shakala/shared/vitest.setup';

setupDOMFormatter(prettyDOM);
afterEach(cleanup);

window.scroll = () => {};
