import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from '../../../utils/event/cqrs.event';

export class GroupUpdatedEvent extends CqrsEvent implements IEvent {
    constructor(
        readonly groupId: string,
        readonly groupName: string,
        readonly userId: string,
        readonly addAdmin: boolean,
        readonly addUser: boolean,
        readonly addCandidates: boolean
    ) {
        super(GroupUpdatedEvent.name);
  }
}