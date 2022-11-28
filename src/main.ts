import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //asi se instancia  el elooger
  const logger = new Logger('Mi App');

  //Agregar la linea para tener un path Global
  app.setGlobalPrefix('api');

  //esta linea se agrega aca despues de ejecutar yarn add class-validator class-transformer para porder utilizar
  //los decoradores de validacion en el dto
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
   );

    //aca se implementa Swagger en la siguiente url http://localhost:3000/api
    const config = new DocumentBuilder()
    .setTitle('Teslo RESTFull')
    .setDescription('Teslo Descripction')
    .setVersion('1.0')
    //los tag son para agrupar
    //.addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);





  await app.listen(process.env.PORT);
  //asi se implemente el logger
  logger.log(` la app esta corriendo en el puerto ${process.env.PORT}`)
}
bootstrap();
