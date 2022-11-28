
//para que sea tomado por la documentacion de swaggwe se cambia de mapped-types a swagger
//import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';

import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
