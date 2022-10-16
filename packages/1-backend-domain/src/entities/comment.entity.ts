import { first } from 'shared';

import { AggregateRoot } from '../ddd/aggregate-root';
import { EntityProps } from '../ddd/entity';
import { CommentCreatedEvent } from '../events/comment/comment-created.event';
import { CommentEditedEvent } from '../events/comment/comment-edited.event';
import { DatePort } from '../interfaces/date.interface';
import { GeneratorPort } from '../interfaces/generator.port';

import { Author } from './author.entity';
import { DomainError } from './domain-error';
import { Markdown } from './markdown.value-object';
import { Message } from './message.entity';
import { Timestamp } from './timestamp.value-object';
import { User } from './user.entity';

export const UserMustBeAuthorError = DomainError.extend('user is not the author of the comment');

export type CommentProps = EntityProps<{
  threadId: string;
  author: Author;
  parentId: string | null;
  message: Message;
  history: Message[];
}>;

export class Comment extends AggregateRoot<CommentProps> {
  constructor(
    props: CommentProps,
    private readonly generator: GeneratorPort,
    private readonly date: DatePort,
  ) {
    super(props);
  }

  static create(props: CommentProps, generator: GeneratorPort, date: DatePort) {
    const comment = new Comment(props, generator, date);

    comment.addEvent(new CommentCreatedEvent(comment.id));

    return comment;
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

  get message() {
    return this.props.message;
  }

  get history() {
    return this.props.history;
  }

  get edited() {
    if (this.history.length === 0) {
      return false;
    }

    return this.message.date;
  }

  get creationDate() {
    return first(this.history)?.date ?? this.message.date;
  }

  async edit(user: User, text: string) {
    if (!user.equals(this.author)) {
      throw new UserMustBeAuthorError();
    }

    this.props.history.push(this.message);

    this.props.message = new Message({
      id: await this.generator.generateId(),
      author: this.author,
      date: new Timestamp(this.date.now()),
      text: new Markdown(text),
    });

    this.addEvent(new CommentEditedEvent(this.id));
  }
}
