import { UserDto } from 'shared';
import { SuperAgentTest } from 'supertest';

import { MockLoggerService, StubConfigService } from '../../infrastructure';
import { TestServer } from '../../test';

describe('Account e2e', () => {
  const server = new TestServer();
  let agent: SuperAgentTest;

  server.overrideServices({
    loggerService: new MockLoggerService(),
    configService: new StubConfigService({ app: { apiBaseUrl: 'http://api.url' } }).withEnvDatabase(),
  });

  beforeAll(async () => {
    await server.init();
  });

  let userId: string;

  beforeEach(async () => {
    await server.reset();
    agent = server.agent();

    userId = await server.createUserAndLogin(agent, { email: 'user@domain.tld', password: 'p4ssw0rd' });
  });

  test('As a user, I can change my profile image', async () => {
    const changeProfileImage = async (image: string) => {
      return agent
        .post('/account/profile-image')
        .attach('profileImage', Buffer.from(image), 'test.png')
        .expect(200);
    };

    const getUser = async (): Promise<UserDto> => {
      const { body } = await agent.get(`/user/${userId}`).expect(200);
      return body;
    };

    const getUserProfileImage = async (user: UserDto) => {
      const url = user.profileImage as string;
      return agent.get(url.replace('http://api.url', '')).expect(200);
    };

    await changeProfileImage('image data');
    const user = await getUser();
    await getUserProfileImage(user);
  });
});
