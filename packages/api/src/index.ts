import { TOKENS } from '@shakala/common';

import { container } from './container';
import { Application } from './infrastructure/application';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

main().catch(console.error);

async function main() {
  const application = new Application({
    common: { logger: 'console', buses: 'local', generator: 'nanoid' },
    email: { emailCompiler: 'mjml', emailSender: 'nodemailer' },
    notification: { repositories: 'filesystem' },
    thread: { repositories: 'filesystem' },
    user: { repositories: 'filesystem' },
    api: { server: 'prod' },
  });

  await application.init();

  const server = container.get(API_TOKENS.server);
  await server.listen();

  const close = (sig: string) => {
    container.get(TOKENS.logger).verbose(`received signal ${sig}`);

    void Promise.resolve()
      .then(() => server.close())
      .then(() => application.close())
      .then(() => {
        process.exitCode = 0;
      });
  };

  process.on('SIGINT', close);
  process.on('SIGTERM', close);
}
