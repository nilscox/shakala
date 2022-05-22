import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { inject, injectable } from 'inversify';

import { UserRepository, UserRepositoryToken } from '~/data/user.repository';

import { SessionService, SessionServiceToken } from '../common/session.service';
import { ValidationError, ValidationService } from '../common/validation.service';
import { FormValues } from '../types/form-values';
import { badRequest, created } from '../utils/responses';
import { tryCatch } from '../utils/try-catch';

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
    @inject(ThreadService)
    private readonly threadService: ThreadService,
  ) {}

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

      const comment = await this.threadService.createComment(
        user,
        dto.threadId,
        dto.parentId ?? null,
        dto.message,
      );

      return created(comment);
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

      return new Response(undefined, { status: 204 });
    })
      .catch(ValidationError, (error) => badRequest(error.formatted))
      .value();
  }
}
