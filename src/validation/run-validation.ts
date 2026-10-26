import { validate } from './validate.js';

export class ValidationError extends Error {
  constructor(public errors: string[]) {
    super('Validation failed');
  }
}

export function runValidationPipe<T extends object>(
  DtoClass: new () => T,
  raw: unknown,
): T {
  const dto = Object.assign(new DtoClass(), raw);
  const errors = validate(dto);
  if (errors.length > 0) throw new ValidationError(errors);
  return dto;
}
