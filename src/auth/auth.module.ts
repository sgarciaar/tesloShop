import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule} from '@nestjs/passport';
import { JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
 
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
 
  //esto es para que aparezca en la entidad en la bd
  imports: 
  [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    //implementando jwt
    //la estrategia por defecto sera jwt
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      //se debe importar este modulo
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService:ConfigService) => {
        //este viene del config service
        console.log('JWT Secret', configService.get('JWT_SECRET')),
        //este viene e las variables de entorno
        console.log('JWT SECRET', process.env.JWT_SECRET )
        return {
          //se puede traer de las variables de entorno o
        //secret:process.env.JWT_SECRET,
        secret:configService.get('JWT_SECRET'),
      //el token dura 2 horas
        signOptions:{
         expiresIn :'2h'
        }      
      }}
    })





    //JwtModule.register({
     // secret:process.env.JWT_SECRET,
      //el token dura 2 horas
     //   signOptions:{
      //    expiresIn :'2h'
      //  }
  //  }) 
  ],
  //esto es para ocupar el modulo de User en otros modulos
  //todos estos modulos se tienen que exportar 
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
