import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { makeDiff, group } from './make-diff';

describe('makeDiff', () => {
  describe('group', () => {
    // prettier-ignore
    it('should group similar chunks separated with spaces', () => {
      expect(
        group([
          { value: 'a', removed: true },
          { value: ' ' },
          { value: 'b', removed: true },
        ])
      ).toEqual([
        { value: 'a b', removed: true },
      ]);

      expect(
        group([
          { value: 'a', added: true },
          { value: ' ' },
          { value: 'b', added: true },
        ])
      ).toEqual([
        { value: 'a b', added: true },
      ]);

      expect(
        group([
          { value: 'a', added: true },
          { value: '     ' },
          { value: 'b', added: true },
        ])
      ).toEqual([
        { value: 'a     b', added: true },
      ]);

      expect(
        group([
          { value: 'a', added: true },
          { value: '     ' },
          { value: 'b', added: true },
          { value: ' ' },
          { value: 'c', added: true },
        ])
      ).toEqual([
        { value: 'a     b c', added: true },
      ]);
    });

    // prettier-ignore
    it('should not group', () => {
      expect(
        group([
          { value: 'a', added: true },
          { value: ' o ' },
          { value: 'b', added: true },
        ])
      ).toEqual([
        { value: 'a', added: true },
        { value: ' o ' },
        { value: 'b', added: true },
      ]);
    });
  });

  describe('makeDiff', () => {
    it('should group items', () => {
      const a = 'this is so nice';
      const b = 'this should have been nice';

      const lines = makeDiff(a, b, { simplify: true, group: true });

      expect(lines).toHaveLength(1);

      expect(lines[0]).toEqual([
        [{ value: 'this ' }, { value: 'is so', removed: true }, { value: ' nice' }],
        [{ value: 'this ' }, { value: 'should have been ', added: true }, { value: 'nice' }],
      ]);
    });
  });
});
