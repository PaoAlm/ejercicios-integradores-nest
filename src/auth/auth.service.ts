import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService
    ){}

    async checkAuthStatus( user: Estudiante ) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  getJwtToken( payload: JwtPayload ) {
      const token =  this.jwtService.sign( payload );
      return token;
    }

}
