import { Injectable } from '../decorators/injectable.decorator.js';
import { Database } from './database.js';

@Injectable()
export class UserRepository {
  constructor(private db: Database) {}

  findAll() {
    return this.db.findAll();
  }

  create(user: { name: string; email: string }) {
    return this.db.insert(user);
  }
}
