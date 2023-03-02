import {
  BcryptAdapter,
  ClassType,
  ConsoleLoggerAdapter,
  EnvConfigAdapter,
  LocalCommandBus,
  LocalQueryBus,
  NanoidGeneratorAdapter,
  RealFilesystemAdapter,
  TOKENS,
} from '@shakala/common';
import { Container, Token } from 'brandi';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { EmitterEventPublisher } from './infrastructure/emitter-event-publisher';
import { Server } from './infrastructure/server';
import { API_TOKENS } from './tokens';

export const container = new Container();

container.bind(TOKENS.logger).toInstance(ConsoleLoggerAdapter).inTransientScope();

bind(TOKENS.commandBus, LocalCommandBus);
bind(TOKENS.config, EnvConfigAdapter);
bind(TOKENS.crypto, BcryptAdapter);
bind(TOKENS.filesystem, RealFilesystemAdapter);
bind(TOKENS.generator, NanoidGeneratorAdapter);
bind(TOKENS.publisher, EmitterEventPublisher);
bind(TOKENS.queryBus, LocalQueryBus);

bind(API_TOKENS.authController, AuthController);
bind(API_TOKENS.userController, UserController);
bind(API_TOKENS.server, Server);

function bind<Cls>(token: Token<Cls>, Instance: ClassType<Cls>) {
  container.bind(token).toInstance(Instance).inContainerScope();
}
