import { type EntityProps, Entity } from '../ddd/entity';

import type { Markdown } from './markdown.value-object';
import type { Nick } from './nick.value-object';
import type { ProfileImage } from './profile-image.value-object';
import type { Timestamp } from './timestamp.value-object';
import { User } from './user.entity';

export type ThreadAuthorProps = EntityProps<{
  nick: Nick;
  profileImage: ProfileImage;
}>;

export class ThreadAuthor extends Entity<ThreadAuthorProps> {
  constructor(user: User) {
    super({
      id: user.id,
      nick: user.nick,
      profileImage: user.profileImage,
    });
  }

  get nick() {
    return this.props.nick;
  }

  get profileImage() {
    return this.props.profileImage;
  }
}

export type ThreadProps = EntityProps<{
  author: ThreadAuthor;
  description: string;
  text: Markdown;
  keywords: string[];
  created: Timestamp;
}>;

export class Thread extends Entity<ThreadProps> {
  get author() {
    return this.props.author;
  }

  get description() {
    return this.props.description;
  }

  get text() {
    return this.props.text;
  }

  get keywords() {
    return this.props.keywords;
  }

  get created() {
    return this.props.created;
  }
}
