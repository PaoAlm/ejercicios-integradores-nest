import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import type { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer } from './helpers/fileNamer.helper';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { Curso } from 'src/cursos/entities/curso.entity';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService
  ) {}

  @Get('curso/:image')
  @Auth()
  @ApiResponse({ status: 201, description: 'Imagen encontrada.', type: Curso })
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findCursoImage(
    @Res() res: Response,
    @Param('image') imageName: string
  ) {
    const filePath = this.filesService.getStaticCursoImage( imageName );
    res.sendFile(filePath)
  }

}
