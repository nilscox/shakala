import { inject, injectable } from 'inversify';

import { DomainError } from '../authentication/authentication.service';
import { DateService, DateServiceToken } from '../common/date.service';
import { GeneratorService, GeneratorServiceToken } from '../common/generator.service';
import { CommentEntity } from '../data/comment/comment.entity';
import { CommentRepository, CommentRepositoryToken } from '../data/comment/comment.repository';
import { UserEntity } from '../data/user/user.entity';

export class UserMustBeAuthorError extends DomainError {
  constructor() {
    super('User is not the author of the comment');
  }
}

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
    author: UserEntity,
    threadId: string,
    parentId: string | null,
    text: string,
  ): Promise<CommentEntity> {
    const comment = new CommentEntity({
      id: await this.generatorService.generateId(),
      threadId,
      authorId: author.id,
      parentId,
      text: text,
      upvotes: 0,
      downvotes: 0,
      createdAt: this.dateService.nowAsString(),
      updatedAt: this.dateService.nowAsString(),
    });

    await this.commentRepository.save(comment);

    return comment;
  }

  async updateComment(author: UserEntity, commentId: string, text: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error(`Cannot find comment with id ${commentId}`);
    }

    if (comment.authorId !== author.id) {
      throw new UserMustBeAuthorError();
    }

    comment.text = text;
    comment.updatedAt = this.dateService.nowAsString();

    await this.commentRepository.save(comment);
  }
}
