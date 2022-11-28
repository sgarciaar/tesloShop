import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional,
     IsPositive, IsString, MinLength 
    } from "class-validator";

export class CreateProductDto {

    //decorador propio de Swagger
    @ApiProperty({
         description:'Product title',
         nullable:false,
         minLength:1

    })
    @IsString()
    @MinLength(1)
    title:string;

    //decorador propio de Swagger
    @ApiProperty()
    @IsString({ each:true})
    @IsArray()
    sizes: string[];

    //decorador propio de Swagger
    @ApiProperty()
    //si este campo no viene con uno de esos vlaores no lo pasa la validacion
    @IsIn(['men','women','kid','unisex'])
    gender: string;


    //decorador propio de Swagger
    @ApiProperty()
    //el signo ? indica que es opcional el envio de ese campo en el controller
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;


//decorador propio de Swagger
    @ApiProperty()
    @IsOptional()
    @IsString()
    description?:string;
    
    //decorador propio de Swagger
    @ApiProperty()
    @IsOptional()
    @IsString()
    slug?: string;


    //decorador propio de Swagger
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @IsPositive()
    stock?:number;

    //decorador propio de Swagger
    @ApiProperty()
    @IsString({ each:true})
    @IsArray() 
    @IsOptional()   
    tags:string[]

    //decorador propio de Swagger
    @ApiProperty()
    @IsString({ each:true})
    @IsArray() 
    @IsOptional()   
    images?:string[]
   


}
