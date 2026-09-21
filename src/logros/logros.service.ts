import { CreateLogroDto } from './dto/create-logro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Logro } from './entities/logro.entity';
import { Repository } from 'typeorm';
import { HandleDbExceptions } from 'src/common/helper/handle-exceptions.helper';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { LogroObtenido } from './entities/logro-obtenido.entity';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { InscripcionesService } from 'src/inscripciones/inscripciones.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificacionesGateway } from 'src/notificaciones/notificaciones.gateway';

@Injectable()
export class LogrosService {
  constructor(
    @InjectRepository(Logro)
    private readonly logroRepository: Repository<Logro>,

    @InjectRepository(LogroObtenido)
    private readonly logroObtenidoRepository: Repository<LogroObtenido>,

    private estudiantesService: EstudiantesService,

    @Inject(forwardRef(() => InscripcionesService))
    private inscripcionesService: InscripcionesService,

    private readonly notificacionesGateway: NotificacionesGateway,

  ) {}
  async create(createLogroDto: CreateLogroDto, user: Estudiante) {
    try {
      const curso = this.logroRepository.create( createLogroDto )
      await this.logroRepository.save( curso )
      return curso;

    } catch (error) {
      HandleDbExceptions.handle(error, 'LogrosService');
    }
  }

  async createLogroObtenido(estudianteId: string, logroId: string) {
    const logroExistente = await this.logroObtenidoRepository.findOne({
      where: { estudiante: { id: estudianteId }, logro: { id: logroId } }
    });

    if (logroExistente) return null;

    const estudiante = await this.estudiantesService.findOne(estudianteId);
    const logro = await this.logroRepository.findOne({ where: { id: logroId } }); 

    const logroObtenido = this.logroObtenidoRepository.create({ estudiante, logro });
    return await this.logroObtenidoRepository.save(logroObtenido);
  }

  findAll() {
    return `This action returns all logros`;
  }

  async deleteAllLogros() {
  
      const query = this.logroRepository.createQueryBuilder('logro');
  
      try {
        return await query
          .delete()
          .execute();
  
      } catch (error) {
        HandleDbExceptions.handle(error, 'LogroService');
      }
  
  }

  async deleteAllLogrosObtenidos() {
  
      const query = this.logroObtenidoRepository.createQueryBuilder('logroObtenido');
  
      try {
        return await query
          .delete()
          .execute();
  
      } catch (error) {
        HandleDbExceptions.handle(error, 'LogroService');
      }
  
  }

  async evaluarLogrosEstudiante(estudianteId: string) {
    const nuevosLogros = [];

    const logroPrimerosPasos = await this.logroRepository.findOne({ 
      where: { nombre: 'Primeros Pasos' }
    });

    if (logroPrimerosPasos) {
      const nuevoLogro = await this.createLogroObtenido(estudianteId, logroPrimerosPasos.id);
      if (nuevoLogro) nuevosLogros.push(nuevoLogro);
    }

    const totalHoras = await this.inscripcionesService.totalHorasCompletadas(estudianteId);

    if (totalHoras >= 20) {
      const logroMaratonista = await this.logroRepository.findOne({ 
        where: { nombre: 'Maratonista' }
      });

      if (logroMaratonista) {
        const nuevoLogro = await this.createLogroObtenido(estudianteId, logroMaratonista.id);
        if (nuevoLogro) nuevosLogros.push(nuevoLogro);
      }
    }

    const logroExplorador = await this.logroRepository.findOne({ where: { nombre: 'Explorador' } });
    
    if (logroExplorador) {
      const yaTieneExplorador = await this.logroObtenidoRepository.findOne({
        where: { estudiante: { id: estudianteId }, logro: { id: logroExplorador.id } }
      });

      if (!yaTieneExplorador) {
        const categoriasDistintas = await this.inscripcionesService.categoriasDistintas(estudianteId);
        
        if (categoriasDistintas >= 3) {
          const nuevoLogro = await this.createLogroObtenido(estudianteId, logroExplorador.id);
          if (nuevoLogro) nuevosLogros.push(nuevoLogro);
        }
      }
    }

    if (nuevosLogros.length > 0) {
      console.log('Emitiendo logros...', nuevosLogros);
      for (const logroObtenido of nuevosLogros) {
        console.log('Logro a emitir:', logroObtenido.logro);
        this.notificacionesGateway.emitirLogroDesbloqueado(
          estudianteId, 
          logroObtenido.logro
        );
      }
    }
    
    return nuevosLogros;
  }

}
