import { spawn } from 'node:child_process';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const persistence = path.resolve(__dirname, '..', '..', 'persistence');

export function clearDatabase() {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn('pnpm', ['db:reset'], {
      cwd: persistence,
      env: {
        PATH: process.env.PATH,
        GITHUB_TOKEN: '',
        TS_PROJECT: path.join(persistence, 'tsconfig.json'),
      },
    });

    proc.stdout.on('data', (line) => process.stdout.write(line));
    proc.stderr.on('data', (line) => process.stderr.write(line));

    proc.on('error', reject);

    proc.on('close', (code) => {
      if (code !== 0) reject(code);
      else resolve();
    });
  });
}
