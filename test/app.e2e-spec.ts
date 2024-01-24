import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

    prisma = app.get(PrismaService); // get the PrismaService instance
    await prisma.cleanDb(); // clean the database
  });

  afterAll(async () => {
    await app.close(); // stop the app
  });

  it.todo('should pass');
});
