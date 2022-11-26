import { isString } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true
    })
    email:string;

    //al hace select:false la propiesda no se mostrara con un find
    @Column('text',{
        select: false
    })
    password:string;

    @Column('text')
    fullName:string;

    @Column('bool',{
        default:true
    })
    isActive:boolean;

    @Column('text',{
        array: true,
        //valor por defecto en el arreglo, los usuarios tendran un rol por defecto
        default:['user']
    })
    roles:string[];

    @OneToMany(
         //con que entidad se va a relacionar
        ()=> Product,
        //con que campo se va a relacionar
        (product)=>product.user
    )
    product:Product



    @BeforeInsert()
    checkFieldBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    
    @BeforeUpdate()
    checkFieldBeforeUpdate(){

       this.checkFieldBeforeInsert();
    }
}

