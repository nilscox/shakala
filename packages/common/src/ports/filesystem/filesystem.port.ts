export interface FilesystemPort {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  writeJSONFile(path: string, content: unknown): Promise<void>;
}
