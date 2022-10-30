import { ApiAuthenticationGateway } from './authentication-gateway/api-authentication.gateway';
import { FetchHttpGateway } from './http-gateway/fetch-http.gateway';
import { ApiThreadGateway } from './thread-gateway/api-thread-gateway';
import { ApiUserGateway } from './user-gateway/api-user-gateway';

export const api = (cookie?: string | null) => {
  const httpGateway = new FetchHttpGateway('http://localhost:3000');

  httpGateway.cookie = cookie;

  return {
    authenticationGateway: new ApiAuthenticationGateway(httpGateway),
    threadGateway: new ApiThreadGateway(httpGateway),
    userGateway: new ApiUserGateway(httpGateway),
  };
};
