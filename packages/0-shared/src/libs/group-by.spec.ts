import { groupBy } from './group-by';

describe('groupBy', () => {
  it('returns an array grouped by elements having the same value for a given property', () => {
    const array: Array<{ id: number; prop: string }> = [
      { id: 1, prop: 'a' },
      { id: 2, prop: 'b' },
      { id: 3, prop: 'a' },
      { id: 4, prop: 'c' },
    ];

    expect(groupBy(array, 'prop')).toEqual(
      new Map([
        ['a', [array[0], array[2]]],
        ['b', [array[1]]],
        ['c', [array[3]]],
      ]),
    );
  });
});
