import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';



@Injectable()
export class SeedService {


  constructor(

    private readonly producService:ProductsService



  ){}
  
async runSeed(){
  await this.insertNewProducts();

  return 'Seed Excute';

}

 private async insertNewProducts(){

  await this.producService.deleteAllProduct()
  
  const products = initialData.products;

  const insertPromises =[];

  products.forEach(product=>{

  //id de cada promesa   //insertamos las promesas
    const results  =insertPromises.push(this.producService.create(product));

  });

  //espera que todas las promesas se inserten 
  await Promise.all(insertPromises);

  return true;


}
  
  
}
