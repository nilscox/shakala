import {
  commandCreator,
  CommandHandler,
  DatePort,
  GeneratorPort,
  registerCommand,
  TOKENS,
} from '@shakala/common';
import { UserActivityType, UserActivityPayload } from '@shakala/shared';
import { injected } from 'brandi';

import { UserActivity } from '../../entities/user-activity.entity';
import { UserActivityRepository } from '../../repositories/user-activity/user-activity.repository';
import { USER_TOKENS } from '../../tokens';

export type CreateUserActivityCommand<Type extends UserActivityType = UserActivityType> = {
  userId: string;
  type: Type;
  payload: UserActivityPayload[Type];
};

export const createUserActivity = commandCreator<CreateUserActivityCommand>('createUserActivity');

export class CreateUserActivityHandler
  implements CommandHandler<CreateUserActivityCommand<UserActivityType>>
{
  constructor(
    private readonly generator: GeneratorPort,
    private readonly dateAdapter: DatePort,
    private readonly userActivityRepository: UserActivityRepository
  ) {}

  async handle<Type extends UserActivityType>(command: CreateUserActivityCommand<Type>): Promise<void> {
    const activity = new UserActivity({
      id: await this.generator.generateId(),
      date: this.dateAdapter.now(),
      type: command.type,
      userId: command.userId,
      payload: command.payload,
    });

    await this.userActivityRepository.save(activity);
  }
}

injected(
  CreateUserActivityHandler,
  TOKENS.generator,
  TOKENS.date,
  USER_TOKENS.repositories.userActivityRepository
);

registerCommand(createUserActivity, USER_TOKENS.commands.createUserActivityHandler);
