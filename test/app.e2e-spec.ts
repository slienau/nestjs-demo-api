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
    const dto: AuthDto = {
      email: 'test@testing.com',
      password: '12345678',
    };

    describe('Signup', () => {
      it('should throw an error because password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, password: undefined })
          .expectStatus(400)
          .expectJsonLike('message', ['password should not be empty']);
        // .inspect();
      });

      it('should throw an error because email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, email: undefined })
          .expectStatus(400)
          .expectJsonLike('message', ['email should not be empty']);
      });

      it('should throw an error because email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, email: 'invalid@mail' })
          .expectStatus(400)
          .expectJsonLike('message', ['email must be an email']);
      });

      it('should throw an error because password has fewer than 8 characters', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, password: '1234567' })
          .expectStatus(400)
          .expectJsonLike('message', [
            'password must be longer than or equal to 8 characters',
          ]);
      });

      it('should throw an error because no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should create a new user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should throw an error because email already taken', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Login', () => {
      it('should return a token', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('access_token', 'access_token');
      });

      it('should throw an error because password is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...dto, password: undefined })
          .expectStatus(400)
          .expectJsonLike('message', ['password should not be empty']);
        // .inspect();
      });

      it('should throw an error because email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...dto, email: undefined })
          .expectStatus(400)
          .expectJsonLike('message', ['email should not be empty']);
      });

      it('should throw an error because email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...dto, email: 'invalid@mail' })
          .expectStatus(400)
          .expectJsonLike('message', ['email must be an email']);
      });

      it('should throw an error because password has fewer than 8 characters', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ ...dto, password: '1234567' })
          .expectStatus(400)
          .expectJsonLike('message', [
            'password must be longer than or equal to 8 characters',
          ]);
      });

      it('should throw an error because no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{access_token}`,
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmark by id', () => {});
    describe('Edit bookmark by id', () => {});
    describe('Delete bookmark by id', () => {});
  });
});
