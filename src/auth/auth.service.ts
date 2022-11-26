import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import  {JwtService} from '@nestjs/jwt'
import { JwtPayload } from './interfaces/jwt-payload.interface';



@Injectable()
export class AuthService {

  constructor(

    //siquiero usar mi modelo entidad debo hacer una injeccion de nuestro repositorio
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    //se usa servicio por el jwtModule
    private readonly jwtService: JwtService,


  ){}


 async create(createUsertDto: CreateUserDto) {
    //simpre try catch
    try{

      const{password, ...userdata}= createUsertDto;


//esto es para preparar la insercion, NO PARA INSERTARLO
     const user =this.userRepository.create( {...userdata ,
    
      //encriptamos la contraseña con  bcrypt.hashSync(password, 10) y le damos 10 vueltas
      password: bcrypt.hashSync(password, 10)
    
    
    });
//aca si se hace la insercion 
     await this.userRepository.save(user)

    //elimonamos el campo password de la respuesta
     delete user.password;

     return {
      ...user,
      toke: this.getJwtToken({id: user.id})
     };

    }catch(error)
    {
      //console.log(error);
     this.handleDBError(error);

    }
    

 }

 async login(loginUserDto:LoginUserDto){

  const { password, email,  } = loginUserDto;
//busqueda correcta
  //const user = await this.userRepository.findOneBy({email:email})

  //otra busqueda
  const user = await this.userRepository.findOne({
    where: {email:email},
    //si necesit mostrar un campo dejarlo true
    select:{email: true, password:true, id:true }

  });
  if(!user)
  throw new UnauthorizedException('el email no bizo match')
//el compareSync compara 2 contraseñas 
  if(!bcrypt.compareSync(password, user.password))
  throw new UnauthorizedException('las contraseñas no son iguales')

  return {
    ...user,
    token:this.getJwtToken({id: user.id})
  };

  //TODO retornar jwt
 }

  async checkAuthStatus(user:User){

    return {
      ...user,
      token:this.getJwtToken({id: user.id})
    };
  

      

    }

 private getJwtToken(payload: JwtPayload){
  const token = this.jwtService.sign(payload);
  return token;

 }

//tipo NEVER jamas devolvera una valor esta funcion
 private handleDBError(error:any):never{
  if(error.code ==='23505')
    throw new BadRequestException(error.detail);

    console.log(error)
    throw new InternalServerErrorException('porfavor ve el log')


 }

 
}
