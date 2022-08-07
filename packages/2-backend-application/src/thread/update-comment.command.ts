import { DateService } from 'backend-domain';

import { CommandHandler } from '../cqs/command-handler';
import { CommentRepository } from '../interfaces/comment.repository';
import { UserRepository } from '../interfaces/user.repository';

export class UpdateCommentCommand {
  constructor(public commentId: string, public authorId: string, public text: string) {}
}

export class UpdateCommentCommandHandler implements CommandHandler<UpdateCommentCommand> {
  constructor(
    private readonly dateService: DateService,
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async handle(command: UpdateCommentCommand): Promise<void> {
    const { commentId, authorId, text } = command;

    const comment = await this.commentRepository.findByIdOrFail(commentId);
    const author = await this.userRepository.findByIdOrFail(authorId);

    await comment.edit(this.dateService, author, text);

    await this.commentRepository.save(comment);
  }
}
