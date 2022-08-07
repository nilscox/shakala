import { Entity, EntityProps } from '../ddd/entity';

import { Author } from './author.entity';
import { Markdown } from './markdown.value-object';
import { Timestamp } from './timestamp.value-object';

export type MessageProps = EntityProps<{
  author: Author;
  date: Timestamp;
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
