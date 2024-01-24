import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

pactum.request.setBaseUrl('http://localhost:3001');

describe('App End-to-End', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // global validation pipe

    await app.init(); // start the app
    await app.listen(3001);

    prisma = app.get(PrismaService); // get the PrismaService instance
    await prisma.cleanDb(); // clean the database
  });

  afterAll(async () => {
    await app.close(); // stop the app
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should create a new user', () => {
        const dto: AuthDto = {
          email: 'test@testing.com',
          password: '12345678',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });
    describe('Login', () => {
      it.todo('should return a token');
    });
  });

  describe('User', () => {
    describe('Get me', () => {});
    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Edit bookmark', () => {});
    describe('Delete bookmark', () => {});
  });
});
