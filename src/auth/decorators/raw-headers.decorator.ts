import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';


export const RawHeader = createParamDecorator(
    //lo que esta en los parentecis son los parametros de entrada
 (data,ctx: ExecutionContext)=>{

    //console.log({data})

    //obtenemos el usuario del Request (JWT)
    const req = ctx.switchToHttp().getRequest();
    return req.rawHeaders;

    
 }

);