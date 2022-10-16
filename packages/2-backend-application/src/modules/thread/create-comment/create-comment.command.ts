import { Author, Comment, DatePort, GeneratorPort, Markdown, Message, Timestamp } from 'backend-domain';

import { Authorize, HasWriteAccess, IsAuthenticated } from '../../../authorization';
import { CommandHandler, IEventBus } from '../../../cqs';
import { CommentRepository } from '../../../interfaces';
import { AuthenticatedExecutionContext, EventPublisher } from '../../../utils';

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
    private readonly eventBus: IEventBus,
    private readonly generator: GeneratorPort,
    private readonly dateAdapter: DatePort,
    private readonly commentRepository: CommentRepository,
  ) {}

  // todo: assert that parentId c threadId
  async handle(command: CreateCommentCommand, ctx: AuthenticatedExecutionContext): Promise<string> {
    const { threadId, parentId, text } = command;
    const { user: author } = ctx;

    const comment = Comment.create(
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

    const publisher = new EventPublisher(ctx, comment);

    await this.commentRepository.save(comment);
    publisher.publish(this.eventBus);

    return comment.id;
  }
}
