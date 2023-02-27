export interface FilesystemPort {
  readFile(path: string): Promise<string>;
}
