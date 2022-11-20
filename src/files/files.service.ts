import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {

    getStaticProductImage(imageName:string){
        //creamos el path
        const path = join(__dirname,'../../static/products',imageName);

        //preguntamos si existe el archivo con el path
        if( !existsSync(path))
        throw new BadRequestException(`no se encontro la imagen ${imageName}`);

        return path;

    }
  
}
