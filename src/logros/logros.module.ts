import { forwardRef, Module } from '@nestjs/common';
import { LogrosService } from './logros.service';
import { LogrosController } from './logros.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logro } from './entities/logro.entity';
import { LogroObtenido } from './entities/logro-obtenido.entity';
import { InscripcionesModule } from 'src/inscripciones/inscripciones.module';
import { EstudiantesModule } from 'src/estudiantes/estudiantes.module';
import { NotificacionesModule } from 'src/notificaciones/notificaciones.module';
import { CursosModule } from 'src/cursos/cursos.module';

@Module({
  controllers: [LogrosController],
  providers: [LogrosService],
  imports: 
  [
    CursosModule,
    ConfigModule,
    forwardRef(() => InscripcionesModule),
    forwardRef(() => EstudiantesModule),
    forwardRef(() => NotificacionesModule),
    TypeOrmModule.forFeature([ Logro, LogroObtenido ])
  ],
  exports: [
      LogrosService,
      TypeOrmModule,
    ],
})
export class LogrosModule {}
