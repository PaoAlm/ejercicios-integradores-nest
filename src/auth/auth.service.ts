import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dtos/login.dto';
import { EstudiantesService } from '../estudiantes/estudiantes.service';
import { CreateEstudianteDto } from 'src/estudiantes/dto/create-estudiante.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @Inject(forwardRef(() => EstudiantesService))
    private estudiantesService: EstudiantesService,
    private readonly jwtService: JwtService
  ){}

  async register(createEstudianteDto: CreateEstudianteDto) {
    const estudiante = await this.estudiantesService.create(createEstudianteDto);
    return { ...estudiante, token: this.getJwtToken({ id: estudiante.id }) };
  }

  async login( loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
  
     const user = await this.estudiantesService.findOneByEmailWithPassword(email);
  
    if ( !user )
      throw new UnauthorizedException('Credenciales Inválidas (email)');
  
    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials Inválidas (contraseña)');

    return {
      id: user.id,
      email: user.email,
      token: this.getJwtToken({ id: user.id })
    };
  }

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
