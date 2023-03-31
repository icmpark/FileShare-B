
import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GroupFactory } from '../../domain/group.factory';
import { DeleteGroupCommand } from './group-delete.command';

@Injectable()
@CommandHandler(DeleteGroupCommand)
export class DeleteGroupCommandHandler implements ICommandHandler<DeleteGroupCommand> {
    constructor(
        private groupFactory: GroupFactory,
    ) { }

    async execute(command: DeleteGroupCommand) {
        const { groupIds } = command;

        let realGroupIds;

        if (typeof groupIds == 'string')
            realGroupIds = [groupIds];
        else
            realGroupIds = groupIds;

        this.groupFactory.delete(realGroupIds);
    }
}