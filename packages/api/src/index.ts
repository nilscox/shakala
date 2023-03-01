import { TOKENS } from '@shakala/common';
import { EMAIL_TOKENS } from '@shakala/email';
import { UserModule } from '@shakala/user';

import { container } from './container';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

startServer().catch(console.error);

async function startServer() {
  const userModule = new UserModule(container);

  await container.get(TOKENS.config).init?.();
  await container.get(EMAIL_TOKENS.sendEmailHandler).init();
  await userModule.init();

  await container.get(API_TOKENS.server).listen();
}
