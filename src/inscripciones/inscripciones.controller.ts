import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionesService.create(createInscripcionDto);
  }

  @Patch(':id/progreso')
  updateProgreso(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInscripcionDto: UpdateInscripcionDto
  ) {
    return this.inscripcionesService.updateProgreso(id, updateInscripcionDto);
  }

  @Patch(':id/completar')
  updateEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInscripcioneDto: UpdateInscripcionDto
  ) {
    return this.inscripcionesService.updateEstado(id, updateInscripcioneDto);
  }

  @Get()
  findAll() {
    return this.inscripcionesService.findAll();
  }

  @Get(':id/inscripciones')
  findAllByStudent(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.inscripcionesService.findAllByStudent(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.inscripcionesService.remove(id);
  }
}
