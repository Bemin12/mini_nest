import { Inject } from '../../decorators/inject.decorator.js';

export class Database {
  private users = [
    { id: 1, name: 'Ahmed', email: 'ahmed@example.com' },
    { id: 2, name: 'Sara', email: 'sara@example.com' },
  ];

  constructor(@Inject('DB_URL') private url: string) {}

  findAll() {
    return this.users;
  }

  insert(user: { name: string; email: string }) {
    const row = { id: this.users.length + 1, ...user };
    this.users.push(row);
    return row;
  }
}
