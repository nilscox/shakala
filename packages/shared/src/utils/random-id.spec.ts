import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { randomId } from './random-id';

describe('[unit] randomId', () => {
  it('generates a random string of 4 characters', () => {
    const id = randomId();

    expect(typeof id).toEqual('string');
    expect(id).toHaveLength(4);
  });
});
