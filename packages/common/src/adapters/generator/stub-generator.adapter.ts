import { GeneratorPort } from './generator.port';

export class StubGeneratorAdapter implements GeneratorPort {
  public nextIds = new Array<string>();

  set nextId(id: string) {
    this.nextIds.unshift(id);
  }

  async generateId(): Promise<string> {
    return this.nextIds.shift() ?? '<generated-id>';
  }

  public nextTokens = new Array<string>();

  set nextToken(token: string) {
    this.nextTokens.unshift(token);
  }

  async generateToken(): Promise<string> {
    return this.nextTokens.shift() ?? '<generated-token>';
  }
}
