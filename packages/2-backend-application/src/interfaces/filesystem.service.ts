export class FileNotFoundError {
  constructor(public readonly path: string) {}
}

export class IsDirectoryError {
  constructor(public readonly path: string) {}
}

export class FilesystemAccessError {
  constructor(public readonly path: string) {}
}

export interface FilesystemService {
  readonly emailTemplatesPath?: string;
  readEmailTemplate(path: string): Promise<string>;
}
