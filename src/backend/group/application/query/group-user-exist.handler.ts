import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IGroupRepository } from '../../domain/repository/igroup.repository';
import { ExistUserGroupQuery } from './group-user-exist.query';

@QueryHandler(ExistUserGroupQuery)
export class ExistUserGroupQueryHandler implements IQueryHandler<ExistUserGroupQuery> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
    ) { }

    async execute(query: ExistUserGroupQuery): Promise<boolean> {
        const { groupId, userId, isAdmin, isUser, isCandidates } = query;
        return await this.groupRepository.existUser(groupId, userId, isAdmin, isUser, isCandidates);
    }
}