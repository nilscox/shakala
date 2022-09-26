import { factories, Nick, ProfileImage, Timestamp } from 'backend-domain';
import { createAuthUserDto } from 'shared';

import { StubConfigAdapter } from '../../infrastructure';

import { UserPresenter } from './user.presenter';

describe('UserPresenter', () => {
  it('transforms a user entity to a user dto', () => {
    const create = factories();

    const user = create.user({
      id: 'userId',
      nick: new Nick('nick'),
      profileImage: new ProfileImage('image.png'),
      email: 'user@domain.tld',
      signupDate: new Timestamp('2022-01-01'),
    });

    const dto = createAuthUserDto({
      id: 'userId',
      nick: 'nick',
      email: 'user@domain.tld',
      signupDate: '2022-01-01T00:00:00.000Z',
      profileImage: 'http://api.url/user/profile-image/image.png',
    });

    const config = new StubConfigAdapter({ app: { apiBaseUrl: 'http://api.url' } });
    const presenter = new UserPresenter(config);

    expect(presenter.transformAuthenticatedUser(user)).toEqual(dto);
  });
});
