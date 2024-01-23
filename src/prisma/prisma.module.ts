import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // macht den Service global (in allen Modulen) verfügbar; Er muss nicht extra importiert werden
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // wichtig, damit andere Module den Service zugreifen können (auch bei globalem modul!)
})
export class PrismaModule {}
