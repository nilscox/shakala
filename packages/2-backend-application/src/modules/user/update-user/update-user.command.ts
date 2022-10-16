import { ProfileImageData } from 'backend-domain';

import { Authorize, IsAuthenticated } from '../../../authorization';
import { Command, CommandHandler, IEventBus } from '../../../cqs';
import { UserRepository } from '../../../interfaces';
import { AuthenticatedExecutionContext, EventPublisher } from '../../../utils';

type UpdateUserProps = Partial<{
  profileImage: ProfileImageData | null;
}>;

export class UpdateUserCommand implements Command {
  constructor(public readonly props: UpdateUserProps) {}
}

@Authorize(IsAuthenticated)
export class UpdateUserHandler implements CommandHandler<UpdateUserCommand> {
  constructor(private readonly eventBus: IEventBus, private readonly userRepository: UserRepository) {}

  async handle(command: UpdateUserCommand, ctx: AuthenticatedExecutionContext): Promise<void> {
    const { props } = command;
    const { profileImage: profileImageData } = props;
    const { user } = ctx;

    const publisher = new EventPublisher(ctx, user);

    if (typeof profileImageData !== 'undefined') {
      await user.setProfileImage(profileImageData);
    }

    await this.userRepository.save(user);
    publisher.publish(this.eventBus);
  }
}
