import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { inject, injectable } from 'inversify';

import { SessionService, SessionServiceToken } from '~/server/common/session.service';
import { ValidationError, ValidationService } from '~/server/common/validation.service';
import { UserRepository, UserRepositoryToken } from '~/server/data/user/user.repository';
import { FormValues } from '~/server/types/form-values';
import { badRequest, created, noContent, notFound, ok } from '~/server/utils/responses.server';
import { tryCatch } from '~/server/utils/try-catch';
import { Sort } from '~/types';

import { ThreadRepository, ThreadRepositoryToken } from '../repositories/thread.repository.server';
import { SearchParams } from '../utils/search-params';

import { ThreadService } from './thread.service';

class CreateCommentDto {
  constructor(data: FormValues<CreateCommentDto>) {
    Object.assign(this, data);
  }

  @IsString()
  @IsNotEmpty()
  threadId!: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  message!: string;
}

class UpdateCommentDto {
  constructor(data: FormValues<UpdateCommentDto>) {
    Object.assign(this, data);
  }

  @IsString()
  @IsNotEmpty()
  commentId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  message!: string;
}

@injectable()
export class ThreadController {
  constructor(
    @inject(SessionServiceToken)
    private readonly sessionService: SessionService,
    @inject(ValidationService)
    private readonly validationService: ValidationService,
    @inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
    @inject(ThreadRepositoryToken)
    private readonly threadRepository: ThreadRepository,
    @inject(ThreadService)
    private readonly threadService: ThreadService,
  ) {}

  async getThread(request: Request, threadId: string): Promise<Response> {
    const searchParams = new SearchParams(request);
    const search = searchParams.getString('search');
    const sort = searchParams.getEnum('sort', Sort) ?? Sort.dateAsc;

    const thread = await this.threadRepository.findById(threadId);

    if (!thread) {
      throw notFound();
    }

    const comments = await this.threadRepository.findComments(threadId, sort, search);

    return ok({
      ...thread,
      comments,
    });
  }

  async createComment(request: Request): Promise<Response> {
    const userId = await this.sessionService.requireUserId(request);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`cannot find user with id "${userId}"`);
    }

    const form = await request.formData();
    const dto = new CreateCommentDto({
      threadId: form.get('threadId'),
      parentId: form.get('parentId'),
      message: form.get('message'),
    });

    return tryCatch(async () => {
      await this.validationService.validate(dto);

      await this.threadService.createComment(user, dto.threadId, dto.parentId ?? null, dto.message);

      return created();
    })
      .catch(ValidationError, (error) => badRequest(error.formatted))
      .value();
  }

  async updateComment(request: Request): Promise<Response> {
    const userId = await this.sessionService.requireUserId(request);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`cannot find user with id "${userId}"`);
    }

    const form = await request.formData();
    const dto = new UpdateCommentDto({
      commentId: form.get('commentId'),
      message: form.get('message'),
    });

    return tryCatch(async () => {
      await this.validationService.validate(dto);

      await this.threadService.updateComment(user, dto.commentId, dto.message);

      return noContent();
    })
      .catch(ValidationError, (error) => badRequest(error.formatted))
      .value();
  }
}
