import { Module } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Curso } from 'src/cursos/entities/curso.entity';

import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';
import { Estudiante } from './entities/estudiante.entity';

@Module({
  controllers: [EstudiantesController],
  providers: [EstudiantesService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ Curso, Estudiante, Inscripcion  ])
  ],
  exports: [
    EstudiantesService,
    TypeOrmModule
  ]
})
export class EstudiantesModule {}
