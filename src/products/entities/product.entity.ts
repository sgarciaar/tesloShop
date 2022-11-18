import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Type } from 'class-transformer';

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{
        unique: true,
    })
    title:string;

    //si no especifico el valor del producto este quedaria en 0 por el default:0
    @Column('float',{
        default:0
    })
    price: number;

    @Column({
        type:'text',
        nullable:true
    })
    description: string;

    @Column('text',{
        unique:true
    })
    slug: string;

    @Column('int',{
        default:0
    })
    stock:number;

    @Column('text',{
        array: true
    })
    sizes:string[]
    @Column('text')
    gender:string

    @Column({
        type:'text',
        array: true,
        default:[]
    })
    tags:string[];

    //tags
    //images

    //simpre que quiera insertar pasara por estas rutina
    @BeforeInsert()
    checkSlugInsert(){

       if (!this.slug){
        this.slug = this.title;
       }

       this.slug = this.slug
       .toLowerCase()
       .replaceAll(' ','_')
       .replaceAll("'",'')

    }
//simpre que quiera actualizar pasara por estas rutina
    @BeforeUpdate()
    checkSlugUpdate(){

       if (!this.slug){
        this.slug = this.title;
       }

       this.slug = this.slug
       .toLowerCase()
       .replaceAll(' ','_')
       .replaceAll("'",'')

    }
}
