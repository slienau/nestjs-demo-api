import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Wrong email or password');
    }

    // compare the password with the hash
    const isPasswordValid = await argon.verify(user.hash, dto.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong email or password');
    }

    // send back the user
    delete user.hash; // dirty solution for now, will fix this later
    return user;
  }

  async signup(dto: AuthDto) {
    // generate hash
    const hash = await argon.hash(dto.password);

    // save the new user in the database
    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }
}
