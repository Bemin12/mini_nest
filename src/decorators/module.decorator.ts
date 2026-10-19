import { MODULE } from '../core/tokens.js';
import { Constructor } from '../core/container.js';

export interface ModuleDef {
  controllers?: Constructor[];
  providers?: Constructor[];
  imports?: Constructor[];
}

export function Module(def: ModuleDef): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE, def, target);
  };
}
