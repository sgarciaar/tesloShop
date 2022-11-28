import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Type } from 'class-transformer';
import { ProductImage } from './product.image.entity';
import { User } from '../../auth/entities/user.entity';
import {ApiProperty} from '@nestjs/swagger';
//renombrar el nombre de la tabla
@Entity({ name:'products' })
export class Product {

    //decorador propio de swagger
    @ApiProperty({

        example:'12286a61-f318-4c17-afa4-3ae8f9a0983f',
        description:'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

     //decorador propio de swagger
     @ApiProperty({

        example:'T-Shier Teslo',
        description:'Product Title',
        uniqueItems: true
    })
    @Column('text',{
        unique: true,
    })
    title:string;

     //decorador propio de swagger
     @ApiProperty({

        example:0,
        description:'Product Price'
      
    })
    //si no especifico el valor del producto este quedaria en 0 por el default:0
    @Column('float',{
        default:0
    })
    price: number;

     //decorador propio de swagger
     @ApiProperty({

        example:'Tempor anim veniam non aliqua id aliquip ullamco.',
        description:'Product Description',
        default:null
    })
    @Column({
        type:'text',
        nullable:true
    })
    description: string;

     //decorador propio de swagger
     @ApiProperty()
    @Column('text',{
        unique:true
    })
    slug: string;

     //decorador propio de swagger
     @ApiProperty()
    @Column('int',{
        default:0
    })
    stock:number;

 //decorador propio de swagger
    @ApiProperty()
    @Column('text',{
        array: true
    })
    sizes:string[]

     //decorador propio de swagger
     @ApiProperty()
    @Column('text')
    gender:string

     //decorador propio de swagger
     @ApiProperty()
    @Column({
        type:'text',
        array: true,
        default:[]
    })
    tags:string[];

     //decorador propio de swagger
     @ApiProperty()
    //aca hacemos la relacion con la tabla product_images
    //1 a muchos
    @OneToMany(
        //con que entidad se va a relacionar
        ()=> ProductImage,
         //con que campo se va a relacionar
        (productImage)=>productImage.product,
        //ayuda a eliminar en cascada
        //duncion eager en true para que muestre la data con cualquier find()en una
        // relacon entre tablas
        {cascade: true, eager:true} 
    )
    images?:ProductImage[];

     
    @ManyToOne(
        //con que entidad se va a relacionar
        ()=>User,
         //con que campo se va a relacionar
        (user)=>user.product,
        //carga automaticamente la relacion
        {eager:true},
    )
    user:User

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
