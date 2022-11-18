import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3000);
}
bootstrap();
