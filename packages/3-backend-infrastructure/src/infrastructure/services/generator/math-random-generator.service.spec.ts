import { MathRandomGeneratorService } from './math-random-generator.service';

describe('MathRandomGeneratorService', () => {
  it('generates a random string of characters', async () => {
    const service = new MathRandomGeneratorService();
    const id = await service.generateId();

    expect(id).toEqual(expect.any(String));
    expect(id).toHaveLength(6);
  });
});
