import { BindEventListener, EventHandler, TOKENS } from '@shakala/common';
import { EMAIL_TOKENS } from '@shakala/email';
import { setupUserListeners } from '@shakala/user';

import { container } from './container';
import { EmitterEventPublisher } from './infrastructure/emitter-event-publisher';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

startServer().catch(console.error);

async function startServer() {
  setupUserListeners(bindEventListener);

  await container.get(TOKENS.config).init?.();
  await container.get(EMAIL_TOKENS.sendEmailHandler).init();

  await container.get(API_TOKENS.server).listen();
}

const bindEventListener: BindEventListener = (EventClass, handlerToken) => {
  const publisher = container.get(TOKENS.publisher) as EmitterEventPublisher;

  const handler = container.get(handlerToken);
  type Event = typeof handler extends EventHandler<infer E> ? E : never;

  publisher.on(EventClass.name, (event: Event) => {
    handler.handle(event).catch((error) => {
      // todo: report error
      console.log(error);
    });
  });
};
