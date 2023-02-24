export class DomainEvent {
  constructor(public readonly aggregate: string, public readonly identifier: string) {}
}
