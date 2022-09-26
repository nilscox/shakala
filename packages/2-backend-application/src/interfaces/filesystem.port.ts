export interface FilesystemPort {
  readonly emailTemplatesPath?: string;
  readEmailTemplate(path: string): Promise<string>;
}

export class FileNotFoundError extends Error {
  constructor(public readonly path: string) {
    super('File not found');
  }
}

export class IsDirectoryError extends Error {
  constructor(public readonly path: string) {
    super('Path is a directory');
  }
}

export class FilesystemAccessError extends Error {
  constructor(public readonly path: string) {
    super('Missing file permissions');
  }
}
