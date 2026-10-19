import { Request, Response, Router } from 'express';
import { PARAMS, PREFIX, ROUTES } from '../core/tokens.js';
import type { RouteDef } from '../decorators/route.decorator.js';
import { Container, Constructor } from '../core/container.js';
import { ParamDef } from '../decorators/param.decorator.js';

function resolveArgs(
  req: Request,
  res: Response,
  paramDefs: ParamDef[],
): unknown[] {
  const args: unknown[] = [];

  for (const def of paramDefs) {
    switch (def.source) {
      case 'body':
        args[def.index] = req.body;
        break;
      case 'param':
        args[def.index] = req.params[def.name!];
        break;
      case 'query':
        args[def.index] = req.query[def.name!];
        break;
      case 'req':
        args[def.index] = req;
        break;
      case 'res':
        args[def.index] = res;
        break;
    }
  }

  return args;
}

export function buildRouter(
  container: Container,
  ControllerClass: Constructor,
): Router {
  const router = Router();
  const instance = container.resolve(ControllerClass);

  const prefix: string = Reflect.getMetadata(PREFIX, ControllerClass) ?? '';
  const routes: RouteDef[] = Reflect.getMetadata(ROUTES, ControllerClass) ?? [];

  for (const { method, path, handlerName } of routes) {
    router[method](prefix + path, (req: Request, res: Response) => {
      const paramDefs: ParamDef[] =
        Reflect.getMetadata(PARAMS, ControllerClass.prototype, handlerName) ??
        [];
      if (paramDefs.length === 0) {
        return (instance as any)[handlerName](req, res);
      }
      const args = resolveArgs(req, res, paramDefs);
      return (instance as any)[handlerName](...args);
    });
  }

  return router;
}
