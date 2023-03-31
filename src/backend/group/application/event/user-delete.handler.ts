import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserDeletedEvent } from '../../../user/domain/event/user-delete.event';
import { GroupFactory } from '../../domain/group.factory';
import { IGroupRepository } from '../../domain/repository/igroup.repository';


@EventsHandler(UserDeletedEvent)
export class GroupUserDeletedEventHandler implements IEventHandler<UserDeletedEvent> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
        private groupFactory: GroupFactory
    ) { }

    async handle(event: UserDeletedEvent) {
        switch (event.name) {
            case UserDeletedEvent.name: {
                const { userId } = event as UserDeletedEvent;
                await this.groupRepository.deleteUser(userId, true, true, true);
                const groups = await this.groupRepository.emptyAdmin();
                const groupIds = groups.map((group) => group.groupId);
                if (groupIds.length != 0)
                    this.groupFactory.delete(groupIds);
                break;
            }
            default:
                break;
        }
    }
}