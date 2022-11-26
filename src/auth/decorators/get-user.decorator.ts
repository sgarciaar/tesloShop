import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
//Aca se hacen el Custom Decorator (Decorador personalizado)
export const GetUser = createParamDecorator(
    //lo que esta en los parentecis son los parametros de entrada
 (data,ctx: ExecutionContext)=>{

    //console.log({data})

    //obtenemos el usuario del Request (JWT)
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if(!user)
        throw new InternalServerErrorException('el usuario no se encontro en la request')

        //esta forma de if se llama ternario
    return (!data)
        ? user
        : user[data];

 }

);


