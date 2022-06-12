import { type EntityProps, Entity } from '../ddd/entity';

import type { Markdown } from './markdown.value-object';
import type { Nick } from './nick.value-object';
import type { ProfileImage } from './profile-image.value-object';
import type { Timestamp } from './timestamp.value-object';

export type ThreadAuthorProps = EntityProps<{
  nick: Nick;
  profileImage: ProfileImage;
}>;

export class ThreadAuthor extends Entity<ThreadAuthorProps> {
  static create(props: ThreadAuthorProps) {
    return new ThreadAuthor(props);
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
  text: Markdown;
  created: Timestamp;
}>;

export class Thread extends Entity<ThreadProps> {
  static create(props: ThreadProps) {
    return new Thread(props);
  }

  get author() {
    return this.props.author;
  }

  get text() {
    return this.props.text;
  }

  get created() {
    return this.props.created;
  }
}
