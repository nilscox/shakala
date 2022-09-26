import { FileNotFoundError, FilesystemPort } from '../interfaces';

export type FilesystemObject = Record<string, string>;

export class InMemoryFilesystemAdapter implements FilesystemPort {
  constructor(private readonly fs: FilesystemObject = {}) {}

  async readEmailTemplate(path: string): Promise<string> {
    const file = this.fs[path];

    if (!file) {
      throw new FileNotFoundError(path);
    }

    return file;
  }
}
