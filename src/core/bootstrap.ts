import { Module, ModuleDef } from '../decorators/module.decorator.js';
import { buildRouter } from '../http/router-builder.js';
import { Constructor, Container } from './container.js';
import { MODULE } from './tokens.js';
import express from 'express';

interface ControllerEntry {
  Controller: Constructor;
  OwnerModule: Constructor;
}

function collectModule(
  ModuleClass: Constructor,
  container: Container,
  seen = new Set<Constructor>(),
): { controllers: ControllerEntry[]; exported: Set<Constructor> } {
  if (seen.has(ModuleClass))
    return {
      controllers: [],
      exported: new Set<Constructor>(),
    };
  seen.add(ModuleClass);

  const def: ModuleDef = Reflect.getMetadata(MODULE, ModuleClass) ?? {};

  const controllers: ControllerEntry[] = (def.controllers ?? []).map(
    (Controller) => ({ Controller, OwnerModule: ModuleClass }),
  );

  const own = new Set(def.providers ?? []);
  const visible = new Set(own);

  for (const importedModule of def.imports ?? []) {
    const nested = collectModule(importedModule, container, seen);
    controllers.push(...nested.controllers);
    for (const exported of nested.exported) visible.add(exported);
  }

  container.registerModuleScope(ModuleClass, visible);

  const exported = new Set((def.exports ?? []).filter((p) => own.has(p)));
  return { controllers, exported };
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

  for (const { Controller, OwnerModule } of controllers) {
    app.use(buildRouter(container, OwnerModule, Controller));
  }

  return app;
}
