import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class NonEmpty implements PipeTransform<any> {

    async transform(value: string, metadata: ArgumentMetadata) {

        if (value == undefined || value == "")
            throw new BadRequestException({messages: 'Empty String in Request'});


        return value;
    }
}