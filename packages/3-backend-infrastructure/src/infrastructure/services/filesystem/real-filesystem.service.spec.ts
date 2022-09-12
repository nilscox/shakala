import { FileNotFoundError } from 'backend-application';

import { RealFilesystemService } from './real-filesystem.service';

describe('RealFilesystemService', () => {
  it('reads a file from the filesystem', async () => {
    const readFile = vi.fn();
    const service = new RealFilesystemService('/base', { readFile });

    readFile.mockResolvedValue(Buffer.from('content'));

    const result = await service.readEmailTemplate('file.mjml');

    expect(result).toEqual('content');
    expect(readFile).toHaveBeenCalledWith('/base/email-templates/file.mjml');
  });

  it('throws a FileNotFound error', async () => {
    const readFile = vi.fn();
    const service = new RealFilesystemService('/', { readFile });

    const error = Object.assign(new Error(), { syscall: 'open', code: 'ENOENT' });

    readFile.mockRejectedValue(error);

    await expect(service.readEmailTemplate('/root/.ssh')).rejects.toThrow(FileNotFoundError);
  });
});
