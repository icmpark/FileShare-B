
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteGroupUserCommand } from './group-user-delete.command';
import { IGroupRepository } from '../../domain/repository/igroup.repository';
@Injectable()
@CommandHandler(DeleteGroupUserCommand)
export class DeleteGroupUserCommandHandler implements ICommandHandler<DeleteGroupUserCommand> {
    constructor(
        @Inject('GroupRepository') private groupRepository: IGroupRepository,
    ) { }

    async execute(command: DeleteGroupUserCommand) {
        const { userId, isAdmin, isUser, isCandidates } = command;
        this.groupRepository.deleteUser(userId, isAdmin, isUser, isCandidates);
    }
}