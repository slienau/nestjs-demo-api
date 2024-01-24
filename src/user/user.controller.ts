import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User as UserType } from '@prisma/client';
import { User } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@User() user: UserType) {
    return user;
  }

  @Patch()
  editUser(@User('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
