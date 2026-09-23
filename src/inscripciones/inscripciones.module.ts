import { forwardRef, Module } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionesController } from './inscripciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { ConfigModule } from '@nestjs/config';
import { CursosModule } from 'src/cursos/cursos.module';
import { EstudiantesModule } from '../estudiantes/estudiantes.module';
import { LogrosModule } from 'src/logros/logros.module';

@Module({
  controllers: [InscripcionesController],
  providers: [InscripcionesService],
  imports: [
      ConfigModule,
      CursosModule,
      forwardRef(() => EstudiantesModule),
      forwardRef(() => LogrosModule),
      TypeOrmModule.forFeature([ Inscripcion  ])
    ],
    exports: [
      InscripcionesService
    ]
})
export class InscripcionesModule {}
