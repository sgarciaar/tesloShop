import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { identity } from 'rxjs';
//se agrega esta linea para validar UUID y se instalan ```` yarn add -D @types/uuid ````
import {validate as isUUID} from 'uuid';

@Injectable()
export class ProductsService {

//instacia del log propio de nest de la clase ProductsService
private readonly logger = new Logger('ProductsService')

  //patron Repository
  constructor(

    

    //este repository nos sivrva para hacer transsacciones query buildes ect y se pueden agregar mas
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,

   

  ){}
    


  async create(createProductDto: CreateProductDto) {

    try{
        //movimos este codigo al product.entity.ts usando el beforeinsert
        //if( !createProductDto.slug){

       // createProductDto.slug= createProductDto.title
       // .toLowerCase()
       // .replaceAll(' ','_')
       // .replaceAll("'",'')
          
       // } else{

       // createProductDto.slug= createProductDto.slug
       // .toLowerCase()
       // .replaceAll(' ','_')
       // .replaceAll("'",'')

        //}
        




      //esta linea solo crear un product con los datos que vienen
      const product = this.productRepository.create(createProductDto)
      //esta linea guarda el producto
      await this.productRepository.save(product)

      return product;
    }catch(error){

        this.handleExceptios(error);
    }
    



   
  }

  // TODO: paginar 
  findAll(paginationDto:PaginationDto) {

    //si no viene el paginationDto con data lo detedo limit=10, offset =0
    const { limit=10, offset =0}= paginationDto;


    const products = this.productRepository.find({
      take:limit,
      skip: offset,

      // TODO telaciones



    });
    return products;
  }

  async findOne(term: string) {
    //const product = await this.productRepository.findBy({id});
   // const product =  await this.productRepository.findOneBy({id});

    let product:Product;
    if(isUUID(term)){
      //si el term es un uuid buscaremos los registros de la talba por el id:term eso e sigual a id=term
      product =  await this.productRepository.findOneBy({id:term});
    }else{
      product =  await this.productRepository.findOneBy({ slug:term});

    }


    if(!product)
    throw new NotFoundException(`Producto no encontrado con el ${term}`);
    return product;

  }
  //ejemplo con sqlBuilder
  async findOne2(term: string) {
    //const product = await this.productRepository.findBy({id});
   // const product =  await this.productRepository.findOneBy({id});

    let product:Product;
    if(isUUID(term)){
      //si el term es un uuid buscaremos los registros de la talba por el id:term eso e sigual a id=term
      product =  await this.productRepository.findOneBy({id:term});
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder();

        product =  await queryBuilder
        //pasar a mayuscula
        .where('UPPER(title) =:title or slug=:slug',
        {
            title:term.toUpperCase(),
            slug:term.toLowerCase(),

        }).getOne();//esto solo devuelve 1 dato de la BD

        //select * from Products whete slug='xx' or title ='xxxx' (limit 1)
    }
    

    if(!product)
    throw new NotFoundException(`Producto no encontrado con el ${term}`);
    return product;

  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({

        id:id,
        ...updateProductDto

    })
    if(!product) throw new NotFoundException(`producto con el  ${id} no se encontro`);

    try{
    //guarda el producto, lafuncion save actualiza si encuentra el producto y si no lo inserta
    await this.productRepository.save(product);
    return product
    }catch(error){

      this.handleExceptios(error)




    }
    
  }

  async remove(id: string) {
      const product = await this.findOne(id);
      await this.productRepository.remove(product);

  }

  private handleExceptios( error:any){

    //este codifo numero esta al ser un consol.log y es una vlaor estandar 
    if (error.code === '23505')
    throw new BadRequestException(error.detail);
    //implementando el loger y lo miestra en consola
    this.logger.error(error)
    throw new InternalServerErrorException(`Unexpected error, check server log `)


  }
}
