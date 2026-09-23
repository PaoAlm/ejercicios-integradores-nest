import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Estudiante } from 'src/estudiantes/entities/estudiante.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/estudiantes/interfaces/valid-roles';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Curso } from './entities/curso.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer } from 'src/files/helpers/fileNamer.helper';
import path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@ApiTags('Cursos')
@ApiBearerAuth('JWT-auth')
@Controller('cursos')
export class CursosController {
  constructor(
    private readonly cursosService: CursosService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'El curso fue creado.', type: Curso})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  create(
    @Body() createCursoDto: CreateCursoDto,
    @GetUser() user: Estudiante,
  ) {
    return this.cursosService.create(createCursoDto, user );
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Listado de cursos', type: Curso})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findAll( @Query() paginationDto: PaginationDto ) {
    console.log(paginationDto);
    return this.cursosService.findAll(paginationDto);
  }

  @Get('mas-populares')
  @Auth()
  @ApiResponse({ status: 200, description: 'Listado de cursos más populares', type: Curso})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findPopular( ) {
    return this.cursosService.findPopular();
  }

  @Get(':id')
  @Auth()
  @ApiResponse({ status: 200, description: 'Curso encontrado', type: Curso})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cursosService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'El curso fue actualizado.', type: Curso})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCursoDto: UpdateCursoDto
  ) {
    return this.cursosService.update(id, updateCursoDto);
  }

  @Post(':id/imagen')
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen del curso actualizada', type: Curso })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  uploadImagen(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.cursosService.updateImagen(id, file);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 201, description: 'El curso fue eliminado.', type: Curso})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cursosService.remove(id);
  }
}
