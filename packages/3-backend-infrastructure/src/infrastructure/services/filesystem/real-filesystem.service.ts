import nodeFs from 'fs/promises';

import { FileNotFoundError, FilesystemAccessError, FilesystemService } from 'backend-application';
import { get } from 'shared';

type NodeFs = {
  readFile: (path: string) => Promise<Buffer>;
};

export class RealFilesystemService implements FilesystemService {
  constructor(private readonly fs: NodeFs = nodeFs) {}

  async readFile(path: string): Promise<string> {
    try {
      return String(await this.fs.readFile(path));
    } catch (error) {
      const code = get(error, 'code');

      if (code === 'ENOENT') {
        throw new FileNotFoundError(path);
      }

      // cspell:word EACCESS
      if (code === 'EACCESS') {
        throw new FilesystemAccessError(path);
      }

      throw error;
    }
  }
}
