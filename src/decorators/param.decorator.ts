import { PARAMS } from '../core/tokens.js';

type ParamSource = 'body' | 'param' | 'query' | 'req' | 'res';
export interface ParamDef {
  index: number;
  source: ParamSource;
  name?: string;
}

function createParamDecorator(source: ParamSource) {
  return (name?: string): ParameterDecorator => {
    return (target, key, index) => {
      if (key === undefined) return;
      const existing: ParamDef[] =
        Reflect.getOwnMetadata(PARAMS, target, key) ?? [];
      Reflect.defineMetadata(
        PARAMS,
        [...existing, { index, source, name }],
        target,
        key,
      );
    };
  };
}

export const Body = createParamDecorator('body');
export const Param = createParamDecorator('param');
export const Query = createParamDecorator('query');
export const Req = createParamDecorator('req');
export const Res = createParamDecorator('res');
