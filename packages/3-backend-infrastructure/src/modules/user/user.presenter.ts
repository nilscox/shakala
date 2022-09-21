import { Author, User } from 'backend-domain';
import { AuthUserDto, UserDto } from 'shared';

import { ConfigService } from '../../infrastructure';

export const userToDto = (user: User): AuthUserDto => ({
  id: user.id,
  nick: user.nick.toString(),
  email: user.email,
  profileImage: user.profileImage?.toString(),
  signupDate: user.signupDate.toString(),
});

export class UserPresenter {
  constructor(private readonly config: ConfigService) {}

  transformUser = (user: User | Author): UserDto => {
    const { apiBaseUrl } = this.config.app();

    return {
      id: user.id,
      nick: user.nick.toString(),
      profileImage: user.profileImage ? `${apiBaseUrl}/user/profile-image/${user.profileImage}` : undefined,
    };
  };

  transformAuthenticatedUser = (user: User): AuthUserDto => ({
    ...this.transformUser(user),
    email: user.email,
    signupDate: user.signupDate.toString(),
  });
}
