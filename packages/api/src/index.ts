import { container } from './container';
import { Application } from './infrastructure/application';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

main().catch(console.error);

async function main() {
  const application = new Application({
    common: { logger: 'console', buses: 'local', generator: 'nanoid' },
    email: { emailSender: 'nodemailer' },
    notification: { repositories: 'filesystem' },
    thread: { repositories: 'filesystem' },
    user: { repositories: 'filesystem' },
    api: { server: 'prod' },
  });

  await application.init();
  await container.get(API_TOKENS.server).listen();
}
