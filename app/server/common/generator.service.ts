import { injectable } from 'inversify';

export const GeneratorServiceToken = Symbol('GeneratorServiceToken');

export interface GeneratorService {
  generateId(): Promise<string>;
}

@injectable()
export class MathRandomGeneratorService implements GeneratorService {
  async generateId(): Promise<string> {
    return Math.random().toString(36).slice(-6);
  }
}

@injectable()
export class StubGeneratorService implements GeneratorService {
  public nextId: string = '';

  async generateId(): Promise<string> {
    return this.nextId;
  }

  reset() {
    this.nextId = '';
  }
}
