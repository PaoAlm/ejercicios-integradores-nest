import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosModule } from './cursos/cursos.module';
import { CommonModule } from './common/common.module';
import { JoiValidationSchema } from './config/joi.validation';


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
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
