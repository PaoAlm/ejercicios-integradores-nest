import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  create(
    @Body() createCursoDto: CreateCursoDto
  ) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    console.log(paginationDto);
    return this.cursosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cursosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCursoDto: UpdateCursoDto
  ) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cursosService.remove(id);
  }
}
