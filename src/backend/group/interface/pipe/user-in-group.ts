import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindUserQuery } from 'src/backend/user/application/query/user-find.query';
import { ExistUserGroupQuery } from '../../application/query/group-user-exist.query';

@Injectable()
export class UserInGroup implements PipeTransform<any> {
    constructor(private queryBus: QueryBus) { }

    async transform(value: string[], metadata: ArgumentMetadata) {
        const [_, user_metadata] = metadata.data;
        const [groupId, userId] = value;
        
        if (await this.queryBus.execute(new FindUserQuery(userId)) == null)
            throw new BadRequestException({messages: 'User not Existed'});

        const userExisted: boolean = await this.queryBus.execute(new ExistUserGroupQuery(groupId, userId, false, true, false));
        const isUserAdmin: boolean = await this.queryBus.execute(new ExistUserGroupQuery(groupId, userId, true, false, false));

        if (user_metadata == 'userId' && isUserAdmin)
            throw new BadRequestException({messages: 'User is Admin'});

        if (user_metadata == 'userId' && !userExisted)
            throw new BadRequestException({messages: 'User not in Group'});

        if (user_metadata == 'nUserId' && userExisted)
            throw new BadRequestException({messages: 'User in Group'});

        return userId;
    }
}