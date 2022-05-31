import { inject, injectable } from 'inversify';

import { DateService, DateServiceToken } from '../common/date.service';
import { GeneratorService, GeneratorServiceToken } from '../common/generator.service';
import { Timestamp } from '../common/timestamp.value-object';
import { CommentRepository, CommentRepositoryToken } from '../data/comment/comment.repository';
import { User } from '../user/user.entity';

import { Comment, CommentAuthor } from './comment.entity';
import { Markdown } from './markdown.value-object';

@injectable()
export class CommentService {
  constructor(
    @inject(DateServiceToken)
    private readonly dateService: DateService,
    @inject(GeneratorServiceToken)
    private readonly generatorService: GeneratorService,
    @inject(CommentRepositoryToken)
    private readonly commentRepository: CommentRepository,
  ) {}

  findForThread = this.commentRepository.findForThread.bind(this.commentRepository);
  findReplies = this.commentRepository.findReplies.bind(this.commentRepository);

  async createComment(
    author: User,
    threadId: string,
    parentId: string | null,
    text: string,
  ): Promise<Comment> {
    const comment = Comment.create({
      id: await this.generatorService.generateId(),
      threadId,
      author: CommentAuthor.create(author),
      parentId,
      text: Markdown.create(text),
      upvotes: 0,
      downvotes: 0,
      creationDate: Timestamp.now(this.dateService),
      lastEditionDate: Timestamp.now(this.dateService),
    });

    await this.commentRepository.save(comment);

    return comment;
  }

  async updateComment(author: User, commentId: string, text: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error(`Cannot find comment with id ${commentId}`);
    }

    comment.edit(this.dateService, author, text);

    await this.commentRepository.save(comment);
  }
}
