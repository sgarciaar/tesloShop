import { UnauthorizedException, Injectable } from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import {Strategy, ExtractJwt} from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

//se deja injectable para ocuparto en otros modulos 
//al ser un strategy se deja  como provider y se  exporta
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    
    constructor(

        //aca injectamos el repositorio que manejara el usuario
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        //agregar el imports de ConfigModule en el auth.module
        configService:ConfigService

    ){
        //al momento se definir el constructor  por defecto debemos llamar al padre del PassportStrategy
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            //en que posicion mandare el jwt //header, bearer etc
            //haremos que venga del Bearer
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

        });
    }

    //aca valido el payload e implementar ahi la condicion
    //y el payload debe lucir como la interface
    //este metodo se va a llamar si el jwt no a expirado
    //y si la firma del jwt hace match con el payload
    async  validate(payload: JwtPayload):Promise<User>{


        //aca estraigo lo que quiero

        const {id}= payload;

        const user = await this.userRepository.findOneBy({id:id})

        //si el usuario no existe
        if(!user){
            throw new UnauthorizedException('token invalido')
        }
        //si el usuario no esta activo
        if(!user.isActive){
        console.log(user.isActive);
            throw new UnauthorizedException('usuario no activo')

        }

        //console.log(user)
        return user;
       
    

    }
}