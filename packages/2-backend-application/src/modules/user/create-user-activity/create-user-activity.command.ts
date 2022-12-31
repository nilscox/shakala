import { DomainEvent, UserActivityService } from '@shakala/backend-domain';

import { Command, CommandHandler } from '../../../cqs';
import { CommentRepository, ThreadRepository, UserActivityRepository } from '../../../interfaces';

export class CreateUserActivityCommand implements Command {
  constructor(public readonly event: DomainEvent) {}
}

export class CreateUserActivityHandler implements CommandHandler<CreateUserActivityCommand> {
  constructor(
    private readonly userActivityRepository: UserActivityRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly commentRepository: CommentRepository,
    private readonly userActivityService: UserActivityService,
  ) {}

  async handle(command: CreateUserActivityCommand): Promise<void> {
    const { event } = command;

    const activity = await this.userActivityService.mapEventToUserActivity(event, {
      getThread: this.threadRepository.findByIdOrFail.bind(this.threadRepository),
      getComment: this.commentRepository.findByIdOrFail.bind(this.commentRepository),
    });

    if (activity !== undefined) {
      await this.userActivityRepository.save(activity);
    }
  }
}
