import { GeneratorService, Comment, Author, Markdown, Timestamp, DateService } from 'backend-domain';
import { Message } from 'backend-domain/src/domain/message.entity';

import { CommandHandler } from '../cqs/command-handler';
import { CommentRepository } from '../interfaces/comment.repository';
import { UserRepository } from '../interfaces/user.repository';

export class CreateCommentCommand {
  constructor(
    public readonly threadId: string,
    public readonly authorId: string,
    public readonly parentId: string | null,
    public readonly text: string,
  ) {}
}

export class CreateCommentCommandHandler implements CommandHandler<CreateCommentCommand, string> {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly dateService: DateService,
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // todo: assert that parentId c threadId
  async handle(command: CreateCommentCommand): Promise<string> {
    const { threadId, authorId, parentId, text } = command;

    const author = await this.userRepository.findByIdOrFail(authorId);

    const comment = new Comment(
      {
        id: await this.generatorService.generateId(),
        threadId,
        author: new Author(author),
        parentId,
        history: [],
        message: new Message({
          id: await this.generatorService.generateId(),
          author: new Author(author),
          date: Timestamp.now(this.dateService),
          text: new Markdown(text),
        }),
      },
      this.generatorService,
    );

    await this.commentRepository.save(comment);

    return comment.id;
  }
}
