import { DateService } from '../common/date.service';
import { DomainError } from '../common/domain-error';
import { Nick } from '../common/nick.value-object';
import { ProfileImage } from '../common/profile-image.value-object';
import { Timestamp } from '../common/timestamp.value-object';
import { Entity, EntityProps } from '../ddd/entity';
import { User } from '../user/user.entity';

import { Markdown } from './markdown.value-object';

class InvalidVotesNumberError extends DomainError {
  constructor(votes: number) {
    super('Invalid vote number', { votes });
  }
}

export class UserMustBeAuthorError extends DomainError {
  constructor() {
    super('User is not the author of the comment');
  }
}

export type CommentAuthorProps = EntityProps<{
  nick: Nick;
  profileImage: ProfileImage;
}>;

export class CommentAuthor extends Entity<CommentAuthorProps> {
  get id() {
    return this.props.id;
  }

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
  get id() {
    return this.props.id;
  }

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
