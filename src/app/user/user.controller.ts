import type { Request, Response } from 'express';
import { Controller } from '../../decorators/controller.decorator.js';
import { UserService } from './user.service.js';
import { Get, Post } from '../../decorators/route.decorator.js';
import { SignupDto } from './dto/signup.dto.js';
import { validate } from '../../validation/validate.js';
import { Body, Res } from '../../decorators/param.decorator.js';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  list(req: Request, res: Response) {
    res.json(this.userService.list());
  }

  @Post('/')
  create(@Body(SignupDto) dto: SignupDto, @Res() res: Response) {
    const user = this.userService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      age: dto.age,
    });
    res.status(201).json({ ...user, password: undefined });
  }
}
