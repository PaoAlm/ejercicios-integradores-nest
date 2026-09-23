import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UnauthorizedException } from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/estudiantes/interfaces/valid-roles';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Inscripcion } from './entities/inscripcion.entity';

@ApiTags('Inscripciones')
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly inscripcionesService: InscripcionesService) {}

  @Post()
  @Auth()
  @ApiResponse({ status: 201, description: 'Inscripción creada', type: Inscripcion})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  create(
    @Body() createInscripcionDto: CreateInscripcionDto,
    @GetUser() user: Estudiante,
  ) {
    return this.inscripcionesService.create(createInscripcionDto, user);
  }

  @Patch(':id/progreso')
  @Auth()
  @ApiResponse({ status: 201, description: 'Progreso actualizado', type: Inscripcion})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  updateProgreso(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInscripcionDto: UpdateInscripcionDto
  ) {
    return this.inscripcionesService.updateProgreso(id, updateInscripcionDto);
  }

  @Patch(':id/completar')
  @Auth()
  @ApiResponse({ status: 201, description: 'Estado actualizado', type: Inscripcion})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  updateEstado(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInscripcioneDto: UpdateInscripcionDto
  ) {
    return this.inscripcionesService.updateEstado(id, updateInscripcioneDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'Listado de inscripciones de todos los estudiantes', type: Inscripcion})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findAll() {
    return this.inscripcionesService.findAll();
  }
  
  @Delete(':id')
  @Auth()
  @ApiResponse({ status: 201, description: 'La inscripción fue eliminada.', type: Estudiante})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.inscripcionesService.remove(id);
  }
}
