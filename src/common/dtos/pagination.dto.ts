import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class PaginationDto{

    //decorador propio de Swagger
    @ApiProperty({
        default:10, description:'cuantas filas necesitas'
    })
    @IsOptional()
    @IsPositive()
    @Type(()=> Number)//esto es igual a enambleImplicitConverssion:true
    limit?:number;

     //decorador propio de Swagger
     @ApiProperty({
        default:10, description:'cuantas filas quieres saltar'
    })
    @IsOptional()
    //definimos el valor minimo
    @Min(0)
    @Type(()=> Number)
    offset?:number;



}