import assert from 'assert';

import { Entity, EntityProps } from '@shakala/common';
import { first, last } from '@shakala/shared';

import { Message } from './message.entity';

export type CommentProps = EntityProps<{
  threadId: string;
  authorId: string;
  parentId?: string;
  messages: Message[];
}>;

export class Comment extends Entity<CommentProps> {
  get threadId() {
    return this.props.threadId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get parentId() {
    return this.props.parentId;
  }

  get message() {
    const lastMessage = last(this.props.messages);

    assert(lastMessage, `expected comment ${this.id} to have at least one message`);

    return lastMessage;
  }

  set message(message: Message) {
    this.props.messages.push(message);
  }

  get history() {
    return this.props.messages.slice(0, -1);
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
}
