import {
  AuthenticationGateway,
  createStore,
  Dependencies,
  fetchLastThreads,
  login,
  Thread,
  ThreadGateway,
  User,
} from 'frontend-domain';
import { AuthUserDto, get, ThreadDto } from 'shared';

import { FetchHttpGateway } from './fetch-http.gateway';
import { HttpGateway } from './http.gateway';

type LoginDto = {
  email: string;
  password: string;
};

type SignupDto = {
  email: string;
  password: string;
  nick: string;
};

export class ApiAuthenticationGateway implements AuthenticationGateway {
  constructor(private readonly http: HttpGateway) {}

  async fetchUser(): Promise<AuthUserDto | undefined> {
    const response = await this.http.get<AuthUserDto | undefined>('/auth/me');

    if (response.error) {
      throw response.error;
    }

    return response.body;
  }

  async login(email: string, password: string): Promise<User> {
    const response = await this.http.post<LoginDto, AuthUserDto>('/auth/login', {
      body: { email, password },
    });

    if (response.error) {
      if (get(response.error, 'error') === 'InvalidCredentials') {
        throw new Error('InvalidCredentials');
      }

      throw response.error;
    }

    return response.body;
  }

  async signup(email: string, password: string, nick: string): Promise<User> {
    const response = await this.http.post<SignupDto, AuthUserDto>('/auth/signup', {
      body: { email, password, nick },
    });

    if (response.error) {
      throw response.error;
    }

    return response.body;
  }

  async logout(): Promise<void> {
    await this.http.post('/auth/logout');
  }
}

export class ApiThreadGateway implements ThreadGateway {
  constructor(private readonly http: HttpGateway) {}

  async getLast(count: number): Promise<Thread[]> {
    const response = await this.http.get<ThreadDto[]>('/thread/last', {
      query: { count },
    });

    return response.body;
  }
}

const http = new FetchHttpGateway('http://localhost:3000');

const main = async () => {
  const dependencies: Dependencies = {
    authenticationGateway: new ApiAuthenticationGateway(http),
    threadGateway: new ApiThreadGateway(http),
  };

  const store = createStore(dependencies);

  await store.dispatch(fetchLastThreads());
  await store.dispatch(login('nils@nils.cx', 'tatata123'));

  console.dir(store.getState(), { depth: null });
};

main().catch(console.error);
