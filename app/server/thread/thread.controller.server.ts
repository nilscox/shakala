import { inject, injectable } from 'inversify';

import { ValidationError, ValidationService } from '~/server/common/validation.service';
import { badRequest, created, forbidden, notFound, ok } from '~/server/utils/responses.server';
import { tryCatch } from '~/server/utils/try-catch';
import { Comment as CommentDto, Sort, Thread as ThreadDto } from '~/types';

import { UserService } from '../user/user.service';
import { SearchParams } from '../utils/search-params';

import { Comment, UserMustBeAuthorError } from './comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './thread.dtos';
import { ThreadService } from './thread.service';

@injectable()
export class ThreadController {
  constructor(
    @inject(ValidationService)
    private readonly validationService: ValidationService,
    @inject(UserService)
    private readonly userService: UserService,
    @inject(ThreadService)
    private readonly threadService: ThreadService,
    @inject(CommentService)
    private readonly commentService: CommentService,
  ) {}

  async getThread(request: Request, threadId: string): Promise<Response> {
    const searchParams = new SearchParams(request);
    const search = searchParams.getString('search');
    const sort = searchParams.getEnum('sort', Sort) ?? Sort.dateAsc;

    const thread = await this.threadService.findThreadById(threadId);

    if (!thread) {
      throw notFound();
    }

    // todo: add the author to the thread aggregate
    const comments = await this.commentService.findForThread(threadId, sort, search);

    const transformComment = async (comment: Comment): Promise<CommentDto> => {
      // todo: n+1 select
      const replies = await this.commentService.findReplies(comment.id);

      return {
        id: comment.id,
        author: {
          id: comment.author.id,
          nick: comment.author.nick.value,
          profileImage: comment.author.profileImage.value ?? undefined,
        },
        text: comment.text.value,
        date: comment.lastEditionDate.value,
        upvotes: comment.upvotes,
        downvotes: comment.downvotes,
        replies: await Promise.all(replies.map(transformComment)),
      };
    };

    const result: ThreadDto = {
      id: thread.id,
      date: thread.created.value,
      author: {
        id: thread.author.id,
        nick: thread.author.nick.value,
        profileImage: thread.author.profileImage.value ?? undefined,
      },
      text: thread.text.value,
      comments: await Promise.all(comments.map(transformComment)),
    };

    return ok(result);
  }

  async createComment(request: Request): Promise<Response> {
    const user = await this.userService.requireUser(request);

    const form = await request.formData();
    const dto = new CreateCommentDto({
      threadId: form.get('threadId'),
      parentId: form.get('parentId'),
      message: form.get('message'),
    });

    return tryCatch(async () => {
      await this.validationService.validate(dto);
      await this.commentService.createComment(user, dto.threadId, dto.parentId || null, dto.message);

      return created({ ok: true });
    })
      .catch(ValidationError, (error) => badRequest(error.formatted))
      .value();
  }

  async updateComment(request: Request): Promise<Response> {
    const user = await this.userService.requireUser(request);

    const form = await request.formData();
    const dto = new UpdateCommentDto({
      commentId: form.get('commentId'),
      message: form.get('message'),
    });

    return tryCatch(async () => {
      await this.validationService.validate(dto);
      await this.commentService.updateComment(user, dto.commentId, dto.message);

      return ok({ ok: true });
    })
      .catch(ValidationError, (error) => badRequest(error.formatted))
      .catch(UserMustBeAuthorError, (error) =>
        forbidden({ error: 'UserMustBeAuthor', details: error.message }),
      )
      .value();
  }
}
