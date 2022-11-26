import { CanActivate, ExecutionContext, Injectable, Controller, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(

    private readonly reflector :Reflector

  ){


  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES,context.getHandler());

    if(!validRoles)return true;
    if(validRoles.length===0)return true;

    //obtener los roles 
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if(!user)
     throw  new BadRequestException('el usuario no existe');

     //foreach forof
     for (const role of user.roles) {
      if(validRoles.includes(role))
          return true

     }

    // console.log({userRoles: user.roles});

    //console.log({validRoles});

    //console.log('UserRoleGuard');
    //return true;

    throw new ForbiddenException(`el usuario ${user.fullName} no tiene el rol asignado necesita tener 
    uno de los siguientes roles [${validRoles}]`);
  }
}
