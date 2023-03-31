import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { FindUserQuery } from 'src/backend/user/application/query/user-find.query';
import { ExistUserGroupQuery } from '../../application/query/group-user-exist.query';

@Injectable()
export class UserInGroupAdmin implements PipeTransform<any> {
    constructor(private queryBus: QueryBus) { }

    async transform(value: string[], metadata: ArgumentMetadata) {
        const [_, user_metadata] = metadata.data;
        const [groupId, userId] = value;

        const isGroupUser: boolean = await this.queryBus.execute(new ExistUserGroupQuery(groupId, userId, false, true, false));
        const userExisted: boolean = await this.queryBus.execute(new ExistUserGroupQuery(groupId, userId, true, false, false));


        if (await this.queryBus.execute(new FindUserQuery(userId)) == null)
            throw new BadRequestException({messages: 'User not Existed'});

        if (user_metadata == 'nUserId' && !isGroupUser)
            throw new BadRequestException({messages: 'User not in Group'});

        if (user_metadata == 'userId' && !userExisted)
            throw new BadRequestException({messages: 'User is not Group Admin'});

        if (user_metadata == 'nUserId' && userExisted)
            throw new BadRequestException({messages: 'User is Group Admin'});

        return userId;
    }
}