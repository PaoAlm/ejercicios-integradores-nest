import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( Estudiante )
        private readonly estudianteRepository: Repository<Estudiante>,

        configService: ConfigService
    ) {

        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate( payload: JwtPayload ): Promise<Estudiante> {
        
        const { id } = payload;

        const user = await this.estudianteRepository.findOneBy({ id });

        if ( !user ) 
            throw new UnauthorizedException('Token not valid')
            
        if ( !user.isActive ) 
            throw new UnauthorizedException('User is inactive, talk with an admin');
        

        return user;
    }

}