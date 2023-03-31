import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IGroupRepository } from '../../domain/repository/igroup.repository';
import { Group } from '../../domain/group';
import { SearchUserGroupQuery } from './group-user-search.query';

@QueryHandler(SearchUserGroupQuery)
export class SearchUserGroupQueryHandler implements IQueryHandler<SearchUserGroupQuery> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
    ) { }

    async execute(query: SearchUserGroupQuery): Promise<Group[]> {
        const { userId, isAdmin, isUser, isCandidates, offset, limit } = query;
        return await this.groupRepository.searchUser(userId, isAdmin, isUser, isCandidates, offset, limit);
    }
}