import { UserEntity, UserProps } from '../data/user/user.entity';

const randomId = () => Math.random().toString(36).slice(-6);

export const createUserEntity = (props?: Partial<UserProps>): UserEntity => {
  return new UserEntity({
    id: randomId(),
    email: '',
    hashedPassword: '',
    nick: '',
    profileImage: null,
    signupDate: '',
    lastLoginDate: null,
    ...props,
  });
};
