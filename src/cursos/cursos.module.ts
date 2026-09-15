import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { ConfigModule } from '@nestjs/config';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';

@Module({
  controllers: [CursosController],
  providers: [CursosService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ Curso, Estudiante, Inscripcion  ])
  ],
  exports: [
    CursosService,
    TypeOrmModule
  ]
})
export class CursosModule {}
