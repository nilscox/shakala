import { AuthUserDto, CommentDto, CommentWithRepliesDto, ThreadDto, UserDto } from 'shared';
export { Sort } from 'shared';

export class ValidationError {
  constructor(public readonly fields: Array<{ field: string; error: string }>) {}
}

export type AuthUser = AuthUserDto;
export type User = UserDto;
export type Thread = ThreadDto;
export type Reply = CommentDto;
export type Comment = CommentWithRepliesDto;
