import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';



@Injectable()
export class SeedService {


  constructor(

    private readonly producService:ProductsService,

  @InjectRepository(User)
  private readonly userRepository:Repository<User>




  ){}
  
async runSeed(){
  //borro las tablas
  await this.deletedTables();

  const adminUser=  await this.InsertUser();


  await this.insertNewProducts(adminUser);

  return 'Seed Excute';

}

private async deletedTables(){

  await this.producService.deleteAllProduct();
  const queryBuilder = this.userRepository.createQueryBuilder();
  await queryBuilder
    .delete()
    .where({})
    .execute()
}

  private async InsertUser(){
    const seedUsers= initialData.user;

    const users:User[]=[];

    seedUsers.forEach(user=>{
      users.push(this.userRepository.create(user))
    });
    const dbUser = await this.userRepository.save(users)

    return dbUser[0];

  }

 private async insertNewProducts(user:User){

  await this.producService.deleteAllProduct()
  
  const products = initialData.products;

  const insertPromises =[];

  products.forEach(product=>{

  //id de cada promesa   //insertamos las promesas
    const results  =insertPromises.push(this.producService.create(product, user));

  });

  //espera que todas las promesas se inserten 
  await Promise.all(insertPromises);

  return true;


}
  
  
}
