import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
@Injectable()
export class FilesService {
  getStaticCursoImage(imageName: string){
    const path = join( __dirname, '../../static/cursos', imageName );
      if ( !existsSync(path) ) 
        throw new BadRequestException(`No existe un curso con la imagen ${ imageName }`);

      return path;
  }
}
