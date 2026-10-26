import { PARAMS } from '../core/tokens.js';

type ParamSource = 'body' | 'param' | 'query' | 'req' | 'res';
export interface ParamDef {
  index: number;
  source: ParamSource;
  name?: string;
  dtoClass?: new () => any;
}

function createParamDecorator(source: ParamSource) {
  return (nameOrDto?: string | (new () => any)): ParameterDecorator => {
    return (target, key, index) => {
      if (key === undefined) return;
      const existing: ParamDef[] =
        Reflect.getOwnMetadata(PARAMS, target, key) ?? [];
      const def: ParamDef =
        typeof nameOrDto === 'string'
          ? { index, source, name: nameOrDto }
          : { index, source, dtoClass: nameOrDto };
      Reflect.defineMetadata(PARAMS, [...existing, def], target, key);
    };
  };
}

export const Body = createParamDecorator('body');
export const Param = createParamDecorator('param');
export const Query = createParamDecorator('query');
export const Req = createParamDecorator('req');
export const Res = createParamDecorator('res');
