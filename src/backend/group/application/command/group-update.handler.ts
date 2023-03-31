import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GroupFactory } from '../../domain/group.factory';
import { UpdateGroupCommand } from './group-update.command';

@Injectable()
@CommandHandler(UpdateGroupCommand)
export class UpdateGroupCommandHandler implements ICommandHandler<UpdateGroupCommand> {
    constructor(
        private groupFactory: GroupFactory,
    ) { }

    async execute(command: UpdateGroupCommand) {
        const { groupId, groupName, userId, addAdmin, addUser, addCandidates } = command;
        this.groupFactory.update(groupId, groupName, userId, addAdmin, addUser, addCandidates);
    }
}