import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';




@Module({
  imports: [
    ConfigModule.forRoot(),
    //configuraacin bd postgress
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME, 
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      //para que Cargue automaticamente las entidades ORMType
      autoLoadEntities: true,
      //si creas o borras una columna lo sincroniza de inmedito en produccion se ocupa en falso ORMType
      synchronize: true,


    }),
    //para servir contenido statico este module yarn add @nestjs/serve-static
    //y veremos las imagenes staticas en el browser en la url
    //http://localhost:3000/products/1473809-00-A_1_2000.jpg
    ServeStaticModule .forRoot({
      rootPath: join(__dirname,'..','public'),}),

    
    

    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
  
  ],
 
})
export class AppModule {}
