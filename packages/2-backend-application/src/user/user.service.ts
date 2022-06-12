import { UserRepository } from '../interfaces/user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findById = this.userRepository.findById.bind(this.userRepository);
}
