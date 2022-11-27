import { UserProfileGateway } from '../gateways/user-profile-gateway';
import { createStubFunction } from '../utils/create-stub-function';

export class StubUserProfileGateway implements UserProfileGateway {
  fetchActivities = createStubFunction<UserProfileGateway['fetchActivities']>();
  changeProfileImage = createStubFunction<UserProfileGateway['changeProfileImage']>();
}
