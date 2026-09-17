import { Injectable } from '@nestjs/common';
import { CursosService } from 'src/cursos/cursos.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from 'src/cursos/entities/curso.entity';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { InscripcionesService } from 'src/inscripciones/inscripciones.service';
import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';

@Injectable()
export class SeedService {
constructor(
      private readonly cursosService: CursosService,
      private readonly estudiantesService: EstudiantesService,
      private readonly inscripcionesService: InscripcionesService,

      @InjectRepository( Estudiante )
      private readonly estudiantesRepository: Repository<Estudiante>,

      @InjectRepository( Curso )
      private readonly cursosRepository: Repository<Curso>,

      @InjectRepository( Inscripcion )
      private readonly inscripcionRepository: Repository<Inscripcion>
    ){}

  async runSeed(){
    await this.deleteTables();

    const adminUser = await this.insertNewUsers();
    await this.insertNewCursos( adminUser );
    await this.insertNewInscripciones( adminUser );
    
    return 'seed executed';
  }

  private async deleteTables() {

    await this.cursosService.deleteAllCursos();
    await this.estudiantesService.deleteAllEstudiantes();
    await this.inscripcionesService.deleteAllInscripciones();

  }

  private async insertNewUsers() {
    const seedUsers = initialData.estudiantes;

    const users: Estudiante[] = [];

    seedUsers.forEach( user => {
      users.push( this.estudiantesRepository.create(user) );
    });

    const dbUsers = await this.estudiantesRepository.save( seedUsers );

    return dbUsers[0];
  }


  private async insertNewCursos( adminUser: Estudiante ) {
      const cursos = initialData.cursos;

      const insertPromises = [];

      cursos.forEach( curso => {
        insertPromises.push( this.cursosService.create( curso, adminUser ) );
      });

      await Promise.all( insertPromises );

    return true;
  }

  private async insertNewInscripciones( adminUser: Estudiante ) {
    const inscripciones = initialData.inscripciones;
      const insertPromises = [];

      inscripciones.forEach( inscripcionData => {
          const { cursoId, estudianteId, ...restoDatos } = inscripcionData;
          const nuevaInscripcion = this.inscripcionRepository.create({
              ...restoDatos,
              estudiante: { id: estudianteId },
              curso: { id: cursoId }
          });

          insertPromises.push( this.inscripcionRepository.save(nuevaInscripcion) );
      });

      await Promise.all( insertPromises );

      return true;
    }
}
