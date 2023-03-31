import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GroupDeletedEvent } from '../../domain/event/group-delete.event';
import { IGroupRepository } from '../../domain/repository/igroup.repository';


@EventsHandler(GroupDeletedEvent)
export class GroupDeletedEventHandler implements IEventHandler<GroupDeletedEvent> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
    ) { }

    async handle(event: GroupDeletedEvent) {
        switch (event.name) {
            case GroupDeletedEvent.name: {
                const { groupIds } = event as GroupDeletedEvent;
                await this.groupRepository.delete(groupIds);
                break;
            }
            default:
                break;
        }
    }
}