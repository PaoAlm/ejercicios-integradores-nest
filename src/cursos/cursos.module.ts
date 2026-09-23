import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [CursosController],
  providers: [CursosService],
  imports: [
    FilesModule,
    ConfigModule,
    TypeOrmModule.forFeature([ Curso])
  ],
  exports: [
    CursosService,
  ]
})
export class CursosModule {}
