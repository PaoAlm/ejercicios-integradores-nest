import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { HandleDbExceptions } from 'src/common/helper/handle-exceptions.helper';
import { Estudiante } from './entities/estudiante.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'node_modules/@nestjs/jwt/dist/jwt.service';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { LoginUserDto } from 'src/common/dtos/login.dto';
import { ValidRoles } from './interfaces/valid-roles';
import { Logro } from 'src/logros/entities/logro.entity';
import { LogroObtenido } from 'src/logros/entities/logro-obtenido.entity';

@Injectable()
export class EstudiantesService {

  constructor(
    @InjectRepository(Estudiante)
    private readonly estudianteRepository: Repository<Estudiante>,
    
    @InjectRepository(LogroObtenido)
    private readonly logroObtenidoRepository: Repository<LogroObtenido>,
          
    private readonly jwtService: JwtService
  ) {}
  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      const { password, ...userData } = createEstudianteDto;
      const estudiante = this.estudianteRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10)
     });

      await this.estudianteRepository.save( estudiante )
      delete estudiante.password;
      
      return {
      ...estudiante,
      token: this.getJwtToken({ id: estudiante.id })
    };
    } catch (error) {
      HandleDbExceptions.handle(error, 'EstudianteService');
    }
  }

  async login( loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.estudianteRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true}
    });

    if ( !user )
      throw new UnauthorizedException('Credentials are not valid (email)');

    if ( !bcrypt.compareSync( password, user.password ) )
      throw new UnauthorizedException('Credentials are not valid (password)')

    
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async checkAuthStatus( user: Estudiante ) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async findAll() {
    const estudiante = await this.estudianteRepository.find();
    return estudiante;
  }

  async findOne(id: string) {
    const estudiante = await this.estudianteRepository.findOneBy({ id });
    
        if ( !estudiante )
          throw new NotFoundException(`Product with ${id} not found`);
    
        return estudiante;
  }

  async findLogros(id: string, estudianteId: Estudiante) {
    if (id === estudianteId.id || estudianteId.roles.includes(ValidRoles.admin)) {
      const logroObtenido = await this.logroObtenidoRepository.find({
        where: { estudiante: { id: estudianteId.id } }
      });
          return logroObtenido;
        } else {
          throw new UnauthorizedException('No se permite consultar logros a nombre de otro usuario');
        }
  }

  async update(id: string, updateEstudianteDto: UpdateEstudianteDto) {
    const estudiante = await this.estudianteRepository.preload({
      id: id,
      ...updateEstudianteDto
    });
    
        if( !estudiante ) throw new BadRequestException(`El estudiante con el id: ${ id } no existe.`);
    
        try{
          await this.estudianteRepository.save( estudiante );
          return estudiante;
        } catch (error) {
          HandleDbExceptions.handle(error, 'EstudianteService');
        }
  }

  async remove(id: string) {
    const estudiante = await this.findOne( id );
    await this.estudianteRepository.remove( estudiante );
    
    return `El estudiante con el id: ${ id } ha sido eliminado.`;
  }

  async deleteAllEstudiantes() {

    const query = this.estudianteRepository.createQueryBuilder('estudiante');

    try {
      return await query
        .delete()
        .execute();

    } catch (error) {
      HandleDbExceptions.handle(error, 'EstudianteService');
    }

  }

  getJwtToken( payload: JwtPayload ) {
    const token =  this.jwtService.sign( payload );
    return token;
  }

}
