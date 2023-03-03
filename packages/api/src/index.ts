import { container } from './container';
import { Application } from './infrastructure/application';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

main().catch(console.error);

async function main() {
  const application = new Application();

  await application.init({
    common: { logger: 'console' },
    email: { emailSender: 'nodemailer' },
    thread: { repositories: 'filesystem' },
    user: { repositories: 'filesystem' },
    api: { server: 'prod' },
  });

  await container.get(API_TOKENS.server).listen();
}
