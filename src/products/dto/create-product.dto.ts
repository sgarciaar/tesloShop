import { IsArray, IsIn, IsInt, IsNumber, IsOptional,
     IsPositive, IsString, MinLength 
    } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title:string;

    @IsString({ each:true})
    @IsArray()
    sizes: string[];

    //si este campo no viene con uno de esos vlaores no lo pasa la validacion
    @IsIn(['men','women','kid','unisex'])
    gender: string;
    //el signo ? indica que es opcional el envio de ese campo en el controller
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?:number;


    @IsOptional()
    @IsString()
    description?:string;
    
    
    @IsOptional()
    @IsString()
    slug?: string;


    
    @IsOptional()
    @IsInt()
    @IsPositive()
    stock?:number;


    @IsString({ each:true})
    @IsArray() 
    @IsOptional()   
    tags:string[]

    @IsString({ each:true})
    @IsArray() 
    @IsOptional()   
    images?:string[]
   


}
