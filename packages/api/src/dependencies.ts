import { CryptoPort, EventPublisher } from '@shakala/common';
import { UserRepository } from '@shakala/user';

export type Dependencies = {
  crypto: CryptoPort;
  publisher: EventPublisher;
  userRepository: UserRepository;
};
