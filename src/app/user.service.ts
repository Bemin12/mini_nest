import { Injectable } from '../decorators/injectable.decorator.js';
import { UserRepository } from './userRepository.js';

@Injectable()
export class UserService {
  constructor(private repo: UserRepository) {}

  list() {
    return this.repo.findAll();
  }

  create(user: { name: string; email: string }) {
    return this.repo.create(user);
  }
}
