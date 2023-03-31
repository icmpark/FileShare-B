import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from '../../../utils/event/cqrs.event';
import { Group } from '../group';

export class GroupCreatedEvent extends CqrsEvent implements IEvent {
    constructor(
        readonly group: Group
    ) {
        super(GroupCreatedEvent.name);
    }
}