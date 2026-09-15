import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CursosController],
  providers: [CursosService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ Curso ])
  ],
  exports: [
    CursosService,
    TypeOrmModule
  ]
})
export class CursosModule {}
