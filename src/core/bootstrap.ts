import { ModuleDef } from '../decorators/module.decorator.js';
import { buildRouter } from '../http/router-builder.js';
import { Constructor, Container } from './container.js';
import { MODULE } from './tokens.js';
import express from 'express';

function collectModule(
  ModuleClass: Constructor,
  container: Container,
  seen = new Set<Constructor>(),
) {
  if (seen.has(ModuleClass)) return { controllers: [] as Constructor[] };
  seen.add(ModuleClass);

  const def: ModuleDef = Reflect.getMetadata(MODULE, ModuleClass) ?? {};
  const controllers: Constructor[] = [...(def.controllers ?? [])];

  for (const provider of def.providers ?? [])
    container.registerProvider(provider);

  for (const importedModule of def.imports ?? []) {
    const nested = collectModule(importedModule, container, seen);
    controllers.push(...nested.controllers);
  }

  return { controllers };
}

export function bootstrap(
  RootModule: Constructor,
  configureContainer?: (c: Container) => void,
) {
  const container = new Container();
  configureContainer?.(container);

  const { controllers } = collectModule(RootModule, container);

  const app = express();
  app.use(express.json());

  for (const Controller of controllers) {
    app.use(buildRouter(container, Controller));
  }

  return app;
}
