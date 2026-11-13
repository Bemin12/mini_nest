import {
  IsEmail,
  IsInt,
  Min,
  MinLength,
  Required,
} from '../../../decorators/validation.decorator.js';

export class SignupDto {
  @MinLength(1)
  @Required()
  name!: string;

  @MinLength(8)
  @Required()
  password!: string;

  @Min(16)
  @IsInt()
  @Required()
  age!: number;

  @IsEmail()
  @Required()
  email!: string;
}
