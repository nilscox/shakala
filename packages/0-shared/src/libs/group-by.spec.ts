import { groupBy } from './group-by';

describe('groupBy', () => {
  type Item = {
    id: number;
    prop: string;
  };

  it('returns an array grouped by elements having the same value for a given property', () => {
    const array: Item[] = [
      { id: 1, prop: 'a' },
      { id: 2, prop: 'b' },
      { id: 3, prop: 'a' },
      { id: 4, prop: 'c' },
    ];

    expect<Map<string, Array<Item | undefined>>>(groupBy(array, 'prop')).toEqual(
      new Map([
        ['a', [array[0], array[2]]],
        ['b', [array[1]]],
        ['c', [array[3]]],
      ]),
    );
  });
});
