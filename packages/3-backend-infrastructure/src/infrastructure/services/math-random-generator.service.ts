import { GeneratorService } from 'backend-application';

export class MathRandomGeneratorService implements GeneratorService {
  async generateId(): Promise<string> {
    return Math.random().toString(36).slice(-6);
  }
}
