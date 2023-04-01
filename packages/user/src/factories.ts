import { EntityFactory, randomId, Timestamp, ValueObjectFactory } from '@shakala/common';
import { UserActivityType } from '@shakala/shared';

import { Nick } from './entities/nick.value-object';
import { UserActivity } from './entities/user-activity.entity';
import { User } from './entities/user.entity';

type Factories = {
  nick: ValueObjectFactory<Nick>;
  user: EntityFactory<User>;
  userActivity: EntityFactory<UserActivity>;
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

  userActivity(props) {
    return new UserActivity({
      id: randomId(),
      type: UserActivityType.signUp,
      date: new Timestamp(0),
      userId: '',
      payload: undefined,
      ...props,
    });
  },
};
