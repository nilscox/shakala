export type UserProps = {
  id: string;
  email: string;
  hashedPassword: string;
  nick: string;
  profileImage: string | null;
  signupDate: string;
  lastLoginDate: string | null;
};

export class UserEntity {
  constructor(private props: UserProps) {}

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get hashedPassword() {
    return this.props.hashedPassword;
  }

  get nick() {
    return this.props.nick;
  }

  get signupDate() {
    return this.props.signupDate;
  }

  get lastLoginDate() {
    return this.props.lastLoginDate;
  }
}
