import expect from '@nilscox/expect';
import { beforeEach, describe, it } from 'vitest';

import { NanoidGeneratorAdapter } from './nanoid-generator.adapter';

describe('[unit] NanoidGeneratorAdapter', () => {
  let generator: NanoidGeneratorAdapter;

  beforeEach(() => {
    generator = new NanoidGeneratorAdapter();
  });

  describe('generateId', () => {
    it('generates an id', async () => {
      const id = await generator.generateId();

      expect(id).toEqual(expect.any(String));
      expect(id).toHaveLength(12);
    });
  });
});
