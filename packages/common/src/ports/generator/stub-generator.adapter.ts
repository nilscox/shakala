import { GeneratorPort } from './generator.port';

export class StubGeneratorAdapter implements GeneratorPort {
  public nextIds = new Array<string>();

  set nextId(id: string) {
    this.nextIds.unshift(id);
  }

  async generateId(): Promise<string> {
    const nextId = this.nextIds.shift();

    if (!nextId) {
      throw new Error('StubGeneratorAdapter: no next id');
    }

    return nextId;
  }

  public nextTokens = new Array<string>();

  set nextToken(token: string) {
    this.nextTokens.unshift(token);
  }

  async generateToken(): Promise<string> {
    const nextToken = this.nextTokens.shift();

    if (!nextToken) {
      throw new Error('StubGeneratorAdapter: no next id');
    }

    return nextToken;
  }
}
