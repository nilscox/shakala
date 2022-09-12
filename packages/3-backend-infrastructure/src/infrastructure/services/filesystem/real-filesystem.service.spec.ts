import { FileNotFoundError } from 'backend-application';

import { RealFilesystemService } from './real-filesystem.service';

describe('RealFilesystemService', () => {
  it('reads a file from the filesystem', async () => {
    const readFile = vi.fn();
    const service = new RealFilesystemService({ readFile });

    readFile.mockResolvedValue(Buffer.from('content'));

    const result = await service.readFile('/root/.ssh');

    expect(result).toEqual('content');
    expect(readFile).toHaveBeenCalledWith('/root/.ssh');
  });

  it('throws a FileNotFound error', async () => {
    const readFile = vi.fn();
    const service = new RealFilesystemService({ readFile });

    const error = Object.assign(new Error(), { syscall: 'open', code: 'ENOENT' });

    readFile.mockRejectedValue(error);

    await expect(service.readFile('/root/.ssh')).rejects.toThrow(FileNotFoundError);
  });
});
