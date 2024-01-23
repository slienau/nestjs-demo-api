import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get('me')
  getMe() {
    return 'TODO: return user info';
  }
}
