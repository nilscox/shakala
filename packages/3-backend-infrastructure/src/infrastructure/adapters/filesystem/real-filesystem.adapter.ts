import nodeFs from 'fs/promises';
import path from 'path';

import { FileNotFoundError, FilesystemAccessError, FilesystemPort } from 'backend-application';
import { get } from 'shared';

export type NodeFs = {
  readFile: (path: string) => Promise<string | Buffer>;
};

export class RealFilesystemAdapter implements FilesystemPort {
  get emailTemplatesPath() {
    return path.join(this.basePath, 'email-templates');
  }

  constructor(private basePath: string, private readonly fs: NodeFs = nodeFs) {}

  async readEmailTemplate(fileName: string): Promise<string> {
    const filePath = path.join(this.emailTemplatesPath, fileName);

    try {
      return String(await this.fs.readFile(filePath));
    } catch (error) {
      const code = get(error, 'code');

      if (code === 'ENOENT') {
        throw new FileNotFoundError(filePath);
      }

      // cspell:word EACCESS
      if (code === 'EACCESS') {
        throw new FilesystemAccessError(filePath);
      }

      throw error;
    }
  }
}
