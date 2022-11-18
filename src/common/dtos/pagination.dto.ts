import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @Type(()=> Number)//esto es igual a enambleImplicitConverssion:true
    limit?:number;

    @IsOptional()
    //definimos el valor minimo
    @Min(0)
    @Type(()=> Number)
    offset?:number;



}