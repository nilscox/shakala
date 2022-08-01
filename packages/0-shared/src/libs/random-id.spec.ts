import { randomId } from '../libs/random-id';

describe('randomId', () => {
  it('generates a random string of 6 characters', () => {
    const id = randomId();

    expect(typeof id).toEqual('string');
    expect(id).toHaveLength(6);
  });
});
