import { IsBoolean, IsOptional, IsString, IsArray, Validate } from "class-validator"
import { IsEachGroup } from "../class-val/is-each-group";

export class UpdateFileDto {
    @IsString()
    @IsOptional()
    readonly title: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsArray()
    @IsString({each: true})
    readonly sharingGroups: string[];
}