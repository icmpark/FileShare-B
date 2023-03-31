import { IsString, Matches, IsOptional } from "class-validator";
import { Same } from "./same-pass";

export class CreateUserDto {
    @IsString()
    readonly userName: string;

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    readonly password: string;

    @IsString()
    @Same('password', {message: 'Two password must be same'})
    readonly rePassword: string;
}