import { IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { IsOnlyTrue } from './is-only-true-pass';
import { Type, Transform } from 'class-transformer';

export class SearchUserGroupDto {
    @IsBoolean()
    @Transform(({ value } ) => value === 'true')
    @IsOnlyTrue('isCandidates', {'message': 'Only one search options be true.'})
    @IsOnlyTrue('isUser', {'message': 'isUser property must be false'})
    readonly isAdmin: boolean;

    @IsBoolean()
    @Transform(({ value } ) => value === 'true')
    @IsOnlyTrue('isAdmin', {'message': 'isAdmin property must be false'})
    @IsOnlyTrue('isUser', {'message': 'isUser property must be false'})
    readonly isCandidates: boolean;


    @IsBoolean()
    @Transform(({ value } ) => value === 'true')
    @IsOnlyTrue('isAdmin', {'message': 'isAdmin property must be false'})
    @IsOnlyTrue('isCandidates', {'message': 'isCandidates property must be false'})
    readonly isUser: boolean;

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