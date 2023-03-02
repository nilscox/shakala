export interface DumpableRepository {
  entity: { name: string };
  all(): unknown;
}

export interface FilesystemPort {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  writeJSONFile(path: string, content: unknown): Promise<void>;
  dumpRepository(repository: DumpableRepository): Promise<void>;
}
