import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IGroupRepository } from '../../domain/repository/igroup.repository';
import { Group } from '../../domain/group';
import { FindGroupQuery } from './group-find.query';

@QueryHandler(FindGroupQuery)
export class FindGroupQueryHandler implements IQueryHandler<FindGroupQuery> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
    ) { }

    async execute(query: FindGroupQuery): Promise<Group> {
        const { groupId } = query;
        return await this.groupRepository.findByGroupId(groupId);
    }
}