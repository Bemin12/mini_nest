import { VALIDATORS } from '../core/tokens.js';

export type Rule = {
  name: string;
  check: (v: unknown) => boolean;
  message: string;
};

function addRule(target: object, key: string | symbol, rule: Rule) {
  const rules: Rule[] = [
    ...(Reflect.getOwnMetadata(VALIDATORS, target, key) ?? []),
  ];
  rules.push(rule);
  Reflect.defineMetadata(VALIDATORS, rules, target, key);
}

export function Required(): PropertyDecorator {
  return (target, key) => {
    addRule(target, key, {
      name: 'required',
      check: (v) => v !== undefined && v !== null && v !== '',
      message: `${String(key)} is required`,
    });
  };
}

export function MinLength(n: number): PropertyDecorator {
  return (target, key) => {
    addRule(target, key, {
      name: 'minLength',
      check: (v) => typeof v === 'string' && v.length >= n,
      message: `${String(key)} must be at least ${n} chars`,
    });
  };
}

export function IsEmail(): PropertyDecorator {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return (target, key) => {
    addRule(target, key, {
      name: 'isEmail',
      check: (v) => typeof v === 'string' && emailRegex.test(v),
      message: `${String(key)} must be a valid email`,
    });
  };
}

export function IsInt(): PropertyDecorator {
  return (target, key) => {
    addRule(target, key, {
      name: 'isInt',
      check: (v) => Number.isInteger(v),
      message: `${String(key)} must be an integer`,
    });
  };
}

export function Min(n: number): PropertyDecorator {
  return (target, key) => {
    addRule(target, key, {
      name: 'min',
      check: (v) => typeof v === 'number' && v >= n,
      message: `${String(key)} must be greater than or equal ${n}`,
    });
  };
}
