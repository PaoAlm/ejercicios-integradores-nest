import { Module } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { LogrosController } from './logros.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logro } from './entities/logro.entity';
import { LogroObtenido } from './entities/logro-obtenido.entity';

@Module({
  controllers: [LogrosController],
  providers: [LogrosService],
  imports: [
      ConfigModule,
      TypeOrmModule.forFeature([ Logro, LogroObtenido  ]),
    ],
  exports: [
      LogrosService,
      TypeOrmModule,
    ],
})
export class LogrosModule {}
