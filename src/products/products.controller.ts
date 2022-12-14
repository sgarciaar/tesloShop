import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, ConsoleLogger } from '@nestjs/common';
import {ApiResponse, ApiTags} from '@nestjs/swagger';


import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
//import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities/product.entity';


//decorador propio de swagger para agrupar los controller
@ApiTags('Products')
@Controller('products')
//con auth() digo que para usar algun servicio 
//se debe estar autentificado osea pasar el JWT
//@Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  //decorador propio de swagger
  @ApiResponse({status:201, description:'producto fue creado',type: Product })
  //decorador propio de swagger
  @ApiResponse({status:400, description:'Informacion faltante'})
    //decorador propio de swagger
    @ApiResponse({status:403, description:'el token no fue proporcionado'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user:User
  ){
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto);
    
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term' )
  findOne(@Param('term')  term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  update(
    @Param('id',ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user:User
    ) {
    return this.productsService.update(id, updateProductDto,user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
