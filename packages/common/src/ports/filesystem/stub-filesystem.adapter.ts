export class StubFilesystemAdapter {
  constructor(public files: Record<string, string> = {}) {}

  async readFile(path: string): Promise<string> {
    return this.files[path];
  }
}
