import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GroupCreatedEvent } from '../../domain/event/group-create.event';
import { IGroupRepository } from '../../domain/repository/igroup.repository';


@EventsHandler(GroupCreatedEvent)
export class GroupCreatedEventHandler implements IEventHandler<GroupCreatedEvent> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
    ) { }

    async handle(event: GroupCreatedEvent) {
        switch (event.name) {
            case GroupCreatedEvent.name: {
                const { group } = event as GroupCreatedEvent;
                await this.groupRepository.create(group);
                break;
            }
            default:
                break;
        }
    }
}