import { ICommand } from '@nestjs/cqrs';

export class DeleteGroupUserCommand implements ICommand {
  constructor(
    readonly userId: string,
    readonly isAdmin: boolean,
    readonly isUser: boolean,
    readonly isCandidates: boolean
  ) { }
}