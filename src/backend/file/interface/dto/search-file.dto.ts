import { IsString, IsArray, IsNumber, Validate } from "class-validator"
import { Type } from 'class-transformer';
import { IsEachGroup } from "../class-val/is-each-group";

export class SearchFileDto {
    @IsString()
    readonly title: string;

    @IsArray()
    @IsString({each: true})
    readonly sharingGroups: string[];

    @IsNumber()
    @Type(() => Number)
    readonly offset: number;

    @IsNumber()
    @Type(() => Number)
    readonly limit: number;
}