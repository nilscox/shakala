import { type EntityProps, Entity } from '../ddd/entity';
import type { CryptoService } from '../interfaces/crypto.interface';
import { DateService } from '../interfaces/date.interface';

import { DomainError } from './domain-error';
import { Nick } from './nick.value-object';
import { ProfileImage } from './profile-image.value-object';
import { Timestamp } from './timestamp.value-object';

export type UserProps = EntityProps<{
  email: string;
  hashedPassword: string;
  nick: Nick;
  profileImage: ProfileImage;
  signupDate: Timestamp;
  lastLoginDate: Timestamp | null;
}>;

type CreateUserProps = {
  id: string;
  nick: string;
  email: string;
  password: string;
};

export class User extends Entity<UserProps> {
  constructor(props: UserProps, private readonly dateService: DateService, private readonly cryptoService: CryptoService) {
    super(props)
  }

  static async create(
    { id, nick, email, password }: CreateUserProps,
    dateService: DateService,
    cryptoService: CryptoService,
  ) {
    return new User({
      id,
      nick: new Nick(nick),
      email,
      hashedPassword: await cryptoService.hash(password),
      profileImage: new ProfileImage(),
      signupDate: new Timestamp(dateService.nowAsString()),
      lastLoginDate: null,
    }, dateService, cryptoService);
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

  get profileImage() {
    return this.props.profileImage;
  }

  get signupDate() {
    return this.props.signupDate;
  }

  get lastLoginDate() {
    return this.props.lastLoginDate;
  }

  async authenticate(password: string): Promise<void> {
    const matchPassword = await this.cryptoService.compare(password, this.props.hashedPassword);

    if (!matchPassword) {
      throw new InvalidCredentialsError()
    }

    this.props.lastLoginDate = new Timestamp(this.dateService.now());
  }

}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('InvalidCredentials', undefined);
  }
}
