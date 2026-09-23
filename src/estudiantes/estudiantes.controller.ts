import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EstudiantesService } from './estudiantes.service';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { LoginUserDto } from 'src/auth/dtos/login.dto';
import { Estudiante } from './entities/estudiante.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidRoles } from './interfaces/valid-roles';
import { Inscripcion } from 'src/inscripciones/entities/inscripcion.entity';
import { InscripcionesService } from 'src/inscripciones/inscripciones.service';

@ApiTags('Estudiantes')
@Controller('estudiantes')
export class EstudiantesController {
  constructor(
    private readonly estudiantesService: EstudiantesService,
    private readonly inscripcionesService: InscripcionesService
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'Estudiante registrado', type: Estudiante})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
    create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.estudiantesService.create(createEstudianteDto);
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Listado de estudiantes', type: Estudiante})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findAll() {
    return this.estudiantesService.findAll();
  }

  @Get(':id/logros')
  @Auth()
  @ApiResponse({ status: 201, description: 'Listado de logros del estudiante.', type: Estudiante})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findLogros(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: Estudiante
  ) {
    return this.estudiantesService.findLogros(id, user);
  }

  @Get(':id')
  @Auth()
  @ApiResponse({ status: 201, description: 'Estudiante encontrado.', type: Estudiante})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.estudiantesService.findOne(id);
  }

  @Get(':id/inscripciones')
  @Auth()
  @ApiResponse({ status: 201, description: 'Listado de inscripciones del estudiante', type: Inscripcion})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findAllByStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: Estudiante
  ) {
    return this.inscripcionesService.findAllByStudent(id, user);
  }

  @Patch(':id')
  @Auth()
  @ApiResponse({ status: 201, description: 'Estudiante actualizado', type: Estudiante})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstudianteDto: UpdateEstudianteDto
  ) {
    return this.estudiantesService.update(id, updateEstudianteDto);
  }

  @Delete(':id')
  @Auth()
  @ApiResponse({ status: 201, description: 'El estudiante fue eliminado.', type: Estudiante})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  remove(@Param('id') id: string) {
    return this.estudiantesService.remove(id);
  }
}
