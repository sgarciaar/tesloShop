import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Type } from 'class-transformer';
import { ProductImage } from './product.image.entity';
import { User } from '../../auth/entities/user.entity';

//renombrar el nombre de la tabla
@Entity({ name:'products' })
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
