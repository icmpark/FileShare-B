import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from '../../../utils/event/cqrs.event';

export class GroupDeletedEvent extends CqrsEvent implements IEvent {
    constructor(
        readonly groupIds: string[]
    ) {
        super(GroupDeletedEvent.name);
    }
}