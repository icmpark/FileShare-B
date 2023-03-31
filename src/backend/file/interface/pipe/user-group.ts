import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ExistUserGroupQuery } from 'src/backend/group/application/query/group-user-exist.query';

@Injectable()
export class UserGroup implements PipeTransform<any> {
    constructor(private queryBus: QueryBus) { }

    async transform(value: any[], metadata: ArgumentMetadata) {
        const [body, userId] = value;

        if (!('sharingGroups' in body))
            throw new BadRequestException("No sharing groups property");

        const findUserQuery = (sharingGroup: string) => {
            const query = new ExistUserGroupQuery(sharingGroup, userId, false, true, false);
            return this.queryBus.execute(query);
        };

        const validate = await Promise.all(body.sharingGroups.map(findUserQuery))
        
        if(!validate.every((res) => res))
            throw new BadRequestException("User not in Group");
        
        return body;
    }
}