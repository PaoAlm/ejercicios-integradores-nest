import { Injectable } from '@nestjs/common';
import { CursosService } from 'src/cursos/cursos.service';
import { initialData } from './data/seed-data';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { EstudiantesService } from 'src/estudiantes/estudiantes.service';
import { InscripcionesService } from 'src/inscripciones/inscripciones.service';
import { LogrosService } from 'src/logros/logros.service';
import { Curso } from 'src/cursos/entities/curso.entity';
import { Logro } from 'src/logros/entities/logro.entity';

@Injectable()
export class SeedService {
constructor(
      private readonly cursosService: CursosService,
      private readonly estudiantesService: EstudiantesService,
      private readonly inscripcionesService: InscripcionesService,
      private readonly logrosService: LogrosService,
    ){}

  async runSeed(){
    await this.deleteTables();

    const adminUser = await this.insertNewUsers();
    await this.insertNewCursos( adminUser );
    await this.insertNewInscripciones();
    await this.insertNewLogros( adminUser );
    
    return 'seed executed';
  }

  private async deleteTables() {

    await this.cursosService.deleteAllCursos();
    await this.logrosService.deleteAllLogrosObtenidos();
    await this.estudiantesService.deleteAllEstudiantes();
    await this.inscripcionesService.deleteAllInscripciones();
    await this.logrosService.deleteAllLogros();

  }

  private async insertNewUsers() {
    const dbUsers = await this.estudiantesService.insertEstudiantes(initialData.estudiantes);
    return dbUsers[0];
  }


  private async insertNewCursos( adminUser: Estudiante ) {
      const cursos = initialData.cursos;

      const insertPromises: Promise<Curso>[] = [];

      cursos.forEach( curso => {
        insertPromises.push( this.cursosService.create( curso, adminUser ) );
      });

      await Promise.all( insertPromises );

    return true;
  }

  private async insertNewInscripciones() {
    await this.inscripcionesService.insertInscripciones(initialData.inscripciones);
  }

  private async insertNewLogros( adminUser: Estudiante ) {
      const cursos = initialData.logros;

      const insertPromises: Promise<Logro>[] = [];

      cursos.forEach( logro => {
        insertPromises.push( this.logrosService.create( logro, adminUser ) );
      });

      await Promise.all( insertPromises );

    return true;
  }
}
