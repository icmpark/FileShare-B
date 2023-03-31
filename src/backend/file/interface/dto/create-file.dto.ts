import { IsString, IsArray } from "class-validator"

export class CreateFileDto {
    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;

    @IsArray()
    @IsString({each: true})
    readonly sharingGroups: string[];
}