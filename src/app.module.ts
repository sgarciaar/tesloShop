import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


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
      //para que Cargue automaticamente las entidades
      autoLoadEntities: true,
      //si creas o borras una columna lo sincroniza de inmedito en produccion se ocupa en falso
      synchronize: true,


    }),
  
  ],
 
})
export class AppModule {}
