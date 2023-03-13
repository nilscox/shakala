import { EntityFactory, randomId, Timestamp, ValueObjectFactory } from '@shakala/common';

import { Nick } from './entities/nick.value-object';
import { User } from './entities/user.entity';

type Factories = {
  nick: ValueObjectFactory<Nick>;
  user: EntityFactory<User>;
};

export const create: Factories = {
  nick(nick = 'nick') {
    return new Nick(nick);
  },

  user(props) {
    return new User({
      id: randomId(),
      email: '',
      hashedPassword: '',
      nick: this.nick(),
      signupDate: new Timestamp(0),
      ...props,
    });
  },
};
