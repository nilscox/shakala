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
  readFile(path: string): Promise<string>;
}
