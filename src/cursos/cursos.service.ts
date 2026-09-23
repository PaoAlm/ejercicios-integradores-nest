import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository, DataSource, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CategoriasValidas } from './interfaces/categorias';
import { HandleDbExceptions } from 'src/common/helper/handle-exceptions.helper';
import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class CursosService {

  private defaultLimit: number;

  constructor(
    @InjectRepository(Curso)
      private readonly cursoRepository: Repository<Curso>,


    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly filesService: FilesService

  ) {
    this.defaultLimit = configService.get<number>('DEFAULT_LIMIT');
  }

  async create(createCursoDto: CreateCursoDto, user: Estudiante) {
  try {
    const curso = this.cursoRepository.create(createCursoDto);
    return await this.cursoRepository.save(curso);
  } catch (error) {
    HandleDbExceptions.handle(error, 'CursosService');
  }
}

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, categoria = CategoriasValidas } = paginationDto;
    const cursos = await this.cursoRepository.find({
      take: limit,
      skip: offset,
      where : {
        categoria: In(categoria)
      }
    });

    return cursos;
  }

  async findOne(id: string) {

    const curso = await this.cursoRepository.findOneBy({ id });

    if ( !curso )
      throw new NotFoundException(`El curso con el ${id} no existe.`);

    return curso;
  }

  async findPopular() {
    return await this.cursoRepository.createQueryBuilder('curso')
      .leftJoin(Inscripcion, 'inscripcion', 'inscripcion.cursoId = curso.id')

      .select('curso.id', 'id')
      .addSelect('curso.titulo', 'titulo')
      .addSelect('COUNT(inscripcion.id)', 'cantidadInscripciones')
      .groupBy('curso.id')
      .orderBy('COUNT(inscripcion.id)', 'DESC')
      .getRawMany();
  }

  async update(id: string, updateCursoDto: UpdateCursoDto) {
    const curso = await this.cursoRepository.preload({ id, ...updateCursoDto });
    if (!curso) throw new NotFoundException(`El curso con id: ${id} no existe.`);

    try {
      return await this.cursoRepository.save(curso);
    } catch (error) {
      HandleDbExceptions.handle(error, 'CursosService');
    }
  }

  async updateImagen(id: string, file: Express.Multer.File) {
    const curso = await this.findOne(id);
    curso.imagen = this.filesService.saveCursoImage(file);
    return this.cursoRepository.save(curso);
  }

  async remove(id: string) {
    const curso = await this.cursoRepository.findOneBy({ id });

    if (!curso) {
      throw new NotFoundException(`El curso con el id: ${id} no existe.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.delete(Inscripcion, { curso: { id: id } }); 
      await queryRunner.manager.delete(Curso, { id: id });
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { message: `El curso y todas sus inscripciones fueron eliminados con éxito.` };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.log(error);
      throw new BadRequestException('Error al intentar eliminar el curso y sus inscripciones');  
    }
  }

  async deleteAllCursos() {

    const query = this.cursoRepository.createQueryBuilder('curso');

    try {
      return await query
        .delete()
        .execute();

    } catch (error) {
      HandleDbExceptions.handle(error, 'CursosService');
    }

  }
}
