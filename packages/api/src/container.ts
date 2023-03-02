import {
  BcryptAdapter,
  ClassType,
  ConsoleLoggerAdapter,
  EnvConfigAdapter,
  LocalCommandBus,
  LocalQueryBus,
  NanoidGeneratorAdapter,
  NativeDateAdapter,
  LocalFilesystemAdapter,
  TOKENS,
} from '@shakala/common';
import { Container, Token } from 'brandi';

import { AuthController } from './controllers/auth.controller';
import { CommentController } from './controllers/comment.controller';
import { ThreadController } from './controllers/thread.controller';
import { UserController } from './controllers/user.controller';
import { EmitterEventPublisher } from './infrastructure/emitter-event-publisher';
import { Server } from './infrastructure/server';
import { API_TOKENS } from './tokens';

export const container = new Container();

container.bind(TOKENS.logger).toInstance(ConsoleLoggerAdapter).inTransientScope();

bind(TOKENS.commandBus, LocalCommandBus);
bind(TOKENS.config, EnvConfigAdapter);
bind(TOKENS.crypto, BcryptAdapter);
bind(TOKENS.date, NativeDateAdapter);
bind(TOKENS.filesystem, LocalFilesystemAdapter);
bind(TOKENS.generator, NanoidGeneratorAdapter);
bind(TOKENS.publisher, EmitterEventPublisher);
bind(TOKENS.queryBus, LocalQueryBus);

bind(API_TOKENS.controllers.authController, AuthController);
bind(API_TOKENS.controllers.userController, UserController);
bind(API_TOKENS.controllers.threadController, ThreadController);
bind(API_TOKENS.controllers.commentController, CommentController);

bind(API_TOKENS.server, Server);

function bind<Cls>(token: Token<Cls>, Instance: ClassType<Cls>) {
  container.bind(token).toInstance(Instance).inContainerScope();
}
