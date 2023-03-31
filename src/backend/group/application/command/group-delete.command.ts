import { ICommand } from '@nestjs/cqrs';

export class DeleteGroupCommand implements ICommand {
  constructor(
    readonly groupIds: string | string[]
  ) { }
}