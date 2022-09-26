import { ProfileImageData } from 'backend-domain';

import { Authorize, IsAuthenticated } from '../../../authorization';
import { Command, CommandHandler } from '../../../cqs';
import { UserRepository } from '../../../interfaces';
import { AuthenticatedExecutionContext } from '../../../utils';

type UpdateUserProps = Partial<{
  profileImage: ProfileImageData | null;
}>;

export class UpdateUserCommand implements Command {
  constructor(public readonly props: UpdateUserProps) {}
}

@Authorize(IsAuthenticated)
export class UpdateUserHandler implements CommandHandler<UpdateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: UpdateUserCommand, ctx: AuthenticatedExecutionContext): Promise<void> {
    const { props } = command;
    const { profileImage: profileImageData } = props;
    const { user } = ctx;

    if (typeof profileImageData !== 'undefined') {
      await user.setProfileImage(profileImageData);
    }

    await this.userRepository.save(user);
  }
}
