import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { removeUndefinedValues } from './remove-undefined-values';

describe('removeUndefinedValues', () => {
  it('recursively removes undefined values from an object', () => {
    const result = removeUndefinedValues({
      field1: 42,
      field2: null,
      field3: undefined,
      nested: {
        field1: 42,
        field2: undefined,
      },
    });

    expect(result).toEqual({
      field1: 42,
      field2: null,
      nested: {
        field1: 42,
      },
    });
  });

  it('does not transform arrays into objects', () => {
    const result = removeUndefinedValues({
      arr: [{ field1: 42, field2: undefined }],
    });

    expect(result).toEqual({
      arr: [{ field1: 42 }],
    });
  });
});
