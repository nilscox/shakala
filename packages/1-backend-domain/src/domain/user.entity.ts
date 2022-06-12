import { type EntityProps, Entity } from '../ddd/entity';
import type { CryptoService } from '../interfaces/crypto.interface';
import { DateService } from '../interfaces/date.interface';

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
  static create(props: UserProps) {
    return new User(props);
  }

  static async createNew(
    cryptoService: CryptoService,
    dateService: DateService,
    { id, nick, email, password }: CreateUserProps,
  ) {
    return new User({
      id,
      nick: Nick.create(nick),
      email,
      hashedPassword: await cryptoService.hash(password),
      profileImage: ProfileImage.create(),
      signupDate: Timestamp.create(dateService.nowAsString()),
      lastLoginDate: null,
    });
  }

  get email() {
    return this.props.email;
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

  async checkPassword(cryptoService: CryptoService, password: string): Promise<boolean> {
    return cryptoService.compare(password, this.props.hashedPassword);
  }

  login(dateService: DateService) {
    this.props.lastLoginDate = Timestamp.create(dateService.now());
  }
}
