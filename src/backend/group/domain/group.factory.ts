import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { GroupCreatedEvent } from './event/group-create.event';
import { GroupUpdatedEvent } from './event/group-update.event';
import { GroupDeletedEvent } from './event/group-delete.event';
import { Group } from './group';

@Injectable()
export class GroupFactory {
    constructor(private eventBus: EventBus) { }

    create(
        groupId: string,
        groupName: string,
        userId: string,
    ): Group {
        const group = new Group(
            groupId,
            groupName,
            [userId],
            [userId],
            []
        );
        this.eventBus.publish(new GroupCreatedEvent(group));
        return group;
    }

    update(
        groupId: string,
        groupName: string,
        userId: string,
        addAdmin: boolean,
        addUser: boolean,
        addCandidates: boolean
    ): void {
        const event = new GroupUpdatedEvent(
            groupId,
            groupName,
            userId,
            addAdmin,
            addUser,
            addCandidates
        );
        this.eventBus.publish(event);
    }

    delete(groupIds: string[]): void {
        const event = new GroupDeletedEvent(groupIds);
        this.eventBus.publish(event);
    }


    reconstitute(
        groupId: string,
        groupName: string,
        groupAdmins: string[],
        groupUsers: string[],
        groupRequests: string[]
    ): Group {
        return new Group(
            groupId,
            groupName,
            groupAdmins,
            groupUsers,
            groupRequests
        );
    }
}