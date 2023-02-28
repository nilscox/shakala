import assert from 'assert';

import { BindEventListener, EventHandler, TOKENS } from '@shakala/common';
import { EMAIL_TOKENS } from '@shakala/email';
import { setupUserListeners, USER_TOKENS } from '@shakala/user';

import { container } from './container';
import { EmitterEventPublisher } from './infrastructure/emitter-event-publisher';
import { RealCommandBus } from './infrastructure/real-command-bus';
import { API_TOKENS } from './tokens';

Error.stackTraceLimit = Infinity;

startServer().catch(console.error);

async function startServer() {
  registerCommandHandlers();
  setupUserListeners(bindEventListener);

  await container.get(TOKENS.config).init?.();
  await container.get(EMAIL_TOKENS.sendEmailHandler).init();

  await container.get(API_TOKENS.server).listen();
}

const registerCommandHandlers = () => {
  const commandBus = container.get(TOKENS.commandBus);

  assert(commandBus instanceof RealCommandBus, 'command bus is not an instance of RealCommandBus');

  commandBus.register(container.get(USER_TOKENS.checkUserPasswordHandler));
  commandBus.register(container.get(USER_TOKENS.createUserHandler));
  commandBus.register(container.get(USER_TOKENS.validateUserEmailHandler));
};

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
