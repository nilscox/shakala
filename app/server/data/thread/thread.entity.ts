export type ThreadProps = {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export class ThreadEntity {
  constructor(private props: ThreadProps) {}

  get id() {
    return this.props.id;
  }

  get authorId() {
    return this.props.authorId;
  }

  get text() {
    return this.props.text;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
