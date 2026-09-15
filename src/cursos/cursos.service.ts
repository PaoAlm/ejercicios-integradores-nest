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

@Injectable()
export class CursosService {

  private defaultLimit: number;

  constructor(
    @InjectRepository(Curso)
      private readonly cursoRepository: Repository<Curso>,
      private readonly configService: ConfigService,
      private readonly dataSource: DataSource,
  ) {
    this.defaultLimit = configService.get<number>('DEFAULT_LIMIT');
  }

  async create(createCursoDto: CreateCursoDto) {
    try {
      const curso = this.cursoRepository.create( createCursoDto )
      await this.cursoRepository.save( curso )
      return curso;

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
      throw new NotFoundException(`Product with ${id} not found`);

    return curso;
  }

  async findOnePlain( term: string){
    const curso = await this.findOne( term );
    return curso;
  }

  async update(id: string, updateCursoDto: UpdateCursoDto) {
    const curso = await this.cursoRepository.preload({
      id: id,
      ...updateCursoDto
    });

    if( !curso ) throw new BadRequestException(`El curso con el id: ${ id } no existe.`);

    try{
      await this.cursoRepository.save( curso );
      return curso;
    } catch (error) {
      HandleDbExceptions.handle(error, 'CursosService');
    }
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
}
