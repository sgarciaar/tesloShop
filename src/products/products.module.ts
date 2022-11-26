import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, ProductImage } from './entities';
import { AuthModule } from '../auth/auth.module';



@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    //se importa para autorizar servicios por rol
    AuthModule,
  ],
  exports:[
    ProductsService,
//para exportr entitys de otros modulos
    TypeOrmModule,
  ]
})
export class ProductsModule {}
