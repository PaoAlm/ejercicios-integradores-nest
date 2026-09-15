import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Repository, DataSource, In } from 'typeorm';
import { isUUID } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { CategoriasValidas } from './interfaces/categorias';

@Injectable()
export class CursosService {

  private defaultLimit: number;
  private readonly logger = new Logger('CursosService');

  constructor(
    @InjectRepository(Curso)
      private readonly cursoRepository: Repository<Curso>,
      private readonly configService: ConfigService,
      private readonly dataSource: DataSource
  ) {
    this.defaultLimit = configService.get<number>('DEFAULT_LIMIT');
  }

  async create(createCursoDto: CreateCursoDto) {
    try {
      const curso = this.cursoRepository.create( createCursoDto )
      await this.cursoRepository.save( curso )
      return curso;

    } catch (error) {
      this.handleExceptions( error );
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
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
   const curso = await this.findOne( id );
   await this.cursoRepository.remove( curso );
    
   return `El curso: con el id: ${ id } ha sido eliminado.`;
  }

  private handleExceptions( error: any ) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
