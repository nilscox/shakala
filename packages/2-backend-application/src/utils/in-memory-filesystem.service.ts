import { FileNotFoundError, FilesystemService } from '../interfaces/filesystem.service';

export type FilesystemObject = Record<string, string>;

export class InMemoryFilesystemService implements FilesystemService {
  constructor(private readonly fs: FilesystemObject = {}) {}

  async readEmailTemplate(path: string): Promise<string> {
    const file = this.fs[path];

    if (!file) {
      throw new FileNotFoundError(path);
    }

    return file;
  }
}
