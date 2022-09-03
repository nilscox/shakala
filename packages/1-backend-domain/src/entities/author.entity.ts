import { Entity, EntityProps } from '../ddd/entity';

import { Nick } from './nick.value-object';
import { ProfileImage } from './profile-image.value-object';

export type AuthorProps = EntityProps<{
  nick: Nick;
  profileImage: ProfileImage;
}>;

export class Author extends Entity<AuthorProps> {
  // todo: remove the ctor?
  constructor(props: AuthorProps) {
    super({
      id: props.id,
      nick: props.nick,
      profileImage: props.profileImage,
    });
  }

  get nick() {
    return this.props.nick;
  }

  get profileImage() {
    return this.props.profileImage;
  }
}
