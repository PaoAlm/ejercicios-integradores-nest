import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { HandleDbExceptions } from 'src/common/helper/handle-exceptions.helper';
import { Estudiante } from './entities/estudiante.entity';

@Injectable()
export class EstudiantesService {

  constructor(
    @InjectRepository(Estudiante)
          private readonly estudianteRepository: Repository<Estudiante>,
  ) {}
  async create(createEstudianteDto: CreateEstudianteDto) {
    try {
      const estudiante = this.estudianteRepository.create( createEstudianteDto )
      await this.estudianteRepository.save( estudiante )
      return estudiante;

    } catch (error) {
      HandleDbExceptions.handle(error, 'EstudianteService');
    }
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
}
