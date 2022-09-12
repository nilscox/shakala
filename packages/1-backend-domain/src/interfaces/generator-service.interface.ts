export interface GeneratorService {
  generateId(): Promise<string>;
  generateToken(): Promise<string>;
}
