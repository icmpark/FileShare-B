import { ICommand } from '@nestjs/cqrs';

export class UpdateGroupCommand implements ICommand {
  constructor(
    readonly groupId: string,
    readonly groupName: string,
    readonly userId: string,
    readonly addAdmin: boolean,
    readonly addUser: boolean,
    readonly addCandidates: boolean
  ) { }
}