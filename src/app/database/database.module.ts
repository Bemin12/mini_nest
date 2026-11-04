import { Module } from '../../decorators/module.decorator.js';
import { Database } from './database.js';

@Module({
  providers: [Database],
  exports: [Database],
})
export class DatabaseModule {}
