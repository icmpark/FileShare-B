import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IGroupRepository } from '../../domain/repository/igroup.repository';
import { Group } from '../../domain/group';
import { SearchGroupQuery } from './group-search.query';

@QueryHandler(SearchGroupQuery)
export class SearchGroupQueryHandler implements IQueryHandler<SearchGroupQuery> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
    ) { }

    async execute(query: SearchGroupQuery): Promise<Group[]> {
        const { groupName, offset, limit } = query;
        return await this.groupRepository.search(groupName, offset, limit);
    }
}