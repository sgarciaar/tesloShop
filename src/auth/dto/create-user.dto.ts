import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    @IsString()
    @IsEmail()
    email :string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'La contraseña debe tener una mayuscula, una Minuscula y un Numero'
    })
    password:string;

    @IsString()
    @MinLength(1)
    fullName:string;

}