import { FilesystemPort } from './filesystem.port';

export class StubFilesystemAdapter implements FilesystemPort {
  constructor(public files: Record<string, string> = {}) {}

  async readFile(path: string): Promise<string> {
    return this.files[path];
  }

  async writeFile(path: string, content: string): Promise<void> {
    this.files[path] = content;
  }

  async writeJSONFile(path: string, content: unknown): Promise<void> {
    this.files[path] = JSON.stringify(content, null, 2);
  }
}
