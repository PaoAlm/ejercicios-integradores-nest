import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { ConfigModule } from '@nestjs/config';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { AuthModule } from 'src/auth/auth.module';
import { InscripcionesController } from 'src/inscripciones/inscripciones.controller';
import { CursoImage } from './entities/curso-image.entity';
import { LogrosModule } from 'src/logros/logros.module';

@Module({
  controllers: [CursosController],
  providers: [CursosService],
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forFeature([ Curso, CursoImage, Estudiante, InscripcionesController ])
  ],
  exports: [
    CursosService,
    TypeOrmModule
  ]
})
export class CursosModule {}
