export class DomainEvent {
  constructor(public readonly aggregate: string, public readonly id: string) {}
}
