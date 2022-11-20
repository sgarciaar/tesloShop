import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports:[

    //al usar esto en el controller private readonly configService:ConfigService,
    //se debe importar esta Modulo 
    ConfigModule
  ]
})
export class FilesModule {}
