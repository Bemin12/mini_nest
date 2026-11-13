import 'reflect-metadata';
import { bootstrap } from './core/bootstrap.js';
import { UserModule } from './app/user/user.module.js';

const app = bootstrap(UserModule, (container) => {
  container.provideValue('DB_URL', 'postgres://localhost/app');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
