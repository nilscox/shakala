import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { FormValues } from '~/server/types/form-values';

export class CreateCommentDto {
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
export class UpdateCommentDto {
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
