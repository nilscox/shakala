import { EmailModule } from '@shakala/email';
import { UserModule } from '@shakala/user';

import { container } from './container';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

startServer().catch(console.error);

async function startServer() {
  await new EmailModule(container).init();
  await new UserModule(container).init();

  await container.get(API_TOKENS.server).listen();
}
