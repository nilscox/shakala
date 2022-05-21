import { Container } from 'inversify';

import { InMemoryThreadRepository, ThreadRepositoryToken } from './data/thread.repository.server';
import { InMemoryUserRepository, UserRepositoryToken } from './data/user.repository';
import { AuthenticationController } from './server/authentication/authentication.controller';
import { AuthenticationService } from './server/authentication/authentication.service';
import { CookieSessionService, SessionService, SessionServiceToken } from './server/common/session.service';
import { ValidationService } from './server/common/validation.service';
import { threadFacebookZetetique } from './thread-facebook-zetetique';
import { User } from './types';

const user: User = {
  id: '42',
  email: 'nils@nils.cx',
  hashedPassword: '$2b$10$B0Bfw0ypnDMW1hM/x7L0COD9MoCENH5mSwgda1aAme49h9.du7exu', // tatata123
  nick: 'nilscox',
};

const data = {
  threads: [threadFacebookZetetique],
  users: [user],
};

declare global {
  var _data: typeof data;
}

if (!global._data) {
  global._data = data;
}

const container = new Container();

container.bind('threads').toConstantValue(global._data.threads);
container.bind('users').toConstantValue(global._data.users);

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
