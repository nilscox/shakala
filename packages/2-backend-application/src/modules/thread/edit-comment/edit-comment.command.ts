import { Authorize, IsAuthenticated, HasWriteAccess } from '../../../authorization';
import { CommandHandler } from '../../../cqs';
import { CommentRepository } from '../../../interfaces';
import { AuthenticatedExecutionContext } from '../../../utils';

export class EditCommentCommand {
  constructor(public commentId: string, public text: string) {}
}

@Authorize(IsAuthenticated, HasWriteAccess)
export class EditCommentCommandHandler implements CommandHandler<EditCommentCommand> {
  constructor(private readonly commentRepository: CommentRepository) {}

  async handle(command: EditCommentCommand, ctx: AuthenticatedExecutionContext): Promise<void> {
    const { commentId, text } = command;
    const { user: author } = ctx;

    const comment = await this.commentRepository.findByIdOrFail(commentId);

    await comment.edit(author, text);

    await this.commentRepository.save(comment);
  }
}
