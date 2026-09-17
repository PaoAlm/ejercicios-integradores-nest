import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UnauthorizedException } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/estudiantes/interfaces/valid-roles';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  @Auth()
  create(
    @Body() createInscripcionDto: CreateInscripcionDto,
    @GetUser() user: Estudiante,
  ) {
    return this.inscripcionesService.create(createInscripcionDto, user);
  }

  @Patch(':id/progreso')
  @Auth()
  updateProgreso(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInscripcionDto: UpdateInscripcionDto
  ) {
    return this.inscripcionesService.updateProgreso(id, updateInscripcionDto);
  }

  @Patch(':id/completar')
  @Auth()
  updateEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInscripcioneDto: UpdateInscripcionDto
  ) {
    return this.inscripcionesService.updateEstado(id, updateInscripcioneDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.inscripcionesService.findAll();
  }

  @Auth()
  @Get(':id/inscripciones')
  findAllByStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: Estudiante
  ) {
    return this.inscripcionesService.findAllByStudent(id, user);
  }
  
  @Auth()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.inscripcionesService.remove(id);
  }
}
