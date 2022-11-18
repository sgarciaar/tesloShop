import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from './product.entity';

@Entity()
export class ProductImage{

    //id que se invrementa solo
   // @PrimaryGeneratedColumn('increment')
   @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;


    //aca hacemos la relacion con la tabla producto muchos a 1
    @ManyToOne(
       ()=> Product,
       (product)=>product.images,
       //se define aca para borrar en cascasa
       {onDelete:'CASCADE'}
    )
    product:Product


}