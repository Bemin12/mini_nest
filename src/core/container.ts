import { INJECT } from './tokens.js';

export type Constructor<T = any> = new (...args: any[]) => T;

export class Container {
  private readonly values = new Map<string, unknown>();
  private readonly singletons = new Map<Constructor, unknown>();
  private readonly providers = new Set<Constructor>();

  provideValue(token: string, value: unknown) {
    this.values.set(token, value);
  }

  registerProvider(target: Constructor) {
    this.providers.add(target);
  }

  resolve<T>(target: Constructor): T {
    if (this.singletons.has(target)) {
      return this.singletons.get(target) as T;
    }

    const tokens: Record<number, string> =
      Reflect.getMetadata(INJECT, target) ?? {};
    const paramTypes: Constructor[] =
      Reflect.getMetadata('design:paramtypes', target) ?? [];

    const deps = paramTypes.map((dep, i) => {
      if (tokens[i]) {
        if (!this.values.has(tokens[i])) {
          throw new Error(
            `No value registered for token "${tokens[i]}" (param ${i} of ${target.name})`,
          );
        }
        return this.values.get(tokens[i]);
      }
      if (!this.providers.has(dep)) {
        throw new Error(
          `No provider registered for ${dep.name} (needed by ${target.name})`,
        );
      }
      return this.resolve(dep);
    });

    const instance = new target(...deps);
    this.singletons.set(target, instance);
    return instance;
  }
}
