import { Nick } from '../common/nick.value-object';
import { ProfileImage } from '../common/profile-image.value-object';
import { Timestamp } from '../common/timestamp.value-object';
import { Entity, EntityProps } from '../ddd/entity';

import { Markdown } from './markdown.value-object';

export type ThreadAuthorProps = EntityProps<{
  nick: Nick;
  profileImage: ProfileImage;
}>;

export class ThreadAuthor extends Entity<ThreadAuthorProps> {
  static create(props: ThreadAuthorProps) {
    return new ThreadAuthor(props);
  }

  get id() {
    return this.props.id;
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
