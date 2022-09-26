import { Author, Comment, DatePort, GeneratorPort, Markdown, Message, Timestamp } from 'backend-domain';

import { Authorize, HasWriteAccess, IsAuthenticated } from '../../authorization';
import { CommandHandler } from '../../cqs/command-handler';
import { CommentRepository } from '../../interfaces/repositories';
import { AuthenticatedExecutionContext } from '../../utils/execution-context';

export class CreateCommentCommand {
  constructor(
    public readonly threadId: string,
    public readonly parentId: string | null,
    public readonly text: string,
  ) {}
}

@Authorize(IsAuthenticated, HasWriteAccess)
export class CreateCommentCommandHandler implements CommandHandler<CreateCommentCommand, string> {
  constructor(
    private readonly generator: GeneratorPort,
    private readonly dateAdapter: DatePort,
    private readonly commentRepository: CommentRepository,
  ) {}

  // todo: assert that parentId c threadId
  async handle(command: CreateCommentCommand, ctx: AuthenticatedExecutionContext): Promise<string> {
    const { threadId, parentId, text } = command;
    const { user: author } = ctx;

    const comment = new Comment(
      {
        id: await this.generator.generateId(),
        threadId,
        author: new Author(author),
        parentId,
        history: [],
        message: new Message({
          id: await this.generator.generateId(),
          author: new Author(author),
          date: Timestamp.now(this.dateAdapter),
          text: new Markdown(text),
        }),
      },
      this.generator,
      this.dateAdapter,
    );

    await this.commentRepository.save(comment);

    return comment.id;
  }
}
