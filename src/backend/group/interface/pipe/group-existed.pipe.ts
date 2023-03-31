import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindGroupQuery } from '../../application/query/group-find.query';

@Injectable()
export class GroupExisted implements PipeTransform<any> {
    constructor(private queryBus: QueryBus) { }

    async transform(value: string, metadata: ArgumentMetadata) {
        const data = metadata.data;
        const groupId = value;

        const query = new FindGroupQuery(groupId);
        const groupExisted: boolean = (await this.queryBus.execute(query)) != null;

        if (data == 'groupId' && !groupExisted)
            throw new BadRequestException({messages: 'Group not Existed'});

        if (data == 'nGroupId' && groupExisted)
            throw new BadRequestException({messages: 'Group Existed'});

        return value;
    }
}