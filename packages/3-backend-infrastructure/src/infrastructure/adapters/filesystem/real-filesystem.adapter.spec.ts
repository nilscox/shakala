import { FileNotFoundError } from 'backend-application';
import { mockReject, mockResolve } from 'shared';

import { RealFilesystemAdapter } from './real-filesystem.adapter';

describe('RealFilesystemAdapter', () => {
  it('reads a file from the filesystem', async () => {
    const readFile = mockResolve(Buffer.from('content'));
    const filesystem = new RealFilesystemAdapter('/base', { readFile });

    const result = await filesystem.readEmailTemplate('file.mjml');

    expect(result).toEqual('content');
    expect(readFile).toHaveBeenCalledWith('/base/email-templates/file.mjml');
  });

  it('throws a FileNotFound error', async () => {
    const error = Object.assign(new Error(), { syscall: 'open', code: 'ENOENT' });
    const readFile = mockReject(error);
    const filesystem = new RealFilesystemAdapter('/', { readFile });

    await expect.rejects(filesystem.readEmailTemplate('/root/.ssh')).with(FileNotFoundError);
  });
});
