import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ Estudiante ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '2h' },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [TypeOrmModule, PassportModule, JwtStrategy, JwtModule], 
})
export class AuthModule {}