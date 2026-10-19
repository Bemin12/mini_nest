import { Module } from '../decorators/module.decorator.js';
import { Database } from './database.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserRepository } from './userRepository.js';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, Database],
})
export class UserModule {}
