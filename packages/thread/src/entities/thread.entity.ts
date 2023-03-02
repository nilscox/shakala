import { Entity, EntityProps, Timestamp } from '@shakala/common';

import { Markdown } from './markdown.value-object';

export type ThreadProps = EntityProps<{
  authorId: string;
  description: string;
  text: Markdown;
  keywords: string[];
  created: Timestamp;
}>;

export class Thread extends Entity<ThreadProps> {
  get authorId() {
    return this.props.authorId;
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
