import {
  AnyDomainEvent,
  CommandBus,
  DomainEvent,
  EventHandler,
  registerEventHandler,
  TOKENS,
} from '@shakala/common';
import { UserActivityPayload, UserActivityType } from '@shakala/shared';
import { injected } from 'brandi';

import {
  SessionCreatedEvent,
  SessionDeletedEvent,
  UserCreatedEvent,
} from '../../commands/create-user/create-user';
import { createUserActivity } from '../../commands/create-user-activity/create-user-activity';
import { UserNickChangedEvent } from '../../commands/update-user-profile/update-user-profile';
import { UserEmailValidatedEvent } from '../../commands/validate-user-email/validate-user-email';
import { USER_TOKENS } from '../../tokens';

export class UserUserActivitiesHandler implements EventHandler<DomainEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof UserCreatedEvent) {
      await this.createActivity(UserActivityType.signUp, event);
    }

    if (event instanceof SessionCreatedEvent) {
      await this.createActivity(UserActivityType.signIn, event);
    }

    if (event instanceof SessionDeletedEvent) {
      await this.createActivity(UserActivityType.signOut, event);
    }

    if (event instanceof UserEmailValidatedEvent) {
      await this.createActivity(UserActivityType.emailAddressValidated, event);
    }

    if (event instanceof UserNickChangedEvent) {
      await this.createActivity(UserActivityType.nickChanged, event, event.details);
    }
  }

  private async createActivity<Type extends UserActivityType>(
    type: Type,
    event: AnyDomainEvent,
    payload?: UserActivityPayload[Type]
  ) {
    await this.commandBus.execute(
      createUserActivity({
        type,
        userId: event.id,
        payload,
      })
    );
  }
}

injected(UserUserActivitiesHandler, TOKENS.commandBus);

registerEventHandler(UserCreatedEvent, USER_TOKENS.eventHandlers.userUserActivitiesHandler);
registerEventHandler(SessionCreatedEvent, USER_TOKENS.eventHandlers.userUserActivitiesHandler);
registerEventHandler(SessionDeletedEvent, USER_TOKENS.eventHandlers.userUserActivitiesHandler);
registerEventHandler(UserEmailValidatedEvent, USER_TOKENS.eventHandlers.userUserActivitiesHandler);
registerEventHandler(UserNickChangedEvent, USER_TOKENS.eventHandlers.userUserActivitiesHandler);
