export interface CryptoPort {
  hash(input: string): Promise<string>;
  compare(hashed: string, input: string): Promise<boolean>;
}
