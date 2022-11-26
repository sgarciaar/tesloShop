import { Controller, Get, Post, Body,  UseGuards, Req,Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {AuthGuard} from '@nestjs/passport';
import * as request from 'supertest';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeader } from './decorators/raw-headers.decorator';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    //traemos al usuario activo en el request
    //@GetUser('id') id:string 
    @GetUser() user:User 
  ){
                                /* en la funcion checkAuthStatus
                                se manda el id del usuario o el usuario completo */ 
    return this.authService.checkAuthStatus(user);
  }


  @Get('private')
  //con esto se aplica el Beares al methodo del comntroler
  //y toma las validaciones del strategies/jwt-strategy.ts
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
   //decorador Personalizado de tipo User
   //creado en get-user.decorator.ts
   @GetUser() user:User,
   @GetUser('email') userEmail:string,
   //trae los header con decorador Personalizado
   @RawHeader() rawHeader: string[],
   //trae los header con decorador que viene por defecto de los common
   @Headers() header:string
  ) {



    //al final de la solicitud viene el usuarios
   // console.log(request);

    return {
      ok: true,
      user,
      userEmail,
      rawHeader,
      header,
      
    }
  }

  @Get('private2')
  @RoleProtected(ValidRoles.admin,ValidRoles.superUser,ValidRoles.user)
  //agregar informacion al metodo  indicando los reoles que neceita para entrar el metodo con le guard
  //@SetMetadata('roles',['admin','super-user'])
  //aca mandamos al usuario creado en el swt-strategy.ts methodo validate
  //tambien podemos poner Guard Personalizados UserRoleGuard

  //autentificacionAuthGuard()//autorizacion UserRoleGuard
  @UseGuards(AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user:User
  ){


    return{
      ok:true,
      user
    }
  }

  @Get('private3')
  //con esto Validamos el Token y los permisos
  @Auth(ValidRoles.admin, ValidRoles.superUser, ValidRoles.user )
  privateRoute3(
    @GetUser() user:User
  ){
    return{
      ok:true,
      user
    }
  }



  
}
