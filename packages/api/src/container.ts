import { TOKENS, ClassType } from '@shakala/common';
import {
  USER_TOKENS,
  InMemoryUserRepository,
  CreateUserHandler,
  CheckUserPasswordHandler,
} from '@shakala/user';
import { Container, Token } from 'brandi';

import { AuthController } from './controllers/auth.controller';
import { BcryptAdapter } from './infrastructure/bcrypt.adapter';
import { EmitterEventPublisher } from './infrastructure/emitter-event-publisher';
import { NanoidGeneratorAdapter } from './infrastructure/nanoid-generator.adapter';
import { Server } from './infrastructure/server';
import { API_TOKENS } from './tokens';

export const container = new Container();

bind(TOKENS.generator, NanoidGeneratorAdapter);
bind(TOKENS.crypto, BcryptAdapter);
bind(TOKENS.publisher, EmitterEventPublisher);

bind(USER_TOKENS.userRepository, InMemoryUserRepository);
bind(USER_TOKENS.createUserHandler, CreateUserHandler);
bind(USER_TOKENS.checkUserPasswordHandler, CheckUserPasswordHandler);

bind(API_TOKENS.authController, AuthController);
bind(API_TOKENS.server, Server);

function bind<Cls>(token: Token<Cls>, Instance: ClassType<Cls>) {
  container.bind(token).toInstance(Instance).inContainerScope();
}
