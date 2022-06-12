import { AuthUserDto, ThreadDto } from 'shared';

export class ValidationError {
  constructor(public readonly fields: Array<{ field: string; error: string }>) {}
}

export type Thread = ThreadDto;
export type User = AuthUserDto;
