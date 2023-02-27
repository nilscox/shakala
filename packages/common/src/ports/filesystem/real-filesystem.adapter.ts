import fs from 'fs/promises';

export class RealFilesystemAdapter {
  async readFile(path: string): Promise<string> {
    return String(await fs.readFile(path));
  }
}
