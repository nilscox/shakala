import type { GeneratorService } from '../interfaces/generator.service';

export class StubGeneratorService implements GeneratorService {
  public nextId = '';

  constructor() {
    beforeEach(() => {
      this.reset();
    });
  }

  async generateId(): Promise<string> {
    return this.nextId;
  }

  reset() {
    this.nextId = '';
  }
}
