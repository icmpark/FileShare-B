import { IsNumber, IsString, Max, Min } from "class-validator";
import { Type } from 'class-transformer';

export class SearchGroupDto {
    @IsString()
    readonly groupName: string;

    @IsNumber()
    @Type(() => Number)
    @Min(0)
    readonly offset: number;
    
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    readonly limit: number;
}