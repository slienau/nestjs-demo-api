import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return 'login';
  }

  async signup(dto: AuthDto) {
    // generate hash
    const hash = await argon.hash(dto.password);

    // save the new user in the database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
      // select: {
      //   id: true,
      //   email: true,
      //   createdAt: true,
      // },
    });

    delete user.hash; // dirty solution for now, will fix this later

    // return the saved user without the hash
    return user;
  }
}
