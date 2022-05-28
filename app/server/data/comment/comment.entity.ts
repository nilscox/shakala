export type CommentProps = {
  id: string;
  threadId: string;
  authorId: string;
  parentId: string | null;
  text: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
};

export class CommentEntity {
  constructor(private props: CommentProps) {}

  get id() {
    return this.props.id;
  }

  get threadId() {
    return this.props.threadId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get parentId() {
    return this.props.parentId;
  }

  get text() {
    return this.props.text;
  }

  set text(text: string) {
    this.props.text = text;
  }

  get upvotes() {
    return this.props.upvotes;
  }

  get downvotes() {
    return this.props.downvotes;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set updatedAt(updatedAt: string) {
    this.props.updatedAt = updatedAt;
  }
}
