import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import type { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileNamer } from './helpers/fileNamer.helper';
import path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { CursoImage } from 'src/cursos/entities/curso-image.entity';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('curso/:imageName')
  @Auth()
  @ApiResponse({ status: 201, description: 'Imagen encontrada.', type: CursoImage})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  findCursoImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const filePath = this.filesService.getStaticCursoImage( imageName );
    res.sendFile(filePath)
  }

  @Post('curso')
  @Auth()
  @ApiResponse({ status: 201, description: 'Imagen registrada', type: CursoImage})
  @ApiResponse({ status: 400, description: 'Bad Request'})
  @ApiResponse({ status: 403, description: 'Forbidden. Token Related'})
  @UseInterceptors(FileInterceptor('file'))
  uploadProductImage(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 500000 }),
        new FileTypeValidator({ fileType:/image\/(jpeg|png|jpg)$/ })
      ]
    })
  ) file: Express.Multer.File) {
    const fileName = fileNamer(file);
    file.filename = fileName;

    const folderPath = path.join(process.cwd(), 'static/cursos');
    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);

    const secureUrl = `${ this.configService.get('HOST_API') }/files/curso/${ file.filename }`
    return { secureUrl };
  }
}
