import { ClassType, EnvConfigAdapter, RealFilesystemAdapter, TOKENS } from '@shakala/common';
import {
  EMAIL_TOKENS,
  MjmlEmailCompilerAdapter,
  NodeMailerEmailSenderAdapter,
  SendEmailHandler,
} from '@shakala/email';
import {
  CheckUserPasswordHandler,
  CreateUserHandler,
  FilesystemUserRepository,
  SendEmailToCreatedUserHandler,
  USER_TOKENS,
  ValidateUserEmailHandler,
} from '@shakala/user';
import { Container, Token } from 'brandi';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { BcryptAdapter } from './infrastructure/bcrypt.adapter';
import { EmitterEventPublisher } from './infrastructure/emitter-event-publisher';
import { NanoidGeneratorAdapter } from './infrastructure/nanoid-generator.adapter';
import { RealCommandBus } from './infrastructure/real-command-bus';
import { Server } from './infrastructure/server';
import { API_TOKENS } from './tokens';

export const container = new Container();

bind(TOKENS.config, EnvConfigAdapter);
bind(TOKENS.filesystem, RealFilesystemAdapter);
bind(TOKENS.generator, NanoidGeneratorAdapter);
bind(TOKENS.crypto, BcryptAdapter);
bind(TOKENS.publisher, EmitterEventPublisher);
bind(TOKENS.commandBus, RealCommandBus);

bind(EMAIL_TOKENS.sendEmailHandler, SendEmailHandler);
bind(EMAIL_TOKENS.emailCompiler, MjmlEmailCompilerAdapter);
bind(EMAIL_TOKENS.emailSender, NodeMailerEmailSenderAdapter);

bind(USER_TOKENS.userRepository, FilesystemUserRepository);
// bind(USER_TOKENS.userRepository, InMemoryUserRepository);
bind(USER_TOKENS.createUserHandler, CreateUserHandler);
bind(USER_TOKENS.checkUserPasswordHandler, CheckUserPasswordHandler);
bind(USER_TOKENS.validateUserEmailHandler, ValidateUserEmailHandler);
bind(USER_TOKENS.sendEmailToCreatedUserHandler, SendEmailToCreatedUserHandler);

bind(API_TOKENS.authController, AuthController);
bind(API_TOKENS.userController, UserController);
bind(API_TOKENS.server, Server);

function bind<Cls>(token: Token<Cls>, Instance: ClassType<Cls>) {
  container.bind(token).toInstance(Instance).inContainerScope();
}
