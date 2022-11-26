import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from '../auth/auth.module';


@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    ProductsModule,
    //importar este modulo para que funcines el modulo de autorizacion 
    AuthModule,
  ]
})
export class SeedModule {}
