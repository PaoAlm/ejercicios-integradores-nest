import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import path, { join } from 'path';
import { fileNamer } from './helpers/fileNamer.helper';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService
  ){}
  
  saveCursoImage(file: Express.Multer.File): string {
    const fileName = fileNamer(file);
    const folderPath = path.join(process.cwd(), 'static/cursos');

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    fs.writeFileSync(path.join(folderPath, fileName), file.buffer);

    return `${this.configService.get('HOST_API')}/files/curso/${fileName}`;
  }

  getStaticCursoImage(imageName: string){
    const path = join( __dirname, '../../static/cursos', imageName );
      if ( !existsSync(path) ) 
        throw new BadRequestException(`No existe un curso con la imagen ${ imageName }`);

      return path;
  }
}
