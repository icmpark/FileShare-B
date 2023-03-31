import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateGroupCommand } from './group-create.command';
import { GroupFactory } from '../../domain/group.factory';
import { v4 as uuid } from 'uuid';

@Injectable()
@CommandHandler(CreateGroupCommand)
export class CreateGroupCommandHandler implements ICommandHandler<CreateGroupCommand> {
    constructor(
        private groupFactory: GroupFactory,
    ) { }

    async execute(command: CreateGroupCommand): Promise<string> {
        const groupId = uuid();
        const { groupName, userId } = command;
        this.groupFactory.create(groupId, groupName, userId);
        return groupId;
    }
}