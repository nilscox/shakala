import { Entity, EntityProps } from '~/server/ddd/entity';

import { CryptoService } from '../common/crypto.service';
import { Nick } from '../common/nick.value-object';
import { ProfileImage } from '../common/profile-image.value-object';
import { Timestamp } from '../common/timestamp.value-object';

export type UserProps = EntityProps<{
  email: string;
  hashedPassword: string;
  nick: Nick;
  profileImage: ProfileImage;
  signupDate: Timestamp;
  lastLoginDate: Timestamp | null;
}>;

export class User extends Entity<UserProps> {
  static create(props: UserProps) {
    return new User(props);
  }

  get id() {
    return this.props.id;
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
    return cryptoService.compare(this.props.hashedPassword, password);
  }
}
