import { ICommand } from '@nestjs/cqrs';

export class CreateGroupCommand implements ICommand {
  constructor(
    readonly userId: string,
    readonly groupName: string
  ) { }
}