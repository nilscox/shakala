import fs from 'node:fs/promises';
import path from 'node:path';

import { toKebabCase } from '@shakala/shared';

import { DumpableRepository, FilesystemPort } from './filesystem.port';

export class LocalFilesystemAdapter implements FilesystemPort {
  async readFile(path: string): Promise<string> {
    return String(await fs.readFile(path));
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content);
  }

  async writeJSONFile(path: string, content: unknown): Promise<void> {
    await fs.writeFile(path, JSON.stringify(content, null, 2));
  }

  async dumpRepository(repository: DumpableRepository): Promise<void> {
    const entityName = repository.entity.name;
    const fileName = `${toKebabCase(entityName)}.json`;
    const filePath = path.join('entities', fileName);

    await fs.mkdir('entities', { recursive: true });
    await this.writeJSONFile(filePath, repository.all());
  }
}
