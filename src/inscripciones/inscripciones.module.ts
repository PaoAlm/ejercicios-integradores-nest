import { forwardRef, Module } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/entities/curso.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Inscripcion } from './entities/inscripcion.entity';
import { ConfigModule } from '@nestjs/config';
import { CursosModule } from 'src/cursos/cursos.module';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';
import { AuthModule } from 'src/auth/auth.module';
import { LogrosModule } from 'src/logros/logros.module';
import { Logro } from 'src/logros/entities/logro.entity';
import { LogroObtenido } from 'src/logros/entities/logro-obtenido.entity';

@Module({
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  imports: [
      AuthModule,
      ConfigModule,
      LogrosModule,
      CursosModule,
      EstudiantesModule,
      forwardRef(() => LogrosModule),
      TypeOrmModule.forFeature([ Curso, Estudiante, Inscripcion, Logro, LogroObtenido  ])
    ],
    exports: [
      InscripcionesService,
      TypeOrmModule
    ]
})
export class InscripcionesModule {}
