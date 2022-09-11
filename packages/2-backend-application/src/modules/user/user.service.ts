import { UserRepository } from '../../interfaces/repositories';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findById = this.userRepository.findById.bind(this.userRepository);
}
