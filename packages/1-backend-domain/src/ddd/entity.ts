export type EntityProps<T = unknown> = T & {
  id: string;
};

export class Entity<Props extends EntityProps> {
  protected props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }

  equals(other: Entity<EntityProps>) {
    return other.id === this.id;
  }
}
