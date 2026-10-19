import { INJECT } from '../core/tokens.js';

export function Inject(token: string): ParameterDecorator {
  return (target, _key, index) => {
    const tokens: Record<number, string> =
      Reflect.getOwnMetadata(INJECT, target) ?? {};
    tokens[index] = token;
    Reflect.defineMetadata(INJECT, tokens, target);
  };
}
