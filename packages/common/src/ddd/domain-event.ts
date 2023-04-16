export type DomainEventDetails = Record<string, unknown> | undefined;

export class DomainEvent<Details extends DomainEventDetails = undefined> {
  constructor(
    public readonly aggregate: string,
    public readonly id: string,
    public readonly details?: Details
  ) {}
}

export type AnyDomainEvent = DomainEvent<DomainEventDetails>;
