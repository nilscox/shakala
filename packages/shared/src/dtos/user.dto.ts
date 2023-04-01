import { createFactory } from '../utils/create-factory';

export type UserDto = {
  id: string;
  nick: string;
  email: string;
  profileImage?: string;
};

export const createUserDto = createFactory<UserDto>(() => ({
  id: '',
  nick: '',
  email: '',
}));
