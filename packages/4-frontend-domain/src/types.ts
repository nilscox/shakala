import { AuthUserDto, CommentDto, ThreadDto } from 'shared';

export class ValidationError {
  constructor(public readonly fields: Array<{ field: string; error: string }>) {}
}

export type AuthUser = AuthUserDto;
export type Thread = ThreadDto;
export type Comment = CommentDto;
