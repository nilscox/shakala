import { GeneratorPort } from '../interfaces/generator.port';

export class StubGeneratorAdapter implements GeneratorPort {
  public nextIds: string[] = [];

  set nextId(id: string) {
    this.nextIds = [id];
  }

  constructor() {
    beforeEach(() => {
      this.reset();
    });
  }

  async generateId(): Promise<string> {
    const nextId = this.nextIds.shift();

    if (!nextId) {
      throw new Error('StubGeneratorAdapter: no next id');
    }

    return nextId;
  }

  public nextTokens: string[] = [];

  set nextToken(token: string) {
    this.nextTokens = [token];
  }

  async generateToken(): Promise<string> {
    const nextToken = this.nextTokens.shift();

    if (!nextToken) {
      throw new Error('StubGeneratorAdapter: no next id');
    }

    return nextToken;
  }

  reset() {
    this.nextIds = [];
  }
}
