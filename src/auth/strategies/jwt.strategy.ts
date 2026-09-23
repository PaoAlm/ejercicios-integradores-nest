import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PassportStrategy } from '@nestjs/passport';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        private readonly estudiantesService: EstudiantesService,
        configService: ConfigService
    ) {

        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate( payload: JwtPayload ): Promise<Estudiante> {
        let estudiante: Estudiante;
        try {
            estudiante = await this.estudiantesService.findOne(payload.id);
        } catch {
            throw new UnauthorizedException('Token no válido');
        }
        
        if (!estudiante.isActive) throw new UnauthorizedException('Estudiante inactivo');
        return estudiante;
    }

}