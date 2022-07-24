export type EntityProps<T = unknown> = T & {
  id: string;
};

export class Entity<Props extends EntityProps> {
  constructor(protected props: Props) {}

  get id() {
    return this.props.id;
  }

  equals(other: Entity<EntityProps>) {
    return other.id === this.id;
  }
}
