import { first } from 'shared';

import { Entity, EntityProps } from '../ddd/entity';
import { DateService } from '../interfaces/date.interface';
import { GeneratorService } from '../interfaces/generator-service.interface';

import { Author } from './author.entity';
import { DomainError } from './domain-error';
import { Markdown } from './markdown.value-object';
import { Message } from './message.entity';
import { Timestamp } from './timestamp.value-object';
import { User } from './user.entity';

export class UserMustBeAuthorError extends DomainError {
  constructor() {
    super('User is not the author of the comment', undefined);
  }
}

export type CommentProps = EntityProps<{
  threadId: string;
  author: Author;
  parentId: string | null;
  message: Message;
  history: Message[];
}>;

export class Comment extends Entity<CommentProps> {
  constructor(props: CommentProps, private readonly generatorService: GeneratorService) {
    super(props);
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

  async edit(dateService: DateService, user: User, text: string) {
    if (!user.equals(this.author)) {
      throw new UserMustBeAuthorError();
    }

    this.props.history.push(this.message);

    this.props.message = new Message({
      id: await this.generatorService.generateId(),
      author: this.author,
      date: new Timestamp(dateService.now()),
      text: new Markdown(text),
    });
  }
}
