import { ConflictException, Injectable, NotFoundException, BadRequestException, Delete } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleDbExceptions } from 'src/common/helper/handle-exceptions.helper';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { CursosService } from 'src/cursos/cursos.service';

@Injectable()
export class InscripcionesService {

  constructor(
      @InjectRepository(Inscripcion)
            private readonly inscripcionRepository: Repository<Inscripcion>,

      private estudiantesService: EstudiantesService,
      private cursosService: CursosService

    ) {}

  async create(createInscripcionDto: CreateInscripcionDto) {
    
    const { estudianteId, cursoId } = createInscripcionDto;

    const estudiante = await this.estudiantesService.findOne(estudianteId);
    if (!estudiante) throw new NotFoundException(`El estudiante con id: ${estudianteId} no existe.`);

    const curso = await this.cursosService.findOne(cursoId);
    if (!curso) throw new NotFoundException(`El curso con id: ${cursoId} no existe.`);

    const existe = await this.inscripcionRepository.findOne({
      where: { estudiante: { id: estudianteId }, curso: { id: cursoId } }
    });

    if (existe) throw new BadRequestException('El estudiante ya está en este curso');

    try {
      const inscripcion = this.inscripcionRepository.create({
        estudiante,
        curso
      });
      return await this.inscripcionRepository.save(inscripcion);
    } catch (error) {
      HandleDbExceptions.handle(error, 'InscripcionesService');
    }
  }

  async findAll() {
    const inscripcion = await this.inscripcionRepository.find();
    return inscripcion;
  }

  async findAllByStudent (id: string) {

    const inscripcion = await this.inscripcionRepository.find({
      where: {
        estudiante: { id: id }
      }
    });
    return inscripcion;
    
  }

  async findOne(id: string) {
    const inscripcion = await this.inscripcionRepository.findOneBy({ id });
    
        if ( !inscripcion )
          throw new NotFoundException(`Product with ${id} not found`);
    
        return inscripcion;
  }


  async updateProgreso(id: string, updateInscripcionDto: UpdateInscripcionDto) {
    const { progreso } = updateInscripcionDto;
    const inscripcion = await this.inscripcionRepository.preload({
      id: id,
      progreso: progreso
    });
    
        if( !inscripcion ) throw new BadRequestException(`La inscripcion con el id: ${ id } no existe.`);
    
        try{
          await this.inscripcionRepository.save( inscripcion );
          return inscripcion;
        } catch (error) {
          HandleDbExceptions.handle(error, '  InscripcionService');
        }
  }

  async updateEstado(id: string, updateInscripcionDto: UpdateInscripcionDto) {
    const { estado } = updateInscripcionDto;
    
    const inscripcion = await this.inscripcionRepository.preload({
      id: id,
      estado: estado
    });
    
    if ( !inscripcion ) {
      throw new BadRequestException(`La inscripcion con el id: ${ id } no existe.`);
    }

    if ( estado === 'completado' ) {
      inscripcion.progreso = 100;
      inscripcion.fechaCompletado = new Date();
    } 

    try {
      await this.inscripcionRepository.save( inscripcion );
      return inscripcion;
    } catch (error) {
      HandleDbExceptions.handle(error, 'InscripcionService');
    }
}

  async remove(id: string) {
    const curso = await this.findOne( id );
    await this.inscripcionRepository.remove( curso );
  }
}
