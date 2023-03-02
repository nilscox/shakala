export interface GeneratorPort {
  generateId(): Promise<string>;
  generateToken(): Promise<string>;
}
