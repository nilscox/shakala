export type EntityProps<Props = unknown> = { id: string } & Props;

export abstract class Entity<Props extends EntityProps = EntityProps> {
  constructor(protected props: Props) {}

  get id() {
    return this.props.id;
  }

  equals(other: this) {
    return other.id === this.id;
  }
}
