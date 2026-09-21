import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosModule } from './cursos/cursos.module';
import { CommonModule } from './common/common.module';
import { JoiValidationSchema } from './config/joi.validation';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { LogrosModule } from './logros/logros.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService], 
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true
      }),
    }),

    CursosModule,
    CommonModule,
    EstudiantesModule,
    InscripcionesModule,
    SeedModule,
    AuthModule,
    LogrosModule,
    NotificacionesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
