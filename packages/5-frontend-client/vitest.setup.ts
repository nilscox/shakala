import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

class MockFormData extends Map<string, FormDataEntryValue | null> {
  constructor(element?: HTMLElement) {
    super();

    if (!element) {
      return;
    }

    for (const input of element.querySelectorAll('input')) {
      this.set(input.name, input.value);
    }

    for (const input of element.querySelectorAll('textarea')) {
      this.set(input.name, input.value);
    }
  }
}

// @ts-expect-error well... this works
global.FormData = MockFormData;

// @ts-expect-error well... this works too
global.window.scroll = vi.fn();
