import { User } from 'backend-domain';
import { AuthUserDto } from 'shared';

export const userToDto = (user: User): AuthUserDto => ({
  id: user.id,
  nick: user.nick.toString(),
  email: user.email,
  profileImage: user.profileImage.toString() ?? undefined,
  signupDate: user.signupDate.toString(),
});
