import { Entity, EntityProps, Timestamp } from '@shakala/common';

import { Nick } from './nick.value-object';

type UserProps = EntityProps<{
  nick: Nick;
  email: string;
  hashedPassword: string;
  signupDate: Timestamp;
  emailValidationToken?: string;
}>;

export class User extends Entity<UserProps> {
  get nick() {
    return this.props.nick;
  }

  set nick(nick: Nick) {
    this.props.nick = nick;
  }

  get email() {
    return this.props.email;
  }

  get hashedPassword() {
    return this.props.hashedPassword;
  }

  get signupDate() {
    return this.props.signupDate;
  }

  get emailValidationToken() {
    return this.props.emailValidationToken;
  }

  setEmailValidated() {
    delete this.props.emailValidationToken;
  }
}
