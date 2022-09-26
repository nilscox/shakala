import { FileNotFoundError } from 'backend-application';

import { RealFilesystemAdapter } from './real-filesystem.adapter';

describe('RealFilesystemAdapter', () => {
  it('reads a file from the filesystem', async () => {
    const readFile = vi.fn();
    const filesystem = new RealFilesystemAdapter('/base', { readFile });

    readFile.mockResolvedValue(Buffer.from('content'));

    const result = await filesystem.readEmailTemplate('file.mjml');

    expect(result).toEqual('content');
    expect(readFile).toHaveBeenCalledWith('/base/email-templates/file.mjml');
  });

  it('throws a FileNotFound error', async () => {
    const readFile = vi.fn();
    const filesystem = new RealFilesystemAdapter('/', { readFile });

    const error = Object.assign(new Error(), { syscall: 'open', code: 'ENOENT' });

    readFile.mockRejectedValue(error);

    await expect(filesystem.readEmailTemplate('/root/.ssh')).rejects.toThrow(FileNotFoundError);
  });
});
