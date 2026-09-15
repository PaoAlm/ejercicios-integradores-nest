import { Module } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/entities/curso.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { ConfigModule } from '@nestjs/config';
import { CursosModule } from 'src/cursos/cursos.module';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';

@Module({
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  imports: [
      ConfigModule,
      CursosModule,
      EstudiantesModule,
      TypeOrmModule.forFeature([ Curso, Estudiante, Inscripcion  ])
    ],
    exports: [
      InscripcionesService,
      TypeOrmModule
    ]
})
export class InscripcionesModule {}
