import { AggregateRoot } from '../ddd/aggregate-root';
import { EntityProps } from '../ddd/entity';
import { ThreadCreatedEvent } from '../events/thread/thread-created.event';

import { Author } from './author.entity';
import { Markdown } from './markdown.value-object';
import { Timestamp } from './timestamp.value-object';

export type ThreadProps = EntityProps<{
  author: Author;
  description: string;
  text: Markdown;
  keywords: string[];
  created: Timestamp;
}>;

export class Thread extends AggregateRoot<ThreadProps> {
  static create(props: ThreadProps) {
    const thread = new Thread(props);

    thread.addEvent(new ThreadCreatedEvent(thread.id));

    return thread;
  }

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
