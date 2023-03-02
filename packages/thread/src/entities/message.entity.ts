import { EntityProps, Entity, Timestamp } from '@shakala/common';

import { Markdown } from './markdown.value-object';

export type MessageProps = EntityProps<{
  authorId: string;
  date: Timestamp;
  // todo: rename to content | body (?)
  text: Markdown;
}>;

export class Message extends Entity<MessageProps> {
  get date() {
    return this.props.date;
  }

  get text() {
    return this.props.text;
  }

  override toString() {
    return this.text.toString();
  }
}
