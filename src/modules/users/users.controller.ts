import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpRequest } from './requests/sign-up.request';
import { SignInRequest } from './requests/sign-in.request';
import { v4 as uuidv4 } from 'uuid';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post('sign-in')
  @HttpCode(200)
  signIn(@Body() { key }: SignInRequest) {
    return this.users.signIn(key);
  }

  @Post('sign-up')
  @HttpCode(201)
  signUp(@Body() { username }: SignUpRequest) {
    return this.users.signUp(uuidv4(), username);
  }
}
