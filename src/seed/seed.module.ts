import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CursosModule } from 'src/cursos/cursos.module';
import { InscripcionesModule } from 'src/inscripciones/inscripciones.module';
import { EstudiantesModule } from 'src/estudiantes/estudiantes.module';
import { LogrosModule } from '../logros/logros.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    CursosModule,
    InscripcionesModule,
    EstudiantesModule,
    LogrosModule,
  ]
})
export class SeedModule {}
