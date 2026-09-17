import { Module } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { EstudiantesController } from './estudiantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Curso } from 'src/cursos/entities/curso.entity';

import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';
import { Estudiante } from './entities/estudiante.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EstudiantesController],
  providers: [EstudiantesService, JwtStrategy],
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forFeature([ Curso, Estudiante, Inscripcion  ]),
  ],
  exports: [
    EstudiantesService,
    TypeOrmModule,
    JwtStrategy,
  ],
})
export class EstudiantesModule {}
