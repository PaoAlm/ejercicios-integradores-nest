import { forwardRef, Module } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Estudiante } from './entities/estudiante.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { LogrosModule } from 'src/logros/logros.module';
import { InscripcionesModule } from 'src/inscripciones/inscripciones.module';

@Module({
  controllers: [EstudiantesController],
  providers: [EstudiantesService, JwtStrategy],
  imports: [
    ConfigModule,
    forwardRef(() => LogrosModule),
    forwardRef(() => InscripcionesModule),
    TypeOrmModule.forFeature([ Estudiante  ]),
  ],
  exports: [
    EstudiantesService,
    JwtStrategy,
  ],
})
export class EstudiantesModule {}
