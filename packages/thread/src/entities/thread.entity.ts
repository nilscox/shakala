import { Entity, EntityProps, Timestamp } from '@shakala/common';

import { Markdown } from './markdown.value-object';

export type ThreadProps = EntityProps<{
  authorId: string;
  description: string;
  text: Markdown;
  keywords: string[];
  created: Timestamp;
  edited: Timestamp;
}>;

export class Thread extends Entity<ThreadProps> {
  get authorId() {
    return this.props.authorId;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get text() {
    return this.props.text;
  }

  set text(text: Markdown) {
    this.props.text = text;
  }

  get keywords() {
    return this.props.keywords;
  }

  set keywords(keywords: string[]) {
    this.props.keywords = keywords;
  }

  get created() {
    return this.props.created;
  }

  get edited() {
    return this.props.edited;
  }

  set edited(edited: Timestamp) {
    this.props.edited = edited;
  }
}
