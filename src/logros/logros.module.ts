import { forwardRef, Module } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { LogrosController } from './logros.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logro } from './entities/logro.entity';
import { LogroObtenido } from './entities/logro-obtenido.entity';
import { InscripcionesModule } from 'src/inscripciones/inscripciones.module';
import { EstudiantesModule } from 'src/estudiantes/estudiantes.module';
import { CursosService } from 'src/cursos/cursos.service';
import { NotificacionesModule } from 'src/notificaciones/notificaciones.module';

@Module({
  controllers: [LogrosController],
  providers: [LogrosService, CursosService],
  imports: [
      ConfigModule,
      forwardRef(() => InscripcionesModule),
      EstudiantesModule,
      TypeOrmModule.forFeature([ Logro, LogroObtenido ]),
      NotificacionesModule
    ],
  exports: [
      LogrosService,
      TypeOrmModule,
    ],
})
export class LogrosModule {}
