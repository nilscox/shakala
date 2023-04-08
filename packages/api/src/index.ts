import { TOKENS } from '@shakala/common';
import dotenv from 'dotenv';

import { container } from './container';
import { Application } from './infrastructure/application';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

dotenv.config();

async function main() {
  const application = new Application();

  await application.init();

  const server = container.get(API_TOKENS.server);
  await server.listen();

  const close = (sig: string) => {
    container.get(TOKENS.logger).verbose(`received signal ${sig}`);
    void application.close();
  };

  process.on('SIGINT', close);
  process.on('SIGTERM', close);
}
