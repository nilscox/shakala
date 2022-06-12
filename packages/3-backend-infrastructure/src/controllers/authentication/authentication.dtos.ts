import { User } from 'backend-domain';
import { AuthUserDto } from 'shared';

export const userToDto = (user: User): AuthUserDto => ({
  id: user.id,
  nick: user.nick.value,
  email: user.email,
  profileImage: user.profileImage.value ?? undefined,
  signupDate: user.signupDate.value,
});
