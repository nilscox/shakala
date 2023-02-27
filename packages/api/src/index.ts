import { TOKENS } from '@shakala/common';
import { EMAIL_TOKENS } from '@shakala/email';
import { setupUserListeners } from '@shakala/user';

import { container } from './container';
import { EmitterEventPublisher } from './infrastructure/emitter-event-publisher';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

startServer().catch(console.error);

async function startServer() {
  const publisher = container.get(TOKENS.publisher) as EmitterEventPublisher;

  setupUserListeners((EventClass, token) => {
    publisher.on(EventClass.name, (event) => {
      container
        .get(token)
        .handle(event)
        .catch((error) => {
          // todo: report error
          console.log(error);
        });
    });
  });

  await container.get(TOKENS.config).init?.();
  await container.get(EMAIL_TOKENS.sendEmailHandler).init();
  await container.get(API_TOKENS.server).listen();
}
