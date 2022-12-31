import { AuthenticationMethod } from '@shakala/shared';

import { DomainEvent } from '../../ddd/domain-event';

export class UserAuthenticationFailedEvent implements DomainEvent {
  constructor(public readonly userId: string, public readonly authenticationMethod: AuthenticationMethod) {}
}
