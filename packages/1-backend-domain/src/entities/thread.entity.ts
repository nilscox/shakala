import { Entity, type EntityProps } from '../ddd/entity';

import { Author } from './author.entity';
import type { Markdown } from './markdown.value-object';
import type { Timestamp } from './timestamp.value-object';

export type ThreadProps = EntityProps<{
  author: Author;
  description: string;
  text: Markdown;
  keywords: string[];
  created: Timestamp;
}>;

export class Thread extends Entity<ThreadProps> {
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
