import { Injectable } from '../../decorators/injectable.decorator.js';
import { Database } from '../database/database.js';

@Injectable()
export class UserRepository {
  constructor(private db: Database) {}

  findAll() {
    return this.db.findAll();
  }

  create(user: { name: string; email: string; password: string; age: number }) {
    return this.db.insert(user);
  }
}
