import fs from 'fs/promises';

import { FilesystemPort } from './filesystem.port';

export class RealFilesystemAdapter implements FilesystemPort {
  async readFile(path: string): Promise<string> {
    return String(await fs.readFile(path));
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content);
  }

  async writeJSONFile(path: string, content: unknown): Promise<void> {
    await fs.writeFile(path, JSON.stringify(content, null, 2));
  }
}
