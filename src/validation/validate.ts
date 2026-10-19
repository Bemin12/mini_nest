import { VALIDATORS } from '../core/tokens.js';
import { Rule } from '../decorators/validation.decorator.js';

export function validate(obj: object): string[] {
  const errors: string[] = [];
  for (const key of Object.keys(obj)) {
    const rules: Rule[] = Reflect.getMetadata(VALIDATORS, obj, key) ?? [];
    for (const rule of rules) {
      if (!rule.check(obj[key as keyof typeof obj])) errors.push(rule.message);
    }
  }

  return errors;
}
