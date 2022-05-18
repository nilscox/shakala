import { Container } from 'inversify';

import { InMemoryThreadRepository, ThreadRepositoryToken } from './data/thread.repository.server';
import { InMemoryUserRepository, UserRepositoryToken } from './data/user.repository';
import { AuthenticationController } from './lib/authentication.controller';
import { AuthenticationService } from './lib/authentication.service';
import { CookieSessionService, SessionService, SessionServiceToken } from './lib/session.service';
import { ValidationService } from './lib/validation.service';
import { threadFacebookZetetique } from './thread-facebook-zetetique';
import { User } from './types';

const user: User = {
  id: '42',
  email: 'nils@nils.cx',
  hashedPassword: '$2b$10$B0Bfw0ypnDMW1hM/x7L0COD9MoCENH5mSwgda1aAme49h9.du7exu', // tatata123
  nick: 'nilscox,',
};

const container = new Container();

container.bind('threads').toConstantValue([threadFacebookZetetique]);
container.bind('users').toConstantValue([user]);

container.bind('session.secure').toConstantValue(process.env.NODE_ENV === 'production');
container.bind('session.secret').toConstantValue('secret');
container.bind('session.sameSite').toConstantValue('lax');
container.bind('session.maxAge').toConstantValue(60 * 60 * 24 * 30);
container.bind('session.httpOnly').toConstantValue(true);

container.bind(ThreadRepositoryToken).to(InMemoryThreadRepository);
container.bind(UserRepositoryToken).to(InMemoryUserRepository);

container.bind(ValidationService).toSelf();
container.bind(AuthenticationService).toSelf();
container.bind(AuthenticationController).toSelf();

container.bind<SessionService>(SessionServiceToken).to(CookieSessionService);

export default container;
