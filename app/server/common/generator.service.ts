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
