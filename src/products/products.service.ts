import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { identity } from 'rxjs';
//se agrega esta linea para validar UUID y se instalan ```` yarn add -D @types/uuid ````
import {validate as isUUID} from 'uuid';
import { ProductImage } from './entities/product.image.entity';
import { url } from 'inspector';

@Injectable()
export class ProductsService {

//instacia del log propio de nest de la clase ProductsService
private readonly logger = new Logger('ProductsService')

  //patron Repository
  constructor(

    

    //este repository nos sivrva para hacer transsacciones query buildes ect y se pueden agregar mas
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,
    //ahora importamos el nuevo repositorio de la tabla ProductImage
    @InjectRepository(ProductImage)
    private readonly productImageRepository:Repository<ProductImage>,

    //esta dependencia es para trabaar co query runner
    private readonly dataSource:DataSource,

   

  ){}
    


  async create(createProductDto: CreateProductDto) {

    try{

      // ... operador rest (resto de los valores )
      const {images =[], ...producDetails} = createProductDto;
       

      //esta linea solo crear un product con los datos que vienen
      const product = this.productRepository.create({
        //... operador espred para esparsir las propiedade de createProducDto
        ...producDetails,
        images: images.map( image => this.productImageRepository.create({ url:image}))

      })
      //esta linea guarda el producto
      await this.productRepository.save(product)

      return {...product, images:images};
    }catch(error){

        this.handleExceptios(error);
    }
    



   
  }

 
 async findAll(paginationDto:PaginationDto) {

    //si no viene el paginationDto con data lo detedo limit=10, offset =0
    const { limit=10, offset =0}= paginationDto;


    const products = await this.productRepository.find({
      take:limit,
      skip: offset,
      //relation despliegas los campos de la relacion si esta en true
      relations:{
        images:true,
      }
    });
    return products.map( product => ({
      ...product,
      images: product.images.map (img => img.url)

    }))
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
      const queryBuilder = this.productRepository.createQueryBuilder('prod');//prod alias de la tabla

        product =  await queryBuilder
        //pasar a mayuscula
        .where('UPPER(title) =:title or slug=:slug',
        {
            title:term.toUpperCase(),
            slug:term.toLowerCase(),

        })
        //prod.images es el alias mas la relacion y prodImages un alias de la otra tabla
        .leftJoinAndSelect('prod.images','prodImages')//se agrega leftJoinAndSelect 
        //para que despliegue la data de la relacion de la tabla producImages
        // en una queryBuilder
        .getOne();//esto solo devuelve 1 dato de la BD
       
        //select * from Products whete slug='xx' or title ='xxxx' (limit 1)
    }
    

    if(!product)
    throw new NotFoundException(`Producto no encontrado con el ${term}`);
    //return {...product, images: product.images.map(images =>images.url)};
    return product;

  }

  async findOnePlain(term:string){

    const { images =[], ...resst}= await this.findOne(term)

    return{
      ...resst,
      images: images.map(image=> image.url)
    }



  }

  async update(id: string, updateProductDto: UpdateProductDto) {

  const{images, ...toUpdate} = updateProductDto




    //al momento de actualizar mantenemos el id y cambiemos lo demas updateProductDto
    const product = await this.productRepository.preload({id:id,...toUpdate});

    


    if(!product) throw new NotFoundException(`producto con el  ${id} no se encontro`);

    //create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try{

      //si vienen las imagnes borramos las imagenes anteriores
      if(images){

        await queryRunner.manager.delete(ProductImage, { product:{id:id}})

        product.images = images.map(
           image=> this.productImageRepository.create({ url:image})
           )
      }else{
        //en caso que no vengan imagenes

          


      }
      await queryRunner.manager.save(product);

    //guarda el producto, lafuncion save actualiza si encuentra el producto y si no lo inserta
    //await this.productRepository.save(product);

    //acemos el commit de la transaccion
    await queryRunner.commitTransaction();
    //con el siguiente comando no vuelve a funcionar
    await queryRunner.release();

    return this.findOnePlain(id)



    }catch(error){

      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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

  //para eliminar todos los productos de la BD
    async deleteAllProduct(){
    const query = this.productRepository.createQueryBuilder('product')
    try{

      return await query
      .delete()
      .where({})
      .execute(); 


    }catch(error)
    {
      this.handleExceptios(error);

    }


   }

}
