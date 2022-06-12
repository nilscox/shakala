import { type EntityProps, Entity } from '../ddd/entity';
import type { DateService } from '../interfaces/date.interface';

import { DomainError } from './domain-error';
import { Markdown } from './markdown.value-object';
import type { Nick } from './nick.value-object';
import type { ProfileImage } from './profile-image.value-object';
import { Timestamp } from './timestamp.value-object';
import type { User } from './user.entity';

class InvalidVotesNumberError extends DomainError<{ votes: number }> {
  constructor(votes: number) {
    super('Invalid vote number', { votes });
  }
}

export class UserMustBeAuthorError extends DomainError {
  constructor() {
    super('User is not the author of the comment', undefined);
  }
}

export type CommentAuthorProps = EntityProps<{
  nick: Nick;
  profileImage: ProfileImage;
}>;

export class CommentAuthor extends Entity<CommentAuthorProps> {
  get nick() {
    return this.props.nick;
  }

  get profileImage() {
    return this.props.profileImage;
  }

  static create(props: CommentAuthorProps): CommentAuthor {
    return new CommentAuthor(props);
  }
}

export type CommentProps = EntityProps<{
  threadId: string;
  author: CommentAuthor;
  parentId: string | null;
  text: Markdown;
  upvotes: number;
  downvotes: number;
  creationDate: Timestamp;
  lastEditionDate: Timestamp;
}>;

export class Comment extends Entity<CommentProps> {
  get threadId() {
    return this.props.threadId;
  }

  get author() {
    return this.props.author;
  }

  get parentId() {
    return this.props.parentId;
  }

  get text() {
    return this.props.text;
  }

  get upvotes() {
    return this.props.upvotes;
  }

  get downvotes() {
    return this.props.downvotes;
  }

  get creationDate() {
    return this.props.creationDate;
  }

  get lastEditionDate() {
    return this.props.lastEditionDate;
  }

  static create(props: CommentProps) {
    if (props.downvotes < 0) {
      throw new InvalidVotesNumberError(props.downvotes);
    }

    if (props.upvotes < 0) {
      throw new InvalidVotesNumberError(props.upvotes);
    }

    return new Comment(props);
  }

  edit(dateService: DateService, user: User, text: string) {
    if (!user.equals(this.author)) {
      throw new UserMustBeAuthorError();
    }

    this.props.text = Markdown.create(text);
    this.props.lastEditionDate = Timestamp.create(dateService.nowAsString());
  }
}
