import { Comment, CommentAuthor, Markdown, Timestamp, DateService } from 'backend-domain';

import { CommandHandler } from '../cqs/command-handler';
import { CommentRepository } from '../interfaces/comment.repository';
import { GeneratorService } from '../interfaces/generator.service';
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

    const comment = Comment.create({
      id: await this.generatorService.generateId(),
      threadId,
      author: CommentAuthor.create(author),
      parentId,
      text: Markdown.create(text),
      creationDate: Timestamp.now(this.dateService),
      lastEditionDate: Timestamp.now(this.dateService),
    });

    await this.commentRepository.save(comment);

    return comment.id;
  }
}
