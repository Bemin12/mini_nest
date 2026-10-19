import { ROUTES } from '../core/tokens.js';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RouteDef {
  method: HttpMethod;
  path: string;
  handlerName: string | symbol;
}

function createMethodDecorator(method: HttpMethod) {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      const ctor = target.constructor;
      const routes: RouteDef[] = [
        ...(Reflect.getOwnMetadata(ROUTES, ctor) ?? []),
      ];
      routes.push({ method, path, handlerName: propertyKey });
      Reflect.defineMetadata(ROUTES, routes, ctor);
    };
  };
}

export const Get = createMethodDecorator('get');
export const Post = createMethodDecorator('post');
export const Put = createMethodDecorator('put');
export const Delete = createMethodDecorator('delete');
export const Patch = createMethodDecorator('patch');
