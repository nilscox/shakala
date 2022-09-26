import { MathRandomGeneratorAdapter } from './math-random-generator.adapter';

describe('MathRandomGeneratorAdapter', () => {
  it('generates a random string of characters', async () => {
    const generator = new MathRandomGeneratorAdapter();
    const id = await generator.generateId();

    expect(id).toEqual(expect.any(String));
    expect(id).toHaveLength(6);
  });
});
