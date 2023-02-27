import expect from '@nilscox/expect';
import { describe, it } from 'vitest';

import { getIds } from './get-ids';

describe('getIds', () => {
  it('returns the set of ids from a set of entities', () => {
    expect(getIds([{ id: 'id1' }, { id: 'id2' }])).toEqual(['id1', 'id2']);
  });

  it('returns an empty array when the set of entities is empty', () => {
    expect(getIds([])).toEqual([]);
  });
});
