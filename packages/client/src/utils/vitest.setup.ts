import { setupDOMFormatter } from '@nilscox/expect-dom';
import { prettyDOM } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@shakala/shared/vitest.setup';

setupDOMFormatter(prettyDOM);

afterEach(cleanup);

// https://github.com/capricorn86/happy-dom/issues/527#issuecomment-1174442116
const originalDispatchEvent = HTMLElement.prototype.dispatchEvent;
HTMLElement.prototype.dispatchEvent = function (event) {
  const result = originalDispatchEvent.call(this, event);
  if (event.type === 'click' && this.tagName === 'BUTTON') {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
  return result;
};

window.scroll = () => {};
