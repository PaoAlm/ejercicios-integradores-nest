import { Injectable, NotFoundException, BadRequestException, Delete, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Inscripcion } from './entities/inscripcion.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleDbExceptions } from 'src/common/helper/handle-exceptions.helper';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { CursosService } from 'src/cursos/cursos.service';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { ValidRoles } from '../estudiantes/interfaces/valid-roles';
import { LogrosService } from 'src/logros/logros.service';
import { LogroObtenido } from 'src/logros/entities/logro-obtenido.entity';

@Injectable()
export class InscripcionesService {

  constructor(
      @InjectRepository(Inscripcion)
      private readonly inscripcionRepository: Repository<Inscripcion>,

      private estudiantesService: EstudiantesService,
      private cursosService: CursosService,
      private logrosService: LogrosService

    ) {}

  async create(createInscripcionDto: CreateInscripcionDto, user: Estudiante) {
    
    const { estudianteId, cursoId } = createInscripcionDto;

    if (estudianteId !== user.id && !user.roles.includes(ValidRoles.admin)) {
      throw new ForbiddenException('No se permite registrar cursos a nombre de otro usuario');
    }

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

  async findAllByStudent (id: string, user: Estudiante) {

    if (id === user.id || user.roles.includes(ValidRoles.admin)) {
      const inscripcion = await this.inscripcionRepository.find({
        where: {
          estudiante: { id: id }
        }
      });
      return inscripcion;
    } else {
      throw new UnauthorizedException('No se permite consultar inscripciones a nombre de otro usuario');
    }
  }

  async findOne(id: string) {
    const inscripcion = await this.inscripcionRepository.findOneBy({ id });
    
        if ( !inscripcion )
          throw new NotFoundException(`La inscripcion con el id: ${ id } no existe.`);
    
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
    
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id },
      relations: {
        estudiante: true
      }
    });
    
    if (!inscripcion) {
      throw new BadRequestException(`La inscripcion con el id: ${ id } no existe.`);
    }

    inscripcion.estado = estado;

    if (estado === 'completado') {
      inscripcion.progreso = 100;
      inscripcion.fechaCompletado = new Date();
    } 

    try {
      await this.inscripcionRepository.save(inscripcion);
      
      let nuevosLogros: LogroObtenido[] = [];

      if (estado === 'completado' && inscripcion.estudiante) {
        nuevosLogros = await this.logrosService.evaluarLogrosEstudiante(inscripcion.estudiante.id);
      }

      return {
        inscripcion,
        nuevosLogrosObtenidos: nuevosLogros
      };

    } catch (error) {
      HandleDbExceptions.handle(error, 'InscripcionService');
    }
  }

  async remove(id: string) {
    const inscripcion = await this.findOne( id );
    await this.inscripcionRepository.remove( inscripcion );
    
    return `La inscripcion con el id: ${ id } ha sido eliminado.`;
  }

  async deleteAllInscripciones() {

    const query = this.inscripcionRepository.createQueryBuilder('inscripcion');

    try {
      return await query
        .delete()
        .execute();

    } catch (error) {
      HandleDbExceptions.handle(error, 'InscripcionService');
    }

  }
  
  async insertInscripciones(inscripciones: (DeepPartial<Inscripcion> & { estudianteId: string; cursoId: string })[]) {
  const entities = inscripciones.map(({ estudianteId, cursoId, ...resto }) =>
    this.inscripcionRepository.create({
      ...resto,
      estudiante: { id: estudianteId },
      curso: { id: cursoId },
    }),
  );
  return this.inscripcionRepository.save(entities);
}
  async cursosCompletados(estudianteId: string): Promise<boolean> {
    const cantidad = await this.inscripcionRepository.count({
      where: {
        estudiante: { id: estudianteId }, 
        estado: 'completado',
      },
    });

    return cantidad > 0;
  }

  async contarCursosCompletados(estudianteId: string): Promise<number> {
    return this.inscripcionRepository.count({
      where: { 
        estudiante: { id: estudianteId },
        estado: 'completado',
      },
    });
  }

  async totalHorasCompletadas(estudianteId: string): Promise<number> {
    const resultado = await this.inscripcionRepository.createQueryBuilder('inscripcion')
      .leftJoin('inscripcion.curso', 'curso') 
      .where('inscripcion.estudiante = :estudianteId', { estudianteId })
      .andWhere('inscripcion.estado = :estado', { estado: 'completado' })
      .select('SUM(curso.duracionHoras)', 'totalHoras') 
      .getRawOne();

    return Number(resultado?.totalHoras) || 0; 
  }

  async categoriasDistintas(estudianteId: string): Promise<number> {
    const resultado = await this.inscripcionRepository.createQueryBuilder('inscripcion')
      .leftJoin('inscripcion.curso', 'curso') 
      .where('inscripcion.estudiante = :estudianteId', { estudianteId })
      .andWhere('inscripcion.estado = :estado', { estado: 'completado' })
      .select('COUNT(DISTINCT curso.CATEGORIA)', 'totalCategorias') 
      .getRawOne();
      
    return Number(resultado?.totalCategorias) || 0;; 
  }

}
