import { GeneratorPort } from 'backend-domain';

export class MathRandomGeneratorAdapter implements GeneratorPort {
  async generateId(): Promise<string> {
    return Math.random().toString(36).slice(-6);
  }

  async generateToken(): Promise<string> {
    return `token-${await this.generateId()}`;
  }
}
