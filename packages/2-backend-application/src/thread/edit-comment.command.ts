import { CommandHandler } from '../cqs/command-handler';
import { CommentRepository } from '../interfaces/comment.repository';
import { UserRepository } from '../interfaces/user.repository';

export class EditCommentCommand {
  constructor(public commentId: string, public authorId: string, public text: string) {}
}

export class EditCommentCommandHandler implements CommandHandler<EditCommentCommand> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async handle(command: EditCommentCommand): Promise<void> {
    const { commentId, authorId, text } = command;

    const comment = await this.commentRepository.findByIdOrFail(commentId);
    const author = await this.userRepository.findByIdOrFail(authorId);

    await comment.edit(author, text);

    await this.commentRepository.save(comment);
  }
}
