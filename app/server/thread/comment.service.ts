import { inject, injectable } from 'inversify';

import { GeneratorService, GeneratorServiceToken } from '../common/generator.service';
import { CommentEntity } from '../data/comment/comment.entity';
import { CommentRepository, CommentRepositoryToken } from '../data/comment/comment.repository';
import { UserEntity } from '../data/user/user.entity';

@injectable()
export class CommentService {
  constructor(
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await this.commentRepository.save(comment);

    return comment;
  }

  async updateComment(author: UserEntity, commentId: string, text: string): Promise<void> {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) {
      throw new Error(`Cannot find comment with id ${commentId}`);
    }

    comment.text = text;

    await this.commentRepository.save(comment);
  }
}
