import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/estudiantes/interfaces/valid-roles';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(
    @Body() createCursoDto: CreateCursoDto,
    @GetUser() user: Estudiante,
  ) {
    return this.cursosService.create(createCursoDto, user );
  }

  @Get()
  @Auth()
  findAll( @Query() paginationDto: PaginationDto ) {
    console.log(paginationDto);
    return this.cursosService.findAll(paginationDto);
  }

  @Get('mas-populares')
  @Auth()
  findPopular( ) {
    return this.cursosService.findPopular();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cursosService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCursoDto: UpdateCursoDto
  ) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cursosService.remove(id);
  }
}
