import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GroupUpdatedEvent } from '../../domain/event/group-update.event';
import { IGroupRepository } from '../../domain/repository/igroup.repository';


@EventsHandler(GroupUpdatedEvent)
export class GroupUpdatedEventHandler implements IEventHandler<GroupUpdatedEvent> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
    ) { }

    async handle(event: GroupUpdatedEvent) {
        switch (event.name) {
            case GroupUpdatedEvent.name: {
                const { groupId, groupName, userId, addAdmin, addUser, addCandidates } = event as GroupUpdatedEvent;
                await this.groupRepository.update(groupId, groupName, userId, addAdmin, addUser, addCandidates);
                break;
            }
            default:
                break;
        }
    }
}