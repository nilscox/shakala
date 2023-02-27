import { Entity, EntityProps } from '@shakala/common';

import { Nick } from './nick.value-object';

type UserProps = EntityProps<{
  nick: Nick;
  email: string;
  hashedPassword: string;
  emailValidationToken?: string;
}>;

export class User extends Entity<UserProps> {
  get nick() {
    return this.props.nick;
  }

  get email() {
    return this.props.email;
  }

  get hashedPassword() {
    return this.props.hashedPassword;
  }

  get emailValidationToken() {
    return this.props.emailValidationToken;
  }
}
