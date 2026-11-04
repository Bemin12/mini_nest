import { INJECT } from './tokens.js';

export type Constructor<T = any> = new (...args: any[]) => T;

export class Container {
  private readonly values = new Map<string, unknown>();
  private readonly singletons = new Map<Constructor, unknown>();

  private readonly moduleScope = new Map<Constructor, Set<Constructor>>();

  provideValue(token: string, value: unknown) {
    this.values.set(token, value);
  }

  registerModuleScope(ModuleClass: Constructor, visible: Set<Constructor>) {
    this.moduleScope.set(ModuleClass, visible);
  }

  resolve<T>(target: Constructor, fromModule: Constructor): T {
    if (this.singletons.has(target)) {
      return this.singletons.get(target) as T;
    }

    const scope = this.moduleScope.get(fromModule);
    if (!scope?.has(target)) {
      throw new Error(
        `${target.name} is not visible to ${fromModule.name}. ` +
          `Add it to that module's own providers, or import a module that exports it.`,
      );
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

      return this.resolve(dep, fromModule);
    });

    const instance = new target(...deps);
    this.singletons.set(target, instance);
    return instance;
  }
}
