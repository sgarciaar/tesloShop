import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';


@Controller('files')
export class FilesController {
//ahora se instala el tipo multer
//yarn add -D @types/multer
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  //con este interceptor definimos el nombre de la key del archivo que me mandan y con la funcion vemos si pasa o no el archivo
  @UseInterceptors( FileInterceptor('file',{
    fileFilter:fileFilter,
    //limits:{ fileSize:10000} definimos el limite de tamaño del archivo
    storage: diskStorage({//aca definimos donde subir la imagen
      destination:'./static/products',
      filename: fileNamer
    })
  }) )
   uploadProductImage(
    //este upload lo sube a una carpeta temporal
   @UploadedFile() file: Express.Multer.File)
  {
    //el archivo se puede subir a claudinary o algun servidor externo al servidor del code propio
    console.log({fileInController:file})
    //si no pasa el interceptor el archivo no entra al controller
    if(!file){
      throw new BadRequestException(`esta seguro que el archivo es una imagen??`);
    }
    return {
      fileName:file.originalname
    };
  }

}



