import { PREFIX } from '../core/tokens.js';

export function Controller(prefix: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(PREFIX, prefix, target);
  };
}
